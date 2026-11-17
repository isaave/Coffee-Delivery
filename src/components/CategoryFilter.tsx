import { CATEGORIES, type Category } from '@/types/product'
import './CategoryFilter.css'

interface CategoryFilterProps {
  active: Category
  onChange: (category: Category) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div
      className="category-filter"
      role="group"
      aria-label="Filtrar cafés por categoria"
    >
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-filter__button${
            active === category ? ' category-filter__button--active' : ''
          }`}
          aria-pressed={active === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
