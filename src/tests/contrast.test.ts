/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Regressão de contraste: o Lighthouse não avalia estados de hover nem ícones
 * SVG, então os pares semânticos são verificados diretamente nos tokens.
 */

const tokensCss = readFileSync(
  new URL('../styles/tokens.css', import.meta.url),
  'utf8',
)

type TokenMap = Map<string, string>

function extractBlock(pattern: RegExp): string {
  const match = tokensCss.match(pattern)
  const block = match?.[1]
  if (!block) throw new Error('Bloco de tokens não encontrado')
  return block
}

function parseTokens(block: string): TokenMap {
  const tokens: TokenMap = new Map()
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const name = match[1]
    const value = match[2]
    if (name && value) tokens.set(name, value.trim())
  }
  return tokens
}

function resolve(tokens: TokenMap, token: string, depth = 0): string {
  if (depth > 10) throw new Error(`Referência circular em ${token}`)
  const value = tokens.get(token)
  if (!value) throw new Error(`Token ${token} não encontrado`)
  const reference = value.match(/^var\((--[\w-]+)\)$/)
  return reference?.[1]
    ? resolve(tokens, reference[1], depth + 1)
    : value
}

function luminance(hex: string): number {
  const normalized = hex.replace('#', '')
  const channels = [0, 2, 4].map((offset) => {
    const channel =
      Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })
  const [red, green, blue] = channels
  return 0.2126 * red! + 0.7152 * green! + 0.0722 * blue!
}

function contrast(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  )
  return (lighter + 0.05) / (darker! + 0.05)
}

const themes = [
  {
    name: 'claro',
    tokens: parseTokens(
      extractBlock(/:root,\s*\[data-theme='light'\]\s*\{([\s\S]*?)\}/),
    ),
  },
  {
    name: 'escuro',
    tokens: parseTokens(extractBlock(/\[data-theme='dark'\]\s*\{([\s\S]*?)\}/)),
  },
]

/** [foreground, background, mínimo WCAG] — 4.5 para texto, 3 para ícones/UI. */
const pairs: ReadonlyArray<readonly [string, string, number]> = [
  ['--color-on-yellow', '--color-yellow', 4.5], // filtro em hover
  ['--color-on-yellow', '--color-yellow-dark', 3], // ícone do benefício
  ['--color-on-primary', '--color-primary-dark', 4.5], // filtro ativo / botão add
  ['--color-on-primary', '--color-primary-surface-hover', 3], // botão add em hover
  ['--color-white', '--color-icon-neutral-bg', 3], // benefício neutro
  ['--color-tag-text', '--color-yellow-light', 4.5], // tags, filtro e ícone do carrinho
  ['--color-on-badge', '--color-badge', 3], // badge decorativo
  ['--color-primary-text', '--color-primary-light', 4.5], // localização
  ['--color-primary-text', '--color-button', 3], // stepper
  ['--color-text-muted', '--color-card', 4.5], // descrição
  ['--color-subtitle', '--color-card', 4.5], // nome do produto
  ['--color-text', '--color-card', 4.5], // preço
]

describe.each(themes)('contraste do tema $name', ({ tokens }) => {
  it.each(pairs)('%s sobre %s', (foreground, background, minimum) => {
    const ratio = contrast(
      resolve(tokens, foreground),
      resolve(tokens, background),
    )
    expect(ratio).toBeGreaterThanOrEqual(minimum)
  })
})
