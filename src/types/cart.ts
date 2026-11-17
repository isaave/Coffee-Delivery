import type { ProductId } from '@/types/product'

export interface CartItem {
  productId: ProductId
  quantity: number // sempre >= 1
}

export type CartState = CartItem[]

export type CartAction =
  | { type: 'ADD'; productId: ProductId; quantity?: number }
  | { type: 'INCREMENT'; productId: ProductId }
  | { type: 'DECREMENT'; productId: ProductId }
  | { type: 'REMOVE'; productId: ProductId }
  | { type: 'CLEAR' }

export interface CartContextValue {
  items: CartState
  itemCount: number
  addItem: (productId: ProductId, quantity?: number) => void
  increment: (productId: ProductId) => void
  decrement: (productId: ProductId) => void
  removeItem: (productId: ProductId) => void
  clearCart: () => void
}

/** Valida dados vindos do localStorage antes de confiar neles. */
export function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false

  const item = value as Record<string, unknown>

  return (
    typeof item.productId === 'string' &&
    item.productId.length > 0 &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  )
}

export function isCartState(value: unknown): value is CartState {
  return Array.isArray(value) && value.every(isCartItem)
}
