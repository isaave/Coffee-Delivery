import type { Product, ProductId } from '@/types/product'

const image = (number: number): string =>
  `/images/coffee/coffee-${String(number).padStart(2, '0')}.png`

/** Catálogo tipado. As imagens foram extraídas do arquivo Figma do projeto. */
export const products: readonly Product[] = [
  {
    id: 'expresso-tradicional',
    name: 'Expresso Tradicional',
    description: 'O tradicional café feito com água quente e grãos moídos.',
    priceInCents: 1250,
    image: image(1),
    tags: ['Tradicional'],
  },
  {
    id: 'expresso-americano',
    name: 'Expresso Americano',
    description: 'Expresso diluído, menos intenso na degustação.',
    priceInCents: 1500,
    image: image(2),
    tags: ['Tradicional'],
  },
  {
    id: 'expresso-cremoso',
    name: 'Expresso Cremoso',
    description: 'Café expresso com crema macia e sabor equilibrado.',
    priceInCents: 1750,
    image: image(3),
    tags: ['Tradicional'],
  },
  {
    id: 'cafe-gelado',
    name: 'Café Gelado',
    description: 'Café gelado refrescante, ideal para dias quentes.',
    priceInCents: 1200,
    image: image(4),
    tags: ['Gelado', 'Tradicional'],
  },
  {
    id: 'cafe-com-leite',
    name: 'Café com Leite',
    description: 'Expresso com leite vaporizado e textura aveludada.',
    priceInCents: 1600,
    image: image(5),
    tags: ['Tradicional', 'Com leite'],
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Espuma de leite abundante sobre um expresso suave.',
    priceInCents: 2000,
    image: image(6),
    tags: ['Tradicional', 'Com leite'],
  },
  {
    id: 'capuccino',
    name: 'Capuccino',
    description: 'Expresso, leite espumoso e chocolate em pó.',
    priceInCents: 2200,
    image: image(7),
    tags: ['Tradicional', 'Com leite'],
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    description: 'Expresso marcado com uma pequena quantidade de leite.',
    priceInCents: 2350,
    image: image(8),
    tags: ['Tradicional', 'Com leite'],
  },
  {
    id: 'chocolate-quente',
    name: 'Café com Chocolate Quente',
    description: 'Café cremoso com chocolate quente e leite.',
    priceInCents: 2500,
    image: image(9),
    tags: ['Com leite'],
  },
  {
    id: 'cubano',
    name: 'Cubano',
    description: 'Expresso forte com açúcar e um toque de canela.',
    priceInCents: 2700,
    image: image(10),
    tags: ['Tradicional'],
  },
  {
    id: 'cafe-coherent',
    name: 'Café Coherent',
    description: 'Blend especial de grãos selecionados e torra média.',
    priceInCents: 3000,
    image: image(11),
    tags: ['Especial'],
  },
  {
    id: 'cafe-supremo',
    name: 'Café Supremo',
    description: 'O melhor da colheita: intenso, doce e com final longo.',
    priceInCents: 3500,
    image: image(12),
    tags: ['Especial'],
  },
]

export function findProductById(id: ProductId): Product | undefined {
  return products.find((product) => product.id === id)
}
