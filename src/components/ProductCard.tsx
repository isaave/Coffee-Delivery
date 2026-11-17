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
  const [quantity, setQuantity] = useState(0)
  const { addItem } = useCart()
  const price = formatCurrency(product.priceInCents).replace('R$', '').trim()

  function handleAdd() {
    if (quantity < 1) return
    addItem(product.id, quantity)
    setQuantity(0)
  }

  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={product.image}
        alt={`Pires e a xícara de café ${product.name}`}
        loading="lazy"
        width={120}
        height={120}
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
          R$ <strong>{price}</strong>
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
            disabled={quantity < 1}
            aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}
          >
            <ShoppingCart size={22} fill="currentColor" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
