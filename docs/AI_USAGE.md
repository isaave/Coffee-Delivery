# Uso de Inteligência Artificial — Registro de Evidências

Este documento registra como a IA (agente OpenCode, modelo Big Pickle) foi usada
como apoio no desenvolvimento do Coffee Delivery. Ela atuou como **par de engenharia**:
propôs estruturas, gerou código, revisou acessibilidade e ajudou a depurar — sempre com
validação humana (testes, lint, build e inspeção no navegador) antes de integrar.

> **Decisão sobre branding:** a logo oficial do Figma foi mantida (`public/images/logo.svg`)
> para preservar fidelidade visual. O item do enunciado que pede "logo criada com IA" não
> foi seguido à risca; o uso de IA está evidenciado neste documento.

---

## Evidência 1 — Especificações e planejamento (Tarefa 0)

**Prompt (resumo):** "Crie a documentação de um trabalho final de SPA: PRD com histórias,
requisitos funcionais e regras de negócio; especificação técnica com stack, estrutura de
pastas e contratos de dados; e um planejamento task a task com definição de pronto."

**Resultado:** `docs/PRD_SPEC.md`, `docs/TECH_SPEC.md` e `docs/TASKS_SPEC.md`, com
RF-01…RF-10, RN-01…RN-07, modelos de dados, regra de ouro do `App.tsx` e critérios
de aceite por etapa. As regras de negócio definidas aqui orientaram todo o código
seguinte (acúmulo por produto, centavos, frete por região, CEP de 8 dígitos).

**Arquivos:** `docs/*.md` · **Commit:** `b1e343d` (documentação incluída na primeira entrega)

---

## Evidência 2 — Reducer imutável, guards e persistência (Tarefa 2)

**Prompt (resumo):** "Implemente o carrinho com `useReducer` puro e imutável: `ADD`
acumula quantidade do mesmo produto, `DECREMENT` remove ao chegar a zero. Persista em
`localStorage` com chave versionada e valide os dados lidos com type guards. Sem `any`."

**Resultado:** `cartReducer.ts` usa `map`, `filter` e spread — nunca `push`/`splice`.
`CartProvider` hidrata via `getInitialCart` e persiste em `useEffect`.
`isCartItem`/`isCartState` rejeitam dados corrompidos. Testes cobrem acúmulo,
linhas separadas, decremento a zero, remoção e imutabilidade (verificado com
`structuredClone`).

**Arquivos:** `src/reducers/cartReducer.ts`, `src/contexts/CartProvider.tsx`,
`src/types/cart.ts`, `src/utils/storage.ts`, `src/tests/cartReducer.test.ts`,
`src/tests/cartStateGuard.test.ts` · **Commit:** `b1e343d`

---

## Evidência 3 — Auditoria WCAG 2.2 AA e correção de contraste (Tarefa 1)

**Prompt (resumo):** "Audite os tokens dos temas claro e escuro quanto ao contraste AA,
incluindo estados de hover e ícones. Corrija sem alterar a paleta canônica do Figma e
adicione teste de regressão."

**Resultado:** criados tokens semânticos de foreground (`--color-on-yellow`,
`--color-on-primary`, `--color-icon-neutral-bg`, `--color-primary-surface-hover`) e
ajustado o hover roxo do tema escuro para `#6d38d6` (6,59:1). O teste
`contrast.test.ts` lê `tokens.css` com `node:fs` e verifica 12 pares × 2 temas.
Lighthouse: 100 em Acessibilidade, Boas Práticas e SEO, sem falhas.

**Arquivos:** `src/styles/tokens.css`, `src/tests/contrast.test.ts` ·
**Commit:** `4939578`

---

## Evidência 4 — Fluxo de compra: validação, ViaCEP e confirmação (Tarefas 4 e 5)

**Prompt (resumo):** "Implemente checkout com React Hook Form + Zod, consulta ViaCEP
com loading/erro/abort preenchendo rua/bairro/cidade/UF, pagamento obrigatório simulado,
frete por região, resumo do carrinho com controles de quantidade e página de sucesso com
snapshot do pedido. Mantenha `App.tsx` fino com rotas e provedores."

**Resultado:** `schemas/checkoutSchema.ts`, `utils/cep.ts`, `hooks/useCep.ts`,
`utils/shipping.ts`, `utils/order.ts`, `types/checkout.ts`,
`components/CartSummary.tsx`, `components/FormField.tsx`, `pages/CheckoutPage.tsx` e
`pages/SuccessPage.tsx`. Testes com `fetch` mockado cobrem sucesso, CEP inválido,
não encontrado, erro de rede e abort. Total de **71 testes** verdes, lint e build OK.

**Arquivos:** ver `git log --stat` do commit de checkout · **Commit:** `feat: add checkout, order confirmation and delivery evidence` (ver `git log`)

---

## Evidência 5 — Depuração guiada por validação em navegador (Tarefa 4)

**Prompt (resumo):** "Ao validar o checkout no navegador, o botão Confirmar acusou
'Informe um CEP com 8 dígitos.' mesmo após o ViaCEP preencher o endereço. Investigue."

**Resultado:** o schema exigia `^\d{8}$`, mas o campo exibe máscara (`01310-100`).
A IA identificou a inconsistência entre placeholder e validação, trocou o `regex` por
um `refine` que remove não-dígitos e normalizou o CEP ao construir o pedido. Novo teste
de regressão adicionado; fluxo reverificado com CEP real e falha de pagamento não
selecionado.

**Arquivos:** `src/schemas/checkoutSchema.ts`, `src/utils/order.ts`,
`src/tests/checkoutSchema.test.ts` · **Commit:** `feat: add checkout, order confirmation and delivery evidence` (ver `git log`)

---

## Como a saída foi validada

- `npm run test` — 71 testes (reducer, guards, dinheiro, totais, contraste, schema, CEP, frete e pedido).
- `npm run lint` — oxlint sem erros (1 aviso informativo do React Compiler sobre `useForm`).
- `npm run build` — `tsc -b` + Vite sem erros.
- Navegador — fluxo completo com ViaCEP real (São Paulo/SP e Natal/RN), estados de erro,
  persistência após refresh e tema escuro nas três telas.
- Lighthouse — 100/100/100 em Home, Checkout e Sucesso, claro e escuro.
