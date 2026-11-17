import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { QuantityStepper } from '@/components/QuantityStepper'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types/product'
import { formatCurrency } from '@/utils/money'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  function handleAdd() {
    addItem(product.id, quantity)
    setQuantity(1)
  }

  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={product.image}
        alt={`Embalagem de ${product.name}`}
        loading="lazy"
      />

      <ul className="product-card__tags" aria-label="Características do café">
        {product.tags.map((tag) => (
          <li className="product-card__tag" key={tag}>
            {tag}
          </li>
        ))}
      </ul>

      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__description">{product.description}</p>

      <div className="product-card__footer">
        <span className="product-card__price">
          {formatCurrency(product.priceInCents)}
        </span>

        <div className="product-card__actions">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            productName={product.name}
          />
          <button
            type="button"
            className="product-card__add"
            onClick={handleAdd}
            aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}
          >
            <ShoppingCart size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
