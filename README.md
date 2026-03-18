# PDV + Painel Admin

Monorepo com `Turborepo` para um ecossistema de varejo composto por:

- `apps/desktop`: PDV desktop com Electron, React e Vite, projetado para operação offline-first.
- `apps/web`: painel administrativo em Next.js.
- `apps/api`: API REST em Fastify.
- `packages/ui`: biblioteca visual compartilhada.
- `packages/database`: Prisma, schema de domínio e contratos do SQLite local.
- `packages/types`: tipagem global do negócio.

## Arquitetura

### Camadas

1. `desktop`
   Fluxo de venda local, persistência em SQLite, fila `sync_queue`, atalho de teclado e shell Electron.
2. `api`
   Backend REST responsável por produtos, vendas, estoque, importação XML e sincronização bidirecional.
3. `web`
   Painel centralizado com dashboard, estoque, produtos, relatórios e importação XML.

### Persistência

- Nuvem: PostgreSQL via Prisma.
- Local do PDV: SQLite via `better-sqlite3`.
- Sincronização: engine própria baseada em fila local, backoff exponencial, cursor e resolução por `updatedAt/version`.

## Entregas incluídas nesta base

- Fundação do monorepo com workspaces, `turbo` e `TypeScript`.
- Design system compartilhado com tokens visuais do produto.
- Schema Prisma inicial cobrindo produtos, vendas, estoque, caixa, sincronização e importação XML.
- API REST base com rotas para produtos, vendas, estoque, sync e parser XML de NF-e.
- Painel Next.js com dashboard administrativo e páginas-base dos módulos.
- PDV Electron com layout principal, fluxo de venda, pagamento, atalhos de teclado e integração local com SQLite.

## Subida do projeto

1. Instale `pnpm`.
2. Configure `DATABASE_URL` em `apps/api/.env` e rode `pnpm db:generate`.
3. Rode `pnpm install`.
4. Suba os serviços com `pnpm dev`.

## Roadmap técnico imediato

1. Aplicar migrations reais do Prisma em PostgreSQL.
2. Conectar autenticação e multiempresa.
3. Fechar o loop de sync com reconciliador completo entre API e desktop.
4. Cobrir parser de XML com variações mais amplas da NF-e.
