export type Theme = 'light' | 'dark'

export const THEMES: readonly Theme[] = ['light', 'dark']

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/** Type guard: valida valores vindos de localStorage ou de APIs sem usar `any`. */
export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}
