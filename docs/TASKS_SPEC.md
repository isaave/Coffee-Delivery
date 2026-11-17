# TASKS — Planejamento de Tarefas: Coffee Delivery

**Versão:** 0.1.0
**Regra:** uma tarefa por vez. Antes de codificar, explique o racional e os arquivos envolvidos. Após implementar, valide, teste e resuma.

---

## Tarefa 0 — Documentação ✅ CONCLUÍDA

- [x] Criar `docs/PRD_SPEC.md`
- [x] Criar `docs/TECH_SPEC.md`
- [x] Criar `docs/TASKS_SPEC.md`

---

## Tarefa 1 — Fundação + Tema ✅ CONCLUÍDA

**Objetivo:** estrutura base do projeto com tema claro/escuro persistente e acessível.

- [x] Inicializar Vite + React + TypeScript (strict) e alias `@/`
- [x] Criar estrutura de pastas conforme TECH_SPEC
- [x] Configurar `styles/tokens.css` (semântico) e `global.css`
- [x] Implementar `types/theme.ts` e `utils/storage.ts`
- [x] Implementar `contexts/ThemeProvider.tsx` + `contexts/themeContext.ts` + `hooks/useTheme.ts`
- [x] Aplicar `data-theme` no `<html>` com fallback `prefers-color-scheme` e script anti-FOUC
- [x] Validar contraste AA e foco visível (Lighthouse: Acessibilidade 100, Best Practices 100, SEO 100)
- [x] Tokens semânticos de foreground (`--color-on-yellow`, `--color-on-primary`,
      `--color-icon-neutral-bg`, `--color-primary-surface-hover`) para que ícones e
      estados de hover mantenham contraste AA nos dois temas
- [x] Teste de regressão de contraste (`src/tests/contrast.test.ts`) cobrindo pares
      que o Lighthouse não avalia (hover e ícones SVG)
- [x] Critério de aceite: alternar tema funciona e persiste após recarregar

---

## Tarefa 2 — Modelo de dados e carrinho ✅ CONCLUÍDA

- [x] `types/product.ts`, `types/cart.ts`
- [x] `data/products.ts` (8 cafés, imagem provisória até a tarefa de branding)
- [x] `reducers/cartReducer.ts` (ADD acumula, DECREMENT remove em 0)
- [x] `contexts/CartProvider.tsx` + `contexts/cartContext.ts` + `hooks/useCart.ts`
- [x] `utils/money.ts` (formatação BRL em centavos) e `utils/totals.ts`
- [x] Testes unitários do reducer, guards, formatação e totais (17 testes)
- [x] Critério de aceite: acúmulo por produto e arredondamento BRL corretos

---

## Tarefa 3 — Catálogo e layout base ✅

- [x] `components/Header.tsx`, `components/Hero.tsx`, `components/CategoryFilter.tsx`,
      `components/ProductCard.tsx`, `components/QuantityStepper.tsx`
- [x] `pages/CatalogPage.tsx` com grade responsiva (4 → 3 → 2 → 1 colunas)
- [x] Integração com `CartContext` (adicionar a quantidade do stepper ao carrinho)
- [x] Assets PNG extraídos do Figma + logo/fundo do hero oficiais + fontes Roboto e Baloo 2
- [x] Paleta canônica do Figma aplicada (roxo `#8047F8`/`#4B2995`, amarelo
      `#DBAC2C`/`#C47F17`, fundo `#FAFAFA`, card `#F3F2F2`) e medidas de referência
      (header 104px, hero 544px, cards 120px, grade `minmax(15.25rem, 1fr)`)
- [x] Testes unitários atualizados (18 testes)
- [x] Critério de aceite: catálogo responsivo, filtros por categoria e adicionar ao
      carrinho funcionando (validação no navegador)
- [x] Lighthouse: Acessibilidade 100 / Boas práticas 100 / SEO 100 nos temas
      claro e escuro (sem falhas)

---

## Tarefa 4 — Checkout e CEP

- [ ] `schemas/checkoutSchema.ts` (Zod)
- [ ] `hooks/useCep.ts` (ViaCEP, loading/error/abort)
- [ ] `pages/CheckoutPage.tsx` com React Hook Form
- [ ] Cálculo de frete por região e total
- [ ] Testes com mock de `fetch` e estados de erro
- [ ] Critério de aceite: CEP preenche endereço; número/complemento manuais

---

## Tarefa 5 — Confirmação de pedido e ajustes finais

- [ ] `pages/SuccessPage.tsx` com resumo do pedido
- [ ] Roteamento completo (React Router)
- [ ] Limpeza do carrinho após finalize
- [ ] Revisão de acessibilidade e responsividade
- [ ] Build de produção sem erros TypeScript

---

## Convenção de commit sugerida por tarefa

| Tarefa | Commit |
| --- | --- |
| 0 | `docs: add PRD, technical and task specifications` |
| 1 | `feat: scaffold project with persistent light/dark theme` |
| 2 | `feat: add typed product data and cart reducer with persistence` |
| 3 | `feat: build responsive catalog with add-to-cart` |
| 4 | `feat: add checkout form with CEP lookup and shipping` |
| 5 | `feat: add order confirmation and final polish` |
