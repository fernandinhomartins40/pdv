"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearCurrentSession, switchCurrentContext } from "../../lib/auth";

export async function logoutAction() {
  await clearCurrentSession();
  redirect("/login");
}

export async function switchContextAction(formData: FormData) {
  const organizationId = String(formData.get("organizationId") ?? "");
  const storeId = String(formData.get("storeId") ?? "");
  const terminalId = String(formData.get("terminalId") ?? "");

  await switchCurrentContext({
    organizationId,
    storeId: storeId || null,
    terminalId: terminalId || null
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
