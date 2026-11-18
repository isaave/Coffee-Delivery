import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SHIPPING_IN_CENTS,
  getShippingInCents,
} from '@/utils/shipping'

describe('getShippingInCents', () => {
  it.each([
    ['AM', 2590],
    ['PE', 1990],
    ['DF', 2290],
    ['SP', 1490],
    ['RS', 1290],
  ])('usa o frete da região da UF %s', (state, expected) => {
    expect(getShippingInCents(state)).toBe(expected)
  })

  it('aceita UF em minúsculas e com espaços', () => {
    expect(getShippingInCents(' sp ')).toBe(1490)
  })

  it('usa o frete padrão para UF desconhecida (CEP inválido não altera o frete)', () => {
    expect(getShippingInCents('')).toBe(DEFAULT_SHIPPING_IN_CENTS)
    expect(getShippingInCents('XX')).toBe(DEFAULT_SHIPPING_IN_CENTS)
  })
})
