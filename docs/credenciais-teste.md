# Credenciais de Teste

Estas credenciais sao destinadas apenas a desenvolvimento e homologacao.

## Como criar

1. Configure `DATABASE_URL`.
2. Rode `pnpm db:seed:test-users`.
3. Em deploy na VPS, defina `SEED_TEST_USERS_ENABLED=1` para executar esse seed automaticamente depois do schema.

## Senha padrao

Todos os usuarios abaixo usam a mesma senha:

`Revendeo@123`

## Usuarios criados

| Perfil | Nome | E-mail | Papel | Contexto |
| --- | --- | --- | --- | --- |
| Owner | Proprietario Teste | `owner.teste@revendeo.local` | `OWNER` | Revendeo Teste + Revendeo Labs |
| Admin | Administrador Teste | `admin.teste@revendeo.local` | `ADMIN` | Revendeo Teste + Revendeo Labs |
| Gerente | Gerente Centro/Norte | `gerente.teste@revendeo.local` | `MANAGER` | Revendeo Teste |
| Caixa | Caixa Centro | `caixa.centro@revendeo.local` | `CASHIER` | Loja Centro |
| Caixa | Caixa Norte | `caixa.norte@revendeo.local` | `CASHIER` | Loja Norte |
| Financeiro | Financeiro Teste | `financeiro.teste@revendeo.local` | `FINANCE` | Revendeo Teste |
| Suporte | Suporte Teste | `suporte.teste@revendeo.local` | `SUPPORT` | Revendeo Teste + Revendeo Labs |

## Estrutura criada pelo seed

### Organizacoes

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

## Observacoes

- O seed e idempotente: pode ser executado novamente sem duplicar usuarios, organizacoes, lojas ou terminais.
- Os usuarios sao marcados com e-mail verificado para permitir login imediato.
- Quando `SEED_TEST_USERS_ENABLED=1`, o deploy da VPS roda esse seed automaticamente.
