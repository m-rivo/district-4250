"use server";

import { createServerClient } from "@/lib/pocketbase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  error?: string;
};

export async function updateMemberAction(
  memberId: string,
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const pb = await createServerClient();

  const data = {
    first_name: formData.get("first_name") as string,
    second_name: formData.get("second_name") as string,
    first_surname: formData.get("first_surname") as string,
    second_surname: formData.get("second_surname") as string,
    birth_date: formData.get("birth_date") as string,
  };

  try {
    await pb.collection("members").update(memberId, data);

    revalidatePath(`/members/${memberId}`);
    revalidatePath("/members");

    return { success: true };
  } catch (error: any) {
    console.error("Error al actualizar miembro:", error);
    return {
      success: false,
      error: error?.message || "No se pudo actualizar el miembro.",
    };
  }
}
