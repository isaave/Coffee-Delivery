/**
 * RN-03 — frete por região. Valores em centavos inteiros.
 * A UF vem do ViaCEP; CEP inválido nunca altera o frete porque a UF não é
 * preenchida nesse caso.
 */

export const DEFAULT_SHIPPING_IN_CENTS = 1490

const SHIPPING_BY_REGION = {
  norte: 2590,
  nordeste: 1990,
  centroOeste: 2290,
  sudeste: 1490,
  sul: 1290,
} as const

type Region = keyof typeof SHIPPING_BY_REGION

const REGION_BY_STATE: Readonly<Record<string, Region>> = {
  AC: 'norte',
  AP: 'norte',
  AM: 'norte',
  PA: 'norte',
  RO: 'norte',
  RR: 'norte',
  TO: 'norte',
  AL: 'nordeste',
  BA: 'nordeste',
  CE: 'nordeste',
  MA: 'nordeste',
  PB: 'nordeste',
  PE: 'nordeste',
  PI: 'nordeste',
  RN: 'nordeste',
  SE: 'nordeste',
  DF: 'centroOeste',
  GO: 'centroOeste',
  MT: 'centroOeste',
  MS: 'centroOeste',
  ES: 'sudeste',
  MG: 'sudeste',
  RJ: 'sudeste',
  SP: 'sudeste',
  PR: 'sul',
  RS: 'sul',
  SC: 'sul',
}

export function getShippingInCents(state: string): number {
  const region = REGION_BY_STATE[state.trim().toUpperCase()]
  return region ? SHIPPING_BY_REGION[region] : DEFAULT_SHIPPING_IN_CENTS
}
