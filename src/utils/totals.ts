import type { CartState } from '@/types/cart'
import type { Product } from '@/types/product'

export interface CartTotals {
  subtotalInCents: number
  shippingInCents: number
  totalInCents: number
  itemCount: number
}

export function getCartItemCount(items: CartState): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Soma sempre em centavos inteiros: priceInCents * quantity não produz
 * erro de ponto flutuante. Produtos desconhecidos são ignorados.
 */
export function calculateTotals(
  items: CartState,
  catalog: readonly Product[],
  shippingInCents = 0,
): CartTotals {
  const subtotalInCents = items.reduce((sum, item) => {
    const product = catalog.find((entry) => entry.id === item.productId)
    if (!product) return sum

    return sum + product.priceInCents * item.quantity
  }, 0)

  return {
    subtotalInCents,
    shippingInCents,
    totalInCents: subtotalInCents + shippingInCents,
    itemCount: getCartItemCount(items),
  }
}
