import { useContext } from 'react'
import { CartContext } from '@/contexts/cartContext'
import type { CartContextValue } from '@/types/cart'

/** Única forma permitida de consumir o carrinho nos componentes. */
export function useCart(): CartContextValue {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart precisa ser usado dentro de <CartProvider>.')
  }

  return context
}
