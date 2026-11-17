import { describe, expect, it } from 'vitest'
import { products } from '@/data/products'
import type { CartState } from '@/types/cart'
import { calculateTotals, getCartItemCount } from '@/utils/totals'

describe('totals', () => {
  it('soma o subtotal em centavos inteiros', () => {
    const items: CartState = [
      { productId: 'expresso-tradicional', quantity: 2 }, // 1250 * 2
      { productId: 'cafe-gelado', quantity: 1 }, // 1200
    ]

    expect(calculateTotals(items, products)).toEqual({
      subtotalInCents: 3700,
      shippingInCents: 0,
      totalInCents: 3700,
      itemCount: 3,
    })
  })

  it('inclui o frete no total sem alterar o subtotal', () => {
    const items: CartState = [{ productId: 'latte', quantity: 1 }]

    expect(calculateTotals(items, products, 1500)).toEqual({
      subtotalInCents: 2000,
      shippingInCents: 1500,
      totalInCents: 3500,
      itemCount: 1,
    })
  })

  it('ignora produtos que não estão no catálogo', () => {
    const items: CartState = [{ productId: 'inexistente', quantity: 5 }]

    expect(calculateTotals(items, products).totalInCents).toBe(0)
  })

  it('conta a soma das quantidades', () => {
    const items: CartState = [
      { productId: 'expresso-tradicional', quantity: 2 },
      { productId: 'latte', quantity: 3 },
    ]

    expect(getCartItemCount(items)).toBe(5)
  })
})
