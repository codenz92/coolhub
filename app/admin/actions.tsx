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
    await db.insert(users).values({ username, password: hash, coolchat: '0' });
    revalidatePath("/admin");
}

export async function togglePermission(formData: FormData) {
    const userId = Number(formData.get("userId"));
    const currentStatus = formData.get("currentStatus") as string;
    const newStatus = currentStatus === '1' ? '0' : '1';

    await db.update(users).set({ coolchat: newStatus }).where(eq(users.id, userId));

    revalidatePath("/admin");
    revalidatePath("/dashboard");
}