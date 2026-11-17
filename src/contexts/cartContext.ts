import { createContext } from 'react'
import type { CartContextValue } from '@/types/cart'

/** Contexto separado do provider para preservar o Fast Refresh. */
export const CartContext = createContext<CartContextValue | null>(null)
