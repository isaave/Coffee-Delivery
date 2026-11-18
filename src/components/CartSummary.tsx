import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QuantityStepper } from '@/components/QuantityStepper'
import { findProductById } from '@/data/products'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/money'
import type { CartTotals } from '@/utils/totals'
import './CartSummary.css'

interface CartSummaryProps {
  totals: CartTotals
  disabled: boolean
}

export function CartSummary({ totals, disabled }: CartSummaryProps) {
  const { items, increment, decrement, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <aside className="cart-summary cart-summary--empty" role="status">
        <h2 className="cart-summary__title">Resumo do pedido</h2>
        <p>Seu carrinho está vazio.</p>
        <Link className="cart-summary__link" to="/">
          Escolher cafés
        </Link>
      </aside>
    )
  }

  return (
    <aside className="cart-summary" aria-labelledby="cart-summary-title">
      <h2 className="cart-summary__title" id="cart-summary-title">
        Resumo do pedido
      </h2>

      <ul className="cart-summary__list">
        {items.map((item) => {
          const product = findProductById(item.productId)
          if (!product) return null

          return (
            <li className="cart-summary__item" key={item.productId}>
              <img
                src={product.image}
                alt=""
                width={64}
                height={64}
                className="cart-summary__image"
              />

              <div className="cart-summary__info">
                <strong className="cart-summary__name">{product.name}</strong>
                <span className="cart-summary__unit">
                  {formatCurrency(product.priceInCents)} / un.
                </span>
                <QuantityStepper
                  value={item.quantity}
                  productName={product.name}
                  onChange={(update) => {
                    const next = update(item.quantity)
                    if (next <= 0) {
                      removeItem(item.productId)
                    } else if (next > item.quantity) {
                      increment(item.productId)
                    } else if (next < item.quantity) {
                      decrement(item.productId)
                    }
                  }}
                />
              </div>

              <div className="cart-summary__item-end">
                <strong className="cart-summary__subtotal">
                  {formatCurrency(product.priceInCents * item.quantity)}
                </strong>
                <button
                  type="button"
                  className="cart-summary__remove"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remover ${product.name} do pedido`}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <dl className="cart-summary__totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(totals.subtotalInCents)}</dd>
        </div>
        <div>
          <dt>Entrega</dt>
          <dd>{formatCurrency(totals.shippingInCents)}</dd>
        </div>
        <div className="cart-summary__total">
          <dt>Total</dt>
          <dd>{formatCurrency(totals.totalInCents)}</dd>
        </div>
      </dl>

      <button
        type="submit"
        form="checkout-form"
        className="cart-summary__submit"
        disabled={disabled}
      >
        Confirmar pedido
      </button>
      <p className="cart-summary__note">
        Pedido simulado — nenhum pagamento real será processado.
      </p>
    </aside>
  )
}
