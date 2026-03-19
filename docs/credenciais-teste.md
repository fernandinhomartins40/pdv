# Credenciais de Teste

Estas credenciais são destinadas apenas a desenvolvimento e homologação.

## Como criar

1. Configure `DATABASE_URL`.
2. Rode `pnpm db:seed:test-users`.

## Senha padrão

Todos os usuários abaixo usam a mesma senha:

`Revendeo@123`

## Usuários criados

| Perfil | Nome | E-mail | Papel | Contexto |
| --- | --- | --- | --- | --- |
| Owner | Proprietário Teste | `owner.teste@revendeo.local` | `OWNER` | Revendeo Teste + Revendeo Labs |
| Admin | Administrador Teste | `admin.teste@revendeo.local` | `ADMIN` | Revendeo Teste + Revendeo Labs |
| Gerente | Gerente Centro/Norte | `gerente.teste@revendeo.local` | `MANAGER` | Revendeo Teste |
| Caixa | Caixa Centro | `caixa.centro@revendeo.local` | `CASHIER` | Loja Centro |
| Caixa | Caixa Norte | `caixa.norte@revendeo.local` | `CASHIER` | Loja Norte |
| Financeiro | Financeiro Teste | `financeiro.teste@revendeo.local` | `FINANCE` | Revendeo Teste |
| Suporte | Suporte Teste | `suporte.teste@revendeo.local` | `SUPPORT` | Revendeo Teste + Revendeo Labs |

## Estrutura criada pelo seed

### Organizações

- `Revendeo Teste` (`revendeo-teste`)
- `Revendeo Labs` (`revendeo-labs`)

### Lojas

- `Loja Centro` (`CENTRO`)
- `Loja Norte` (`NORTE`)
- `Loja Labs` (`LABS`)

### Terminais

- `PDV Centro 01` (`PDV-CENTRO-01`)
- `PDV Norte 01` (`PDV-NORTE-01`)
- `PDV Labs 01` (`PDV-LABS-01`)

## Observações

- O seed é idempotente: pode ser executado novamente sem duplicar usuários, organizações, lojas ou terminais.
- Os usuários são marcados com e-mail verificado para permitir login imediato.
