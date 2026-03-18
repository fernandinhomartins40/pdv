import { ModulePage } from "../../components/module-page";

export default function EstoquePage() {
  return (
    <ModulePage
      title="Estoque"
      description="Baixa automática por venda, entradas por XML e alertas de ruptura com atualização por loja."
      stats={[
        { label: "Itens Negativos", value: "05", accent: "#EF4F5F" },
        { label: "Itens Zerados", value: "18", accent: "#FF7A1A" },
        { label: "Cobertura Média", value: "24 dias", accent: "#31C65B" }
      ]}
      rows={[
        ["Farinha Especial 5kg", "Negativo", "-5 un", "F10"],
        ["Leite Integral 1L", "Zerado", "0 un", "F11"],
        ["Queijo Mussarela", "Saudável", "42 un", "F12"]
      ]}
    />
  );
}
