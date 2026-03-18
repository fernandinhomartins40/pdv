import { ModulePage } from "../../components/module-page";

export default function SuportePage() {
  return (
    <ModulePage
      title="Suporte"
      description="Central operacional para diagnóstico do PDV, fila de sync, eventos fiscais e atendimento interno."
      stats={[
        { label: "Chamados Abertos", value: "04", accent: "#EF4F5F" },
        { label: "Sync com Erro", value: "01", accent: "#FF7A1A" },
        { label: "Tempo SLA", value: "26 min", accent: "#31C65B" }
      ]}
      rows={[
        ["Desktop Loja Centro", "Online", "Último sync 12s", "Ctrl+L"],
        ["Sefaz contingência", "Monitorando", "Sem bloqueios", "Ctrl+M"],
        ["Fila local", "Saudável", "0 pendências", "Ctrl+Q"]
      ]}
    />
  );
}
