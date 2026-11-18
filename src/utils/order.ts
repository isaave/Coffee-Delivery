import { normalizeCep } from '@/utils/cep'
import type { CartState } from '@/types/cart'
import {
  isOrder,
  type CheckoutFormValues,
  type Order,
  type OrderItem,
} from '@/types/checkout'
import type { Product } from '@/types/product'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'
import { calculateTotals } from '@/utils/totals'
import { getShippingInCents } from '@/utils/shipping'

function isOrderOrNull(value: unknown): value is Order | null {
  return value === null || isOrder(value)
}

export function loadOrder(): Order | null {
  return readStorage<Order | null>(STORAGE_KEYS.order, null, isOrderOrNull)
}

export function saveOrder(order: Order): void {
  writeStorage(STORAGE_KEYS.order, order)
}

export function clearOrder(): void {
  writeStorage(STORAGE_KEYS.order, null)
}

function createOrderId(): string {
  const random = globalThis.crypto?.randomUUID?.()
  return random ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Congela nome/preço/quantidade no momento da confirmação (RN-02). */
export function buildOrder(
  items: CartState,
  catalog: readonly Product[],
  values: CheckoutFormValues,
): Order {
  const shippingInCents = getShippingInCents(values.state)
  const totals = calculateTotals(items, catalog, shippingInCents)

  const orderItems: OrderItem[] = items.flatMap((item) => {
    const product = catalog.find((entry) => entry.id === item.productId)
    if (!product) return []

    return [
      {
        productId: product.id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        unitPriceInCents: product.priceInCents,
      },
    ]
  })

  return {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    customerName: values.name.trim(),
    email: values.email.trim(),
    items: orderItems,
    address: {
      cep: normalizeCep(values.cep),
      street: values.street.trim(),
      number: values.number.trim(),
      complement: values.complement.trim(),
      neighborhood: values.neighborhood.trim(),
      city: values.city.trim(),
      state: values.state,
    },
    paymentMethod: values.paymentMethod,
    subtotalInCents: totals.subtotalInCents,
    shippingInCents: totals.shippingInCents,
    totalInCents: totals.totalInCents,
  }
}
