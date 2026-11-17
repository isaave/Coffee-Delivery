import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { CartContext } from '@/contexts/cartContext'
import { cartReducer, initialCartState } from '@/reducers/cartReducer'
import { isCartState, type CartContextValue, type CartState } from '@/types/cart'
import type { ProductId } from '@/types/product'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'
import { getCartItemCount } from '@/utils/totals'

interface CartProviderProps {
  children: ReactNode
}

function getInitialCart(): CartState {
  return readStorage(STORAGE_KEYS.cart, initialCartState, isCartState)
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, dispatch] = useReducer(cartReducer, undefined, getInitialCart)

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, items)
  }, [items])

  const addItem = useCallback((productId: ProductId, quantity = 1) => {
    dispatch({ type: 'ADD', productId, quantity })
  }, [])

  const increment = useCallback((productId: ProductId) => {
    dispatch({ type: 'INCREMENT', productId })
  }, [])

  const decrement = useCallback((productId: ProductId) => {
    dispatch({ type: 'DECREMENT', productId })
  }, [])

  const removeItem = useCallback((productId: ProductId) => {
    dispatch({ type: 'REMOVE', productId })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const itemCount = useMemo(() => getCartItemCount(items), [items])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
    }),
    [items, itemCount, addItem, increment, decrement, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
