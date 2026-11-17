# TECH — Especificação Técnica: Coffee Delivery

**Versão:** 0.1.0
**Status:** Aprovado para desenvolvimento
**Idioma:** pt-BR

---

## 1. Stack

| Camada | Tecnologia |
| --- | --- |
| Build | Vite + TypeScript (strict) |
| UI | React |
| Roteamento | React Router |
| Estado global | Context API + `useReducer` |
| Formulários | React Hook Form + Zod (`@hookform/resolvers`) |
| Estilos | CSS com variáveis semânticas (tokens) |
| Testes | Vitest + React Testing Library (planejado) |
| API | ViaCEP (`https://viacep.com.br/ws/{cep}/json/`) |

## 2. Estrutura de pastas

```
src/
  components/      # componentes reutilizáveis (Button, Input, Header, ProductCard...)
  pages/           # CatalogPage, CheckoutPage, SuccessPage
  contexts/        # CartContext, ThemeContext
  reducers/        # cartReducer + tipos de ação
  hooks/           # useTheme, useCep (encapsulam efeitos e lógica)
  data/            # products.ts (dados locais tipados)
  types/           # Product, CartItem, Address, Theme...
  schemas/         # schemas Zod (checkoutSchema)
  utils/           # formatCurrency, calculateTotals, storage, cep
  styles/          # tokens.css, global.css, themes
  tests/           # testes e2e (ou __tests__ por módulo)
docs/              # PRD_SPEC.md, TECH_SPEC.md, TASKS_SPEC.md
```

**Regra de ouro:** `App.tsx` contém apenas provisão de contextos, layout e rotas. Nenhuma regra de negócio dentro dele.

## 3. Convenções

- Nomes de arquivos de componentes em `PascalCase`; hooks/utilitários em `camelCase`.
- Componentes funcionais com props tipadas; sem `any` (usar `unknown` + narrowing quando necessário).
- `tsconfig.json` com `strict: true`, `noImplicitAny: true`.
- Imports absolutos via alias `@/` para `src/` (configurar no Vite + TS).
- Commits semânticos: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:`.

## 4. Modelo de dados (tipos)

```ts
type ProductId = string;

interface Product {
  id: ProductId;
  name: string;
  description: string;
  priceInCents: number; // inteiro, evita erro de ponto flutuante
  image: string;
  tags: string[];
}

interface CartItem {
  productId: ProductId;
  quantity: number; // >= 1
}

type CartState = CartItem[];

type Theme = 'light' | 'dark';
```

## 5. Gerenciamento de estado

### 5.1 Carrinho (`cartReducer`)

Ações (discriminated union):

```ts
type CartAction =
  | { type: 'ADD'; productId: ProductId }
  | { type: 'INCREMENT'; productId: ProductId }
  | { type: 'DECREMENT'; productId: ProductId } // remove se chegar a 0
  | { type: 'REMOVE'; productId: ProductId }
  | { type: 'CLEAR' };
```

- Reducer **puro e imutável**: usar `map`, `filter`, `find` — nunca `push`/`splice` no estado.
- `ADD` acumula quantidade quando o `productId` já existe (RN-01).
- Hidratação via `localStorage` na inicialização; persistência via `useEffect`.

### 5.2 Tema (`ThemeContext`)

- Expõe `theme`, `toggleTheme`.
- Lê preferência salva; fallback para `prefers-color-scheme`.
- Aplica `data-theme` no `<html>` e persiste em `localStorage`.

## 6. Validação (Zod)

`checkoutSchema` valida: nome, e-mail, CEP (8 dígitos), rua, número, complemento (opcional), bairro, cidade, UF (2 letras). Campos preenchidos pela API continuam validáveis e editáveis. Número/complemento permanecem manuais (RN-04).

## 7. Integração ViaCEP

- Hook `useCep` encapsula: estados `idle | loading | success | error`, abort de requisições obsoletas e validação de 8 dígitos.
- Em erro, manter os dados já preenchidos e anunciar mensagem via `aria-live="polite"`.
- Número e complemento nunca recebem valores da resposta.

## 8. Tematização e acessibilidade

- Tokens semânticos em `styles/tokens.css`: `--color-bg`, `--color-surface`, `--color-text`, `--color-primary`, `--color-border`, `--color-focus`.
- Sobrescrita dos tokens sob `[data-theme='dark']`.
- Contraste AA; `:focus-visible` com `--color-focus`; toque mínimo de 44px em alvos interativos.

## 9. Persistência

| Chave | Conteúdo |
| --- | --- |
| `coffee-delivery:cart:v1` | `CartState` serializado (JSON) |
| `coffee-delivery:theme:v1` | `'light' \| 'dark'` |

Funções de leitura/escrita ficam em `utils/storage.ts`, com tratamento de JSON inválido (fallback seguro).

## 10. Estratégia de testes

- Testes unitários para `cartReducer` (acúmulo, limites, imutabilidade) e `utils` (formatação BRL, totais).
- Testes de componente para formulário de checkout e estados do CEP (mock do `fetch`).
- Testes de acessibilidade com `jest-axe` (planejado) nos fluxos principais.

## 11. Arredondamento BRL (referência de implementação)

```ts
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
// armazenar centavos como inteiro; dividir por 100 apenas na formatação
```

Soma de totais feita em centavos (`priceInCents * quantity`) para evitar imprecisão de `float`.
