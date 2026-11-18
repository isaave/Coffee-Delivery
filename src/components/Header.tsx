import { MapPin, ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useCart } from '@/hooks/useCart'
import './Header.css'

export function Header() {
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const cartLabel =
    itemCount === 1
      ? 'Carrinho com 1 item'
      : `Carrinho com ${itemCount} itens`

  return (
    <header className="site-header">
      <div className="container site-header__content">
        <Link className="brand" to="/" aria-label="Coffee Delivery — início">
          <img
            src="/images/logo.svg"
            alt="Coffee Delivery"
            width={85}
            height={40}
          />
        </Link>

        <div className="header-actions">
          <div className="delivery-location">
            <MapPin size={22} fill="currentColor" aria-hidden="true" />
            <span className="delivery-location__address">
              Rua internacional, 248
            </span>
          </div>

          <ThemeToggle />

          <button
            type="button"
            className="cart-button"
            aria-label={cartLabel}
            onClick={() => navigate('/checkout')}
          >
            <ShoppingCart size={22} fill="currentColor" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="cart-button__badge" aria-hidden="true">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
