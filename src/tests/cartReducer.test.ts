import { describe, expect, it } from 'vitest'
import { cartReducer, initialCartState } from '@/reducers/cartReducer'
import type { CartState } from '@/types/cart'

describe('cartReducer', () => {
  it('adiciona um novo produto com quantidade 1', () => {
    const next = cartReducer(initialCartState, {
      type: 'ADD',
      productId: 'expresso',
    })

    expect(next).toEqual([{ productId: 'expresso', quantity: 1 }])
  })

  it('acumula quantidade ao adicionar o mesmo produto (RN-01)', () => {
    const first = cartReducer(initialCartState, {
      type: 'ADD',
      productId: 'expresso',
    })
    const second = cartReducer(first, { type: 'ADD', productId: 'expresso' })

    expect(second).toEqual([{ productId: 'expresso', quantity: 2 }])
  })

  it('adiciona a quantidade informada pelo stepper', () => {
    const next = cartReducer(initialCartState, {
      type: 'ADD',
      productId: 'expresso',
      quantity: 3,
    })

    expect(next).toEqual([{ productId: 'expresso', quantity: 3 }])
  })

  it('mantém produtos diferentes em linhas separadas', () => {
    const first = cartReducer(initialCartState, {
      type: 'ADD',
      productId: 'expresso',
    })
    const second = cartReducer(first, { type: 'ADD', productId: 'latte' })

    expect(second).toEqual([
      { productId: 'expresso', quantity: 1 },
      { productId: 'latte', quantity: 1 },
    ])
  })

  it('decrementa até zero e remove a linha (RN-06)', () => {
    const withOne = cartReducer(initialCartState, {
      type: 'ADD',
      productId: 'expresso',
    })
    const emptied = cartReducer(withOne, {
      type: 'DECREMENT',
      productId: 'expresso',
    })

    expect(emptied).toEqual([])
  })

  it('não cria linha ao decrementar produto ausente', () => {
    expect(
      cartReducer(initialCartState, {
        type: 'DECREMENT',
        productId: 'inexistente',
      }),
    ).toEqual([])
  })

  it('remove apenas o produto informado', () => {
    const state: CartState = [
      { productId: 'expresso', quantity: 2 },
      { productId: 'latte', quantity: 1 },
    ]

    expect(cartReducer(state, { type: 'REMOVE', productId: 'expresso' })).toEqual(
      [{ productId: 'latte', quantity: 1 }],
    )
  })

  it('limpa todo o carrinho', () => {
    const state: CartState = [{ productId: 'expresso', quantity: 3 }]
    expect(cartReducer(state, { type: 'CLEAR' })).toEqual([])
  })

  it('não muta o estado anterior', () => {
    const state: CartState = [{ productId: 'expresso', quantity: 1 }]
    const snapshot = structuredClone(state)

    cartReducer(state, { type: 'ADD', productId: 'expresso' })
    cartReducer(state, { type: 'DECREMENT', productId: 'expresso' })
    cartReducer(state, { type: 'REMOVE', productId: 'expresso' })

    expect(state).toEqual(snapshot)
  })
})
