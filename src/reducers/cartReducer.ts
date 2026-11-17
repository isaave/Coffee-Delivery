import type { CartAction, CartState } from '@/types/cart'
import type { ProductId } from '@/types/product'

export const initialCartState: CartState = []

/** Retorna um NOVO array: itens com quantidade 0 são removidos (RN-06). */
function changeQuantity(
  state: CartState,
  productId: ProductId,
  delta: number,
): CartState {
  return state
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + delta }
        : item,
    )
    .filter((item) => item.quantity > 0)
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const quantity = action.quantity ?? 1
      if (quantity <= 0) return state

      const alreadyInCart = state.some(
        (item) => item.productId === action.productId,
      )

      if (alreadyInCart) return changeQuantity(state, action.productId, quantity)

      return [...state, { productId: action.productId, quantity }]
    }

    case 'INCREMENT':
      return changeQuantity(state, action.productId, 1)

    case 'DECREMENT':
      return changeQuantity(state, action.productId, -1)

    case 'REMOVE':
      return state.filter((item) => item.productId !== action.productId)

    case 'CLEAR':
      return []

    default: {
      const exhaustive: never = action
      return exhaustive
    }
  }
}
