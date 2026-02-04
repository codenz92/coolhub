// app/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import postgres_lib from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';

// 1. Define Tables for Drizzle
export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 64 }),
  password: varchar('password', { length: 64 }),
  role: varchar('role', { length: 20 }).default('user'),
  coolchat: text('coolchat').default('0'),
});

// 2. Setup the Postgres Client
export const postgres = postgres_lib(`${process.env.POSTGRES_URL!}?sslmode=require`);
export const db = drizzle(postgres);

// 3. Database Helper Functions
export async function getUser(username: string) {
  await ensureTableExists();
  const result = await db.select().from(users).where(eq(users.username, username));
  // Return the first user object or undefined if not found
  return result[0];
}

export async function createUser(username: string, password: string) {
  await ensureTableExists();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({
    username,
    password: hash,
    role: 'user',
    coolchat: '0'
  });
}

export async function updateUserCoolchat(username: string, status: string) {
  await ensureTableExists();
  return await db
    .update(users)
    .set({ coolchat: status })
    .where(eq(users.username, username));
}

// 4. Table Guard & Migration Helper
async function ensureTableExists() {
  const userTableCheck = await postgres`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'User'
    );`;

  if (!userTableCheck[0].exists) {
    await postgres`
      CREATE TABLE "User" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(64),
        password VARCHAR(64),
        role VARCHAR(20) DEFAULT 'user',
        coolchat TEXT DEFAULT '0'
      );`;
  } else {
    await postgres`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS coolchat TEXT DEFAULT '0';
    `;
  }
  return users;
}