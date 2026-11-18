/** Integração ViaCEP isolada: pura o suficiente para testar sem DOM (RF-06). */

export interface CepAddress {
  street: string
  neighborhood: string
  city: string
  state: string
}

export type CepErrorKind = 'invalid' | 'not-found' | 'network'

export class CepError extends Error {
  readonly kind: CepErrorKind

  constructor(message: string, kind: CepErrorKind) {
    super(message)
    this.name = 'CepError'
    this.kind = kind
  }
}

/** Remove máscara e limita a 8 dígitos (RN-05). */
export function normalizeCep(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8)
}

export function isValidCep(value: string): boolean {
  return /^\d{8}$/.test(normalizeCep(value))
}

interface ViaCepResponse {
  logradouro?: unknown
  bairro?: unknown
  localidade?: unknown
  uf?: unknown
  erro?: unknown
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export async function fetchAddress(
  rawCep: string,
  signal?: AbortSignal,
): Promise<CepAddress> {
  const cep = normalizeCep(rawCep)

  if (!isValidCep(cep)) {
    throw new CepError('Informe um CEP válido com 8 dígitos.', 'invalid')
  }

  let response: Response
  try {
    response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal })
  } catch (error) {
    if (isAbort(error)) throw error
    throw new CepError(
      'Não foi possível consultar o CEP. Verifique sua conexão.',
      'network',
    )
  }

  if (!response.ok) {
    throw new CepError(
      'Não foi possível consultar o CEP. Tente novamente.',
      'network',
    )
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new CepError('Resposta inválida ao consultar o CEP.', 'network')
  }

  if (typeof payload !== 'object' || payload === null) {
    throw new CepError('Resposta inválida ao consultar o CEP.', 'network')
  }

  const data = payload as ViaCepResponse
  if (data.erro === true || typeof data.erro === 'string') {
    throw new CepError('CEP não encontrado.', 'not-found')
  }

  const address: CepAddress = {
    street: asText(data.logradouro),
    neighborhood: asText(data.bairro),
    city: asText(data.localidade),
    state: asText(data.uf).toUpperCase(),
  }

  if (!address.city) {
    throw new CepError('CEP não encontrado.', 'not-found')
  }

  return address
}
