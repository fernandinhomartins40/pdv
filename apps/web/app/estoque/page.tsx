import { AppPageShell } from "../../components/app-page-shell";
import { ModulePage } from "../../components/module-page";

export default function EstoquePage() {
  return (
    <AppPageShell>
      <ModulePage
        title="Estoque"
        description="Baixa automatica por venda, entradas por XML e alertas de ruptura com atualizacao por loja."
        stats={[
          { label: "Itens Negativos", value: "05", accent: "#EF4F5F" },
          { label: "Itens Zerados", value: "18", accent: "#FF7A1A" },
          { label: "Cobertura Media", value: "24 dias", accent: "#31C65B" }
        ]}
        rows={[
          ["Farinha Especial 5kg", "Negativo", "-5 un", "F10"],
          ["Leite Integral 1L", "Zerado", "0 un", "F11"],
          ["Queijo Mussarela", "Saudavel", "42 un", "F12"]
        ]}
      />
    </AppPageShell>
  );
}
