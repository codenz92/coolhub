"use server";

import { db, users } from "../db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { auth } from "../auth";

export async function deleteUser(formData: FormData) {
    const session = await auth();
    const currentUsername = session?.user?.username;
    const id = Number(formData.get("id"));

    if (!id || !currentUsername) return;

    // Postgres-compatible select
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    const targetUser = results[0];

    if (!targetUser) return;

    // Prevent self-deletion
    if (targetUser.username === currentUsername) return;

    // Only 'dev' or 'rio' can delete other admins
    const isSuperAdmin = ["dev", "rio"].includes(currentUsername);
    if (targetUser.role === 'admin' && !isSuperAdmin) return;

    await db.delete(users).where(eq(users.id, id));
    revalidatePath("/admin");
}

export async function addUser(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!username || !password) return;

    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    await db.insert(users).values({
        username,
        password: hash,
        role: role || 'user',
        coolchat: '0'
    });
    revalidatePath("/admin");
}

export async function updateRole(formData: FormData) {
    const userId = Number(formData.get("userId"));
    const newRole = formData.get("role") as string;

    if (!userId || !newRole) return;

    await db.update(users)
        .set({ role: newRole })
        .where(eq(users.id, userId));

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
