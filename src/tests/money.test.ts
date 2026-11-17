import { describe, expect, it } from 'vitest'
import { formatCurrency, toCents } from '@/utils/money'

describe('money', () => {
  it('formata centavos como BRL (RN-02)', () => {
    expect(formatCurrency(1250)).toBe('R$\u00a012,50')
    expect(formatCurrency(1990)).toBe('R$\u00a019,90')
  })

  it('formata zero', () => {
    expect(formatCurrency(0)).toBe('R$\u00a00,00')
  })

  it('converte reais para centavos com arredondamento', () => {
    expect(toCents(12.5)).toBe(1250)
    expect(toCents(19.9)).toBe(1990)
    expect(toCents(1.005)).toBe(101)
  })
})
