# Arquitetura do Sistema

## Visão Geral

O sistema é dividido em três aplicações e três pacotes de base:

- `apps/desktop`
  PDV desktop em Electron + React + Vite, com operação local em SQLite e fila de sincronização.
- `apps/web`
  Painel administrativo central em Next.js.
- `apps/api`
  API REST em Fastify, responsável por produtos, vendas, estoque, sync e importação XML.
- `packages/ui`
  Componentes visuais e tokens compartilhados.
- `packages/types`
  Contratos TypeScript de domínio.
- `packages/database`
  Prisma para nuvem e bootstrap SQL do SQLite local.

## Fluxo Offline-First

### No desktop

1. O operador lança itens e conclui a venda localmente.
2. A venda é persistida no SQLite em `local_sales`, `local_sale_items` e `local_sale_payments`.
3. Uma operação é registrada em `sync_queue`.
4. O motor de sync tenta enviar a fila para a API.
5. Em caso de falha, a operação recebe `FAILED` com `scheduled_at` futuro usando backoff exponencial.
6. Em caso de conflito, a operação recebe `CONFLICT`.

### Na API

1. `POST /v1/sync/push` recebe operações locais.
2. Produtos passam por verificação de versão.
3. Mudanças válidas são aplicadas no PostgreSQL.
4. `GET /v1/sync/pull` retorna produtos e estoque alterados desde o último cursor.

## Resolução de Conflitos

- Produtos: prioridade para o registro com `version` mais recente.
- Estoque: o servidor devolve o saldo consolidado por loja no `pull`.
- Vendas: são tratadas como eventos imutáveis; uma venda criada localmente deve ser consumida pela nuvem.

## Entidades Principais

- `Organization`, `Store`, `User`
- `Product`, `StockBalance`, `StockMovement`
- `Sale`, `SaleItem`, `SalePayment`
- `CashSession`
- `SyncQueue`, `SyncCursor`
- `NfeImport`

## Importação XML

`POST /v1/xml/import` recebe o XML bruto da NF-e, extrai:

- `xProd`
- `cEAN`
- `NCM`
- `CFOP`
- `vUnCom`
- `qCom`

O parser calcula um `salePrice` inicial a partir do custo e alimenta produto + estoque.

## Expansões Recomendadas

1. Autenticação multiempresa com tokens.
2. Auditoria de conflitos com interface de reconciliação.
3. Sincronização incremental por entidade.
4. Emissão fiscal e contingência SEFAZ.
5. Suite de testes de integração para venda, estoque e parser XML.
