import { afterEach, describe, expect, it, vi } from 'vitest'
import { CepError, fetchAddress, isValidCep, normalizeCep } from '@/utils/cep'

function mockResponse(data: unknown, ok = true): Response {
  return {
    ok,
    json: async () => data,
  } as unknown as Response
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('normalizeCep / isValidCep', () => {
  it('remove máscara e limita a 8 dígitos', () => {
    expect(normalizeCep('01310-100123')).toBe('01310100')
    expect(isValidCep('01310-100')).toBe(true)
    expect(isValidCep('1310100')).toBe(false)
    expect(isValidCep('abc')).toBe(false)
  })
})

describe('fetchAddress', () => {
  it('preenche rua, bairro, cidade e UF', async () => {
    const fetchMock = vi.fn(async () =>
      mockResponse({
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'sp',
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchAddress('01310-100')).resolves.toEqual({
      street: 'Avenida Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/01310100/json/',
      { signal: undefined },
    )
  })

  it('não consulta a API com CEP inválido', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchAddress('123')).rejects.toMatchObject({
      kind: 'invalid',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('trata CEP não encontrado', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => mockResponse({ erro: true })))

    await expect(fetchAddress('00000000')).rejects.toMatchObject({
      kind: 'not-found',
    })
  })

  it('trata falha de rede e resposta não-OK', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('Network error')
    }))
    await expect(fetchAddress('01310100')).rejects.toMatchObject({
      kind: 'network',
    })

    vi.stubGlobal('fetch', vi.fn(async () => mockResponse({}, false)))
    await expect(fetchAddress('01310100')).rejects.toMatchObject({
      kind: 'network',
    })
  })

  it('propaga abort para não sobrescrever resultados obsoletos', async () => {
    const abort = new Error('Abortada')
    abort.name = 'AbortError'
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw abort
    }))

    await expect(fetchAddress('01310100')).rejects.toBe(abort)
  })

  it('usa CepError com mensagem amigável', () => {
    expect(new CepError('CEP não encontrado.', 'not-found').message).toBe(
      'CEP não encontrado.',
    )
  })
})
