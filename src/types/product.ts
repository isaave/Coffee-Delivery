export type ProductId = string

/** Preços são sempre inteiros em centavos para evitar erro de ponto flutuante. */
export interface Product {
  id: ProductId
  name: string
  description: string
  priceInCents: number
  image: string
  tags: string[]
}

export const CATEGORIES = [
  'TODOS',
  'TRADICIONAL',
  'GELADO',
  'COM LEITE',
  'ALCOÓLICO',
  'ESPECIAL',
] as const

export type Category = (typeof CATEGORIES)[number]

export function normalizeTag(tag: string): string {
  return tag
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}
