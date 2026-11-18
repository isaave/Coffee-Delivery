export const STORAGE_KEYS = {
  cart: 'coffee-delivery:cart:v1',
  theme: 'coffee-delivery:theme:v1',
  order: 'coffee-delivery:order:v1',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

type TypeGuard<T> = (value: unknown) => value is T

/** Retorna null quando o navegador bloqueia o localStorage (modo privado, SSR, testes). */
function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

/**
 * Leitura defensiva: JSON corrompido, chave ausente ou valor inválido
 * retornam o fallback, nunca quebram a aplicação.
 */
export function readStorage<T>(
  key: StorageKey,
  fallback: T,
  isValid?: TypeGuard<T>,
): T {
  const storage = getStorage()
  if (!storage) return fallback

  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (isValid && !isValid(parsed)) return fallback

    return parsed as T
  } catch {
    return fallback
  }
}

/** Escrita defensiva: cota excedida ou storage indisponível são ignorados com segurança. */
export function writeStorage<T>(key: StorageKey, value: T): void {
  const storage = getStorage()
  if (!storage) return

  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Falha silenciosa e intencional: a aplicação continua funcional em memória.
  }
}
