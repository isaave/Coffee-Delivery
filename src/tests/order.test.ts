import { describe, expect, it } from 'vitest'
import type { CheckoutFormValues } from '@/types/checkout'
import type { Product } from '@/types/product'
import { buildOrder, loadOrder } from '@/utils/order'

const catalog: Product[] = [
  {
    id: 'expresso',
    name: 'Expresso Tradicional',
    description: 'Café expresso tradicional',
    priceInCents: 900,
    image: '/images/coffee/coffee-01.png',
    tags: ['tradicional'],
  },
]

const values: CheckoutFormValues = {
  name: 'Isabella Avelina',
  email: 'isabella@example.com',
  cep: '01310100',
  street: 'Avenida Paulista',
  number: '248',
  complement: '',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  paymentMethod: 'cash',
}

describe('buildOrder', () => {
  it('congela itens, endereço e totais com frete da UF', () => {
    const order = buildOrder([{ productId: 'expresso', quantity: 3 }], catalog, values)

    expect(order.items).toHaveLength(1)
    expect(order.items[0]).toMatchObject({
      productId: 'expresso',
      name: 'Expresso Tradicional',
      quantity: 3,
      unitPriceInCents: 900,
    })
    expect(order.address).toMatchObject({ city: 'São Paulo', state: 'SP' })
    expect(order.subtotalInCents).toBe(2700)
    expect(order.shippingInCents).toBe(1490)
    expect(order.totalInCents).toBe(4190)
    expect(order.id.length).toBeGreaterThan(0)
  })

  it('ignora produtos desconhecidos do carrinho', () => {
    const order = buildOrder(
      [
        { productId: 'expresso', quantity: 1 },
        { productId: 'inexistente', quantity: 5 },
      ],
      catalog,
      values,
    )
    expect(order.items).toHaveLength(1)
    expect(order.totalInCents).toBe(2390)
  })

  it('não lê pedido corrompido do localStorage', () => {
    expect(loadOrder()).toBeNull()
  })
})
