"use server";

import { db, users } from "../db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteUser(formData: FormData) {
    const id = Number(formData.get("id"));
    if (!id) return;

    await db.delete(users).where(eq(users.id, id));

    // Refreshes the admin page to show the updated list
    revalidatePath("/admin");
}