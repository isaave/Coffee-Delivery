# PRD — Especificação de Produto: Coffee Delivery

**Versão:** 0.1.0
**Status:** Aprovado para desenvolvimento
**Projeto:** Coffee Delivery — Trabalho Final do curso de Single Page Application
**Idioma:** pt-BR

---

## 1. Visão do produto

Aplicação de e-commerce de cafés especializados, em português brasileiro, com foco em uma jornada de compra curta e acessível: o cliente visualiza o catálogo, monta o carrinho, informa o CEP para receber o endereço automaticamente, finaliza o pedido e recebe uma confirmação.

## 2. Objetivos

- Permitir a compra de cafés de forma rápida, sem necessidade de cadastro.
- Reduzir o esforço de preenchimento do endereço por meio de integração com CEP.
- Garantir acessibilidade (WCAG 2.2 AA) e boa experiência em mobile e desktop.
- Oferecer tema claro e escuro com preferência persistida.

## 3. Personas

| Persona | Necessidade |
| --- | --- |
| Cliente recorrente | Repetir pedidos rapidamente, com carrinho persistido entre visitas. |
| Cliente mobile | Catálogo legível e checkout utilizável com o polegar. |
| Usuário com deficiência visual | Navegação por teclado, contraste adequado e leitores de tela. |

## 4. Histórias de usuário

- **US-01:** Como cliente, quero ver a lista de cafés com nome, descrição, preço e imagem para decidir o que comprar.
- **US-02:** Como cliente, quero adicionar cafés ao carrinho e ajustar quantidades para montar meu pedido.
- **US-03:** Como cliente, quero que meu carrinho seja lembrado ao voltar ao site.
- **US-04:** Como cliente, quero digitar meu CEP e ter o endereço preenchido automaticamente.
- **US-05:** Como cliente, quero preencher número e complemento manualmente, pois não vêm na consulta de CEP.
- **US-06:** Como cliente, quero receber feedback claro de carregamento e erro durante a busca do CEP.
- **US-07:** Como cliente, quero finalizar o pedido com meus dados validados e ver uma confirmação.
- **US-08:** Como usuário, quero alternar entre tema claro e escuro e que minha escolha seja lembrada.

## 5. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | Exibir catálogo de produtos a partir de dados locais tipados. |
| RF-02 | Adicionar produto ao carrinho; incrementar a quantidade se o produto já estiver presente. |
| RF-03 | Incrementar, decrementar e remover itens do carrinho. Decrementar até zero remove o item. |
| RF-04 | Calcular subtotal, frete e total em BRL. |
| RF-05 | Persistir o carrinho em `localStorage`. |
| RF-06 | Consultar CEP em API pública (ViaCEP) e preencher rua, bairro, cidade e UF. |
| RF-07 | Manter número e complemento como campos manuais. |
| RF-08 | Validar formulário de checkout com React Hook Form + Zod. |
| RF-09 | Exibir tela de sucesso com resumo do pedido ao finalizar. |
| RF-10 | Alternar tema claro/escuro e persistir a preferência. |

## 6. Regras de negócio

| ID | Regra |
| --- | --- |
| RN-01 | **Acúmulo por produto:** o carrinho nunca contém duas linhas do mesmo `productId`; adicionar novamente soma quantidades. |
| RN-02 | **Arredondamento monetário:** todos os cálculos usam centavos (inteiros) internamente ou arredondamento explícito; a exibição usa `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. |
| RN-03 | **Frete por região:** o valor do frete é definido pela UF/CEP consultado; CEP inválido não altera o frete. |
| RN-04 | **Campos manuais:** número e complemento nunca são sobrescritos pela API de CEP. |
| RN-05 | **CEP:** somente dígitos, 8 caracteres, antes de consultar. |
| RN-06 | **Quantidade mínima:** 1 por linha; ao decrementar de 1, o item é removido. |
| RN-07 | **Checkout sem estoque:** não há controle de estoque nesta versão. |

## 7. Requisitos não funcionais

- **Acessibilidade:** contraste mínimo AA (4.5:1 para texto normal, 3:1 para UI), foco visível, navegação por teclado, `aria-live` para estados de carregamento/erro do CEP, rótulos associados a todos os campos.
- **Responsividade:** layout funcional de 320px a 1440px.
- **Performance:** evitar buscas de CEP redundantes (não consultar CEP com menos de 8 dígitos).
- **Qualidade:** TypeScript estrito, sem `any`, compilação sem erros.
- **Persistência:** chaves versionadas no `localStorage` (ver TECH_SPEC).

## 8. Critérios de aceite (alto nível)

- Catálogo exibe todos os produtos cadastrados.
- Adicionar o mesmo produto duas vezes resulta em uma linha com quantidade 2.
- Recarregar a página mantém carrinho e tema.
- CEP válido preenche endereço; CEP inválido mostra erro sem quebrar o formulário.
- Finalizar pedido exibe confirmação com itens, endereço e total.

## 9. Fora de escopo

- Autenticação, conta de usuário e histórico de pedidos.
- Meios de pagamento reais (integração com gateways).
- Backend, banco de dados e estoque.
- Internacionalização (apenas pt-BR).
