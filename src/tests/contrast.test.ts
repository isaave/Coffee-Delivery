/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Regressão de contraste: o Lighthouse não avalia estados de hover, ícones SVG
 * nem bordas de controles, então todos os pares semânticos usados na interface
 * são verificados diretamente nos tokens dos dois temas.
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
] as const

/** [foreground, background, mínimo WCAG] — 4,5 para texto, 3 para ícones/UI. */
const pairs: ReadonlyArray<readonly [string, string, number]> = [
  // Texto (1.4.3)
  ['--color-text', '--color-bg', 4.5],
  ['--color-title', '--color-bg', 4.5],
  ['--color-subtitle', '--color-bg', 4.5],
  ['--color-text-muted', '--color-bg', 4.5],
  ['--color-primary', '--color-bg', 4.5], // links
  ['--color-tag-text', '--color-tag-bg', 4.5], // tags e filtros
  ['--color-tag-text', '--color-card', 4.5], // ícone do carrinho
  ['--color-on-yellow', '--color-yellow', 4.5], // botões amarelos
  ['--color-on-yellow', '--color-yellow-dark', 4.5], // hover dos botões
  ['--color-on-primary', '--color-primary-dark', 4.5], // botões roxos
  ['--color-on-primary', '--color-primary-surface-hover', 4.5], // hover
  ['--color-primary-text', '--color-primary-light', 4.5], // localização
  ['--color-title', '--color-primary-light', 4.5], // pagamento selecionado
  ['--color-text', '--color-surface', 4.5], // opção de pagamento
  ['--color-text-muted', '--color-input', 4.5], // placeholder
  ['--color-title', '--color-input', 4.5], // valor digitado
  ['--color-text', '--color-card', 4.5], // preço
  ['--color-title', '--color-card', 4.5], // títulos e totais
  ['--color-subtitle', '--color-card', 4.5], // nome do produto
  ['--color-text-muted', '--color-card', 4.5], // descrição e observações
  ['--color-danger', '--color-card', 4.5], // erros de validação
  ['--color-danger', '--color-surface-alt', 4.5], // ícone de remover em hover
  ['--color-success', '--color-bg', 4.5], // ícone da tela de sucesso
  ['--color-on-badge', '--color-badge', 4.5], // contador do carrinho
  // Ícones e componentes de UI (1.4.11)
  ['--color-primary-text', '--color-button', 3], // ícones do stepper
  ['--color-white', '--color-icon-neutral-bg', 3], // benefício neutro
  ['--color-primary-text', '--color-card', 3], // ícones dos detalhes
  ['--color-success', '--color-card', 3], // ícone de sucesso no card
  ['--color-primary', '--color-surface-alt', 3], // toggle de tema
  ['--color-primary-hover', '--color-surface-alt', 3], // toggle em hover
  ['--color-focus', '--color-bg', 3], // foco visível
  ['--color-focus', '--color-card', 3], // foco dentro dos cards
  ['--color-border', '--color-bg', 3], // bordas gerais
  ['--color-border', '--color-card', 3], // divisórias e cards
  ['--color-border', '--color-input', 3], // borda dos campos
  ['--color-control-accent', '--color-surface', 3], // radio não marcado
  ['--color-control-accent', '--color-primary-light', 3], // radio marcado
]

describe('tokens de tema', () => {
  it('define os mesmos tokens de cor nos dois temas', () => {
    const colorTokens = (tokens: TokenMap): string[] =>
      [...tokens.keys()].filter((token) => token.startsWith('--color-')).sort()

    expect(colorTokens(themes[1].tokens)).toEqual(colorTokens(themes[0].tokens))
  })
})

describe.each(themes)('contraste do tema $name', ({ tokens }) => {
  it.each(pairs)('%s sobre %s', (foreground, background, minimum) => {
    const ratio = contrast(
      resolve(tokens, foreground),
      resolve(tokens, background),
    )
    expect(ratio).toBeGreaterThanOrEqual(minimum)
  })
})
