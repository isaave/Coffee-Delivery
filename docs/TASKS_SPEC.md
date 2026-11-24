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

## Tarefa 4 — Checkout e CEP ✅ CONCLUÍDA

- [x] `types/checkout.ts` (endereço, pagamento, pedido e guarda `isOrder`)
- [x] `schemas/checkoutSchema.ts` (Zod; CEP aceito com ou sem máscara)
- [x] `utils/cep.ts` ( ViaCEP puro, normalização, `CepError` e abort)
- [x] `hooks/useCep.ts` (estados `idle | loading | success | error` + abort de requisições obsoletas)
- [x] `utils/shipping.ts` (RN-03: frete por UF, padrão R$ 14,90)
- [x] `components/FormField.tsx` e `components/CartSummary.tsx` (controles de quantidade, remoção, estado vazio e totais)
- [x] `pages/CheckoutPage.tsx` com React Hook Form + Zod e pagamento obrigatório
- [x] Testes com mock de `fetch`: CEP válido, inválido, não encontrado, falha de rede e abort
- [x] Testes do schema, do frete por região e da construção do pedido
- [x] Correção encontrada na validação em navegador: CEP com máscara (`01310-100`) passou a ser aceito pelo schema
- [x] Critério de aceite: CEP preenche rua/bairro/cidade/UF; número e complemento manuais; total recalculado por UF

**Evidências:** `npm run test` (71 testes), `npm run lint`, `npm run build`, validação em navegador com ViaCEP real (CEP 01310-100 → São Paulo/SP e 59010-000 → Natal/RN, frete R$ 19,90).

---

## Tarefa 5 — Confirmação de pedido e ajustes finais ✅ CONCLUÍDA

- [x] `pages/SuccessPage.tsx` com snapshot do pedido, estado vazio e botão de retorno
- [x] Roteamento completo (`/`, `/checkout`, `/success`, `*` → `/`), `App.tsx` fino
- [x] Persistência do pedido em `coffee-delivery:order:v1` e limpeza do carrinho após confirmação
- [x] Guardas: confirmação bloqueada com carrinho vazio ou formulário inválido
- [x] Revisão de acessibilidade e responsividade (desktop, tablet e celular)
- [x] Lighthouse 100/100/100 (acessibilidade, boas práticas, SEO) em Home, Checkout e Sucesso, nos temas claro e escuro
- [x] Build de produção sem erros TypeScript

---

## Tarefa 6 — Evidências, documentação e entrega ✅ CONCLUÍDA

- [x] `AGENTS.md` na raiz (renomeado de `agents_md.md`)
- [x] README completo com stack, instalação, scripts, decisões, screenshots, Figma, branding e link de deploy pendente
- [x] Uso de IA documentado em `docs/AI_USAGE.md` (4 evidências com prompts, resultados e commits)
- [x] Demonstração do fluxo de compra em `docs/DEMO.md`
- [x] Capturas de Home, Checkout, Sucesso e Dark Mode em mobile em `docs/screenshots/`
- [x] Repositório público: https://github.com/isaave/Coffee-Delivery
- [ ] Publicação da aplicação (link pendente por decisão do titular)

---

## Tarefa 7 — Auditoria final de light/dark e contraste ✅ CONCLUÍDA

**Objetivo:** garantir que ambos os temas estejam 100% corretos e em WCAG 2.2 AA em todas as telas.

- [x] Auditoria de todas as declarações de cor: nenhuma cor fixa fora de `tokens.css`
- [x] Correção das bordas no tema escuro (`#3d342d` → `#7f7166`: 3,28–3,99:1)
- [x] Correção do número do badge no tema claro (texto `#1f1305`: 5,54:1)
- [x] Novo token `--color-control-accent` para o radio marcado (4,42:1 no escuro)
- [x] `contrast.test.ts` ampliado de 12 para 37 pares por tema + invariante de tokens
- [x] Estilos computados verificados em Home, Checkout e Sucesso, claro e escuro
- [x] Toggle/persistência confirmados após recarregar (`coffee-delivery:theme:v1`)
- [x] Lighthouse 100/100/100 nas seis combinações, sem falhas
- [x] `npm run test` (122 testes), `npm run lint`, `npm run build`

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
| 6 | `docs: add delivery evidence, screenshots and AI usage log` |
| 7 | `fix: enforce WCAG AA contrast across light and dark themes` |
