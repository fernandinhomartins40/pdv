import { ModulePage } from "../../components/module-page";

export default function ConfiguracoesPage() {
  return (
    <ModulePage
      title="Configurações"
      description="Parâmetros de loja, preços, integração fiscal, perfis de acesso e preferências de sincronização."
      stats={[
        { label: "Perfis", value: "06", accent: "#6B2EFF" },
        { label: "Tributações", value: "14", accent: "#FF7A1A" },
        { label: "Lojas", value: "03", accent: "#00B6C9" }
      ]}
      rows={[
        ["Preço Padrão", "Ativo", "Tabela 01", "Ctrl+T"],
        ["Sefaz Monitor", "Online", "OK", "Ctrl+S"],
        ["Motor de Sync", "Ativado", "Bidirecional", "Ctrl+Y"]
      ]}
    />
  );
}
