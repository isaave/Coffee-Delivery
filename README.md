# Coffee Delivery

Trabalho final do curso de Single Page Application — e-commerce de cafés com catálogo, carrinho, checkout ViaCEP e confirmação de pedido.

## Requisitos

- Node.js 20.19+ (recomendado: 22+)
- npm 11+

## Comandos

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run build      # checagem TypeScript + build de produção
npm run lint       # oxlint
npm test           # testes unitários (Vitest)
npm run typecheck  # somente TypeScript
npm run preview    # serve o build
```

## Documentação

As especificações vivem em `docs/`:

- `PRD_SPEC.md` — produto, histórias e regras de negócio
- `TECH_SPEC.md` — stack, arquitetura e convenções
- `TASKS_SPEC.md` — planejamento task a task

## Estrutura

```
src/
  components/  componentes reutilizáveis
  pages/       páginas da aplicação
  contexts/    ThemeProvider e CartProvider
  reducers/    cartReducer
  hooks/       useTheme, useCep
  data/        dados locais dos produtos
  types/       tipos compartilhados
  schemas/     schemas Zod
  utils/       storage, money, totals
  styles/      tokens e estilos globais
  tests/       testes
```

## Acessibilidade

Tema claro/escuro com contraste AA, foco visível, alvos de toque de 44px e suporte a `prefers-reduced-motion`.

## Nota sobre `npm audit`

O Vite 8 depende de `picomatch@4.0.7`, que possui a advisory GHSA-fc5q-39xc-vjpf (ReDoS em globs) **sem versão corrigida publicada até o momento**. É uma dependência exclusiva de desenvolvimento (build/dev server); o risco prático neste projeto é baixo porque os padrões de glob não vêm de entrada do usuário. Versões antigas do Vite foram avaliadas e descartadas por conterem falhas mais graves no dev server.
