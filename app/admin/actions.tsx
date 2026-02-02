"use server";

import { db, users } from "../db"; // This will now work correctly
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { genSaltSync, hashSync } from 'bcrypt-ts';

export async function deleteUser(formData: FormData) {
    const idString = formData.get("id") as string;
    const id = Number(idString);

    if (!id) return;

    // Drizzle delete command using the exported users table
    await db.delete(users).where(eq(users.id, id));

    // Refreshes the admin page data immediately on Vercel
    revalidatePath("/admin");
}

export async function addUser(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) return;

    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    await db.insert(users).values({
        username,
        password: hash
    });
    revalidatePath("/admin");
}

export async function updateUserRole(formData: FormData) {
    const id = Number(formData.get("id"));
    const newRole = formData.get("role") as string;

    if (!id || !newRole) return;

    // Update the role in the Neon database
    await db.update(users)
        .set({ role: newRole })
        .where(eq(users.id, id));

    // Refresh the admin page data
    revalidatePath("/admin");
}