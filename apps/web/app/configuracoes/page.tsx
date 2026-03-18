import { prisma } from "@pdv/database";
import { AdminShell } from "../../components/admin-shell";
import { createStoreAction, createTerminalAction } from "../actions/tenant";
import { requireSession } from "../../lib/auth";

export default async function ConfiguracoesPage() {
  const session = await requireSession();

  const [organization, stores, terminals, memberships] = await Promise.all([
    prisma.organization.findUnique({
      where: {
        id: session.activeOrganizationId
      }
    }),
    prisma.store.findMany({
      where: {
        organizationId: session.activeOrganizationId
      },
      orderBy: {
        createdAt: "asc"
      }
    }),
    prisma.pdvTerminal.findMany({
      where: {
        organizationId: session.activeOrganizationId
      },
      include: {
        store: true
      },
      orderBy: {
        createdAt: "asc"
      }
    }),
    prisma.organizationMembership.count({
      where: {
        organizationId: session.activeOrganizationId,
        status: "ACTIVE"
      }
    })
  ]);

  return (
    <AdminShell session={session}>
      <section className="tenant-grid">
        <article className="tenant-card hero">
          <span className="section-kicker">Tenant ativo</span>
          <h1>{organization?.name ?? "Organizacao"}</h1>
          <p>Gerencie lojas, terminais e estrutura operacional sem sair do contexto da empresa ativa.</p>
          <div className="tenant-metrics">
            <div>
              <span>Membros</span>
              <strong>{memberships}</strong>
            </div>
            <div>
              <span>Lojas</span>
              <strong>{stores.length}</strong>
            </div>
            <div>
              <span>PDVs</span>
              <strong>{terminals.length}</strong>
            </div>
          </div>
        </article>

        <article className="tenant-card">
          <h2>Nova loja</h2>
          <form action={createStoreAction} className="tenant-form">
            <label>
              <span>Nome da loja</span>
              <input name="storeName" placeholder="Loja Centro" required />
            </label>
            <label>
              <span>Codigo interno</span>
              <input name="storeCode" placeholder="CENTRO" />
            </label>
            <button type="submit" className="topbar-button primary">
              Criar loja
            </button>
          </form>
        </article>

        <article className="tenant-card">
          <h2>Novo PDV</h2>
          <form action={createTerminalAction} className="tenant-form">
            <label>
              <span>Loja</span>
              <select name="storeId" defaultValue={session.activeStoreId ?? ""} required>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Nome do terminal</span>
              <input name="terminalName" placeholder="Caixa 02" required />
            </label>
            <label>
              <span>Codigo do terminal</span>
              <input name="terminalCode" placeholder="PDV-CX02" />
            </label>
            <button type="submit" className="topbar-button secondary">
              Criar PDV
            </button>
          </form>
        </article>

        <article className="tenant-card list">
          <h2>Lojas</h2>
          <div className="tenant-list">
            {stores.map((store) => (
              <div key={store.id} className="tenant-list-row">
                <div>
                  <strong>{store.name}</strong>
                  <span>{store.code}</span>
                </div>
                <b>{terminals.filter((terminal) => terminal.storeId === store.id).length} PDV(s)</b>
              </div>
            ))}
          </div>
        </article>

        <article className="tenant-card list">
          <h2>Terminais</h2>
          <div className="tenant-list">
            {terminals.map((terminal) => (
              <div key={terminal.id} className="tenant-list-row">
                <div>
                  <strong>{terminal.name}</strong>
                  <span>
                    {terminal.code} · {terminal.store.name}
                  </span>
                </div>
                <b>{terminal.isActive ? "Ativo" : "Inativo"}</b>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
