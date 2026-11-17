import { Coffee, MapPin, ShoppingCart } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useCart } from '@/hooks/useCart'
import './Header.css'

export function Header() {
  const { itemCount } = useCart()

  const cartLabel =
    itemCount === 1
      ? 'Carrinho com 1 item'
      : `Carrinho com ${itemCount} itens`

  return (
    <header className="site-header">
      <div className="container site-header__content">
        <a className="brand" href="#catalogo" aria-label="Coffee Delivery — início">
          <Coffee className="brand__icon" size={40} strokeWidth={2.5} aria-hidden="true" />
          <span className="brand__name">
            Coffee
            <br />
            Delivery
          </span>
        </a>

        <div className="delivery-location">
          <MapPin size={22} aria-hidden="true" />
          <span className="delivery-location__text">
            <span className="delivery-location__label">Entregar em</span>
            <span className="delivery-location__address">Rua internacional, 248</span>
          </span>
        </div>

        <div className="header-actions">
          <ThemeToggle />
          <button type="button" className="cart-button" aria-label={cartLabel}>
            <ShoppingCart size={26} strokeWidth={2.2} aria-hidden="true" />
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
