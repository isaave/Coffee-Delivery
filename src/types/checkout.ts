/** Meios de pagamento simulados — nenhuma transação real é executada. */
export const PAYMENT_METHODS = [
  { value: 'credit-card', label: 'Cartão de crédito' },
  { value: 'debit-card', label: 'Cartão de débito' },
  { value: 'cash', label: 'Dinheiro' },
] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value']

export interface Address {
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export interface CheckoutFormValues extends Address {
  name: string
  email: string
  paymentMethod: PaymentMethod
}

/** Snapshot do item no momento da confirmação: preço/nome não mudam depois. */
export interface OrderItem {
  productId: string
  name: string
  image: string
  quantity: number
  unitPriceInCents: number
}

export interface Order {
  id: string
  createdAt: string
  customerName: string
  email: string
  items: OrderItem[]
  address: Address
  paymentMethod: PaymentMethod
  subtotalInCents: number
  shippingInCents: number
  totalInCents: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isOrderItem(value: unknown): value is OrderItem {
  return (
    isRecord(value) &&
    typeof value.productId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.image === 'string' &&
    typeof value.quantity === 'number' &&
    value.quantity > 0 &&
    typeof value.unitPriceInCents === 'number' &&
    Number.isInteger(value.unitPriceInCents)
  )
}

/** Valida o pedido lido do localStorage antes de exibi-lo na tela de sucesso. */
export function isOrder(value: unknown): value is Order {
  if (!isRecord(value)) return false

  const address = value.address
  const addressIsValid =
    isRecord(address) &&
    ['cep', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'].every(
      (field) => typeof address[field] === 'string',
    )

  return (
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.customerName === 'string' &&
    typeof value.email === 'string' &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(isOrderItem) &&
    addressIsValid &&
    PAYMENT_METHODS.some((method) => method.value === value.paymentMethod) &&
    typeof value.subtotalInCents === 'number' &&
    typeof value.shippingInCents === 'number' &&
    typeof value.totalInCents === 'number'
  )
}
