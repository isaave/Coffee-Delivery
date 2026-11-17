const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Converte centavos inteiros para a representação em BRL (RN-02). */
export function formatCurrency(cents: number): string {
  return brlFormatter.format(cents / 100)
}

/** Converte um valor em reais para centavos inteiros com arredondamento controlado. */
export function toCents(amountInReais: number): number {
  return Math.round((amountInReais + Number.EPSILON) * 100)
}
