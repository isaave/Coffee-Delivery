import { useMemo, useState } from 'react'
import { CategoryFilter } from '@/components/CategoryFilter'
import { Hero } from '@/components/Hero'
import { ProductCard } from '@/components/ProductCard'
import { products } from '@/data/products'
import { normalizeTag, type Category } from '@/types/product'
import './CatalogPage.css'

export default function CatalogPage() {
  const [category, setCategory] = useState<Category>('TODOS')

  const visibleProducts = useMemo(() => {
    if (category === 'TODOS') return products

    const target = normalizeTag(category)
    return products.filter((product) =>
      product.tags.some((tag) => normalizeTag(tag) === target),
    )
  }, [category])

  return (
    <>
      <Hero />

      <main className="container catalog" id="catalogo">
        <h2 className="catalog__title">Nossos cafés</h2>

        <CategoryFilter active={category} onChange={setCategory} />

        {visibleProducts.length === 0 ? (
          <p className="catalog__empty" role="status">
            Nenhum café nesta categoria no momento.
          </p>
        ) : (
          <div className="catalog__grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
