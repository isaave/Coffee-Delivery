import { describe, expect, it } from 'vitest'
import { checkoutSchema } from '@/schemas/checkoutSchema'
import { isOrder } from '@/types/checkout'

const valid = {
  name: 'Isabella Avelina',
  email: 'isabella@example.com',
  cep: '01310100',
  street: 'Avenida Paulista',
  number: '248',
  complement: 'Apto 12',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  paymentMethod: 'credit-card' as const,
}

describe('checkoutSchema', () => {
  it('aceita um checkout válido', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true)
  })

  it('aceita complemento vazio (RN-04)', () => {
    expect(checkoutSchema.safeParse({ ...valid, complement: '' }).success).toBe(true)
  })

  it('aceita CEP digitado com máscara', () => {
    expect(checkoutSchema.safeParse({ ...valid, cep: '01310-100' }).success).toBe(true)
  })

  it.each([
    ['name', 'Is', 'Informe seu nome completo.'],
    ['email', 'invalido', 'Informe um e-mail válido.'],
    ['cep', '1310100', 'Informe um CEP com 8 dígitos.'],
    ['number', '', 'Informe o número.'],
    ['state', 'sp', 'Informe a UF com 2 letras maiúsculas.'],
  ])('rejeita %s inválido', (field, value, message) => {
    const result = checkoutSchema.safeParse({ ...valid, [field]: value })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === message)).toBe(true)
    }
  })

  it('exige uma forma de pagamento', () => {
    const { paymentMethod: _ignored, ...withoutPayment } = valid
    const result = checkoutSchema.safeParse(withoutPayment)
    expect(result.success).toBe(false)
  })

  it('rejeita forma de pagamento desconhecida', () => {
    expect(
      checkoutSchema.safeParse({ ...valid, paymentMethod: 'pix' }).success,
    ).toBe(false)
  })
})

describe('isOrder', () => {
  it('rejeita objeto vazio e pedido sem itens', () => {
    expect(isOrder(null)).toBe(false)
    expect(isOrder({})).toBe(false)
  })

  it('aceita um pedido completo', () => {
    expect(
      isOrder({
        id: 'ABC123',
        createdAt: new Date().toISOString(),
        customerName: 'Isabella Avelina',
        email: 'isabella@example.com',
        items: [
          {
            productId: 'expresso-tradicional',
            name: 'Expresso Tradicional',
            image: '/images/coffee/coffee-01.png',
            quantity: 2,
            unitPriceInCents: 900,
          },
        ],
        address: {
          cep: '01310100',
          street: 'Avenida Paulista',
          number: '248',
          complement: '',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
        },
        paymentMethod: 'cash',
        subtotalInCents: 1800,
        shippingInCents: 1490,
        totalInCents: 3290,
      }),
    ).toBe(true)
  })
})
