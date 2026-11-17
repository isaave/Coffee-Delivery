import { describe, expect, it } from 'vitest'
import { isCartState } from '@/types/cart'

describe('isCartState', () => {
  it('aceita um carrinho válido', () => {
    expect(
      isCartState([{ productId: 'expresso', quantity: 2 }]),
    ).toBe(true)
    expect(isCartState([])).toBe(true)
  })

  it('rejeita dados corrompidos do localStorage', () => {
    expect(isCartState(null)).toBe(false)
    expect(isCartState({ productId: 'expresso', quantity: 1 })).toBe(false)
    expect(isCartState([{ productId: 'expresso', quantity: 0 }])).toBe(false)
    expect(isCartState([{ productId: 'expresso', quantity: -1 }])).toBe(false)
    expect(isCartState([{ productId: 'expresso', quantity: 1.5 }])).toBe(false)
    expect(isCartState([{ productId: '', quantity: 1 }])).toBe(false)
    expect(isCartState([{ productId: 'expresso' }])).toBe(false)
  })
})
