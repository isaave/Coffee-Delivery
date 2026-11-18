import { useState } from 'react'
import { CheckCircle2, CreditCard, MapPin, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  PAYMENT_METHODS,
  type PaymentMethod,
} from '@/types/checkout'
import { formatCurrency } from '@/utils/money'
import { clearOrder, loadOrder } from '@/utils/order'
import './SuccessPage.css'

function paymentLabel(method: PaymentMethod): string {
  return PAYMENT_METHODS.find((entry) => entry.value === method)?.label ?? method
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}

export function SuccessPage() {
  const navigate = useNavigate()
  // O snapshot é lido uma vez: recarregar a página mantém o comprovante.
  const [order] = useState(loadOrder)

  function handleBack() {
    clearOrder()
    navigate('/', { replace: true })
  }

  if (!order) {
    return (
      <main className="container success">
        <div className="success__empty" role="status">
          <h1 className="success__title">Nenhum pedido encontrado</h1>
          <p>Não há um pedido confirmado para exibir.</p>
          <button type="button" className="success__back" onClick={handleBack}>
            Voltar ao catálogo
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="container success">
      <div className="success__hero">
        <CheckCircle2 size={56} className="success__icon" aria-hidden="true" />
        <h1 className="success__title">Pedido confirmado!</h1>
        <p className="success__lead">
          Obrigado, {order.customerName}! Seu pedido foi recebido e será
          preparado em breve.
        </p>
        <p className="success__meta">
          Pedido <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
          {order.createdAt && ` · ${formatDate(order.createdAt)}`}
        </p>
      </div>

      <div className="success__layout">
        <section className="success__card" aria-labelledby="success-items-title">
          <h2 className="success__section-title" id="success-items-title">
            <Package size={20} aria-hidden="true" /> Itens do pedido
          </h2>
          <ul className="success__items">
            {order.items.map((item) => (
              <li className="success__item" key={item.productId}>
                <img src={item.image} alt="" width={56} height={56} />
                <div className="success__item-info">
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity}× {formatCurrency(item.unitPriceInCents)}
                  </span>
                </div>
                <strong className="success__item-total">
                  {formatCurrency(item.unitPriceInCents * item.quantity)}
                </strong>
              </li>
            ))}
          </ul>

          <dl className="success__totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(order.subtotalInCents)}</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>{formatCurrency(order.shippingInCents)}</dd>
            </div>
            <div className="success__total">
              <dt>Total</dt>
              <dd>{formatCurrency(order.totalInCents)}</dd>
            </div>
          </dl>
        </section>

        <div className="success__details">
          <section className="success__card" aria-labelledby="success-address-title">
            <h2 className="success__section-title" id="success-address-title">
              <MapPin size={20} aria-hidden="true" /> Entrega
            </h2>
            <address className="success__address">
              {order.address.street}, {order.address.number}
              {order.address.complement && ` — ${order.address.complement}`}
              <br />
              {order.address.neighborhood} — {order.address.city}/{order.address.state}
              <br />
              CEP {order.address.cep}
              <br />
              {order.email}
            </address>
          </section>

          <section className="success__card" aria-labelledby="success-payment-title">
            <h2 className="success__section-title" id="success-payment-title">
              <CreditCard size={20} aria-hidden="true" /> Pagamento
            </h2>
            <p>{paymentLabel(order.paymentMethod)}</p>
            <p className="success__note">Pagamento simulado — nenhuma cobrança foi feita.</p>
          </section>
        </div>
      </div>

      <button type="button" className="success__back" onClick={handleBack}>
        Voltar ao catálogo
      </button>
    </main>
  )
}
