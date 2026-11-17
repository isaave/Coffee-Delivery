import { createContext } from 'react'
import type { ThemeContextValue } from '@/types/theme'

/** Contexto puro, separado do provider para preservar o Fast Refresh. */
export const ThemeContext = createContext<ThemeContextValue | null>(null)
