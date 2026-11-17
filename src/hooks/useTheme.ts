import { useContext } from 'react'
import { ThemeContext } from '@/contexts/themeContext'
import type { ThemeContextValue } from '@/types/theme'

/** Única forma permitida de consumir o tema nos componentes. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de <ThemeProvider>.')
  }

  return context
}
