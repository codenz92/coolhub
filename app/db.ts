// app/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import postgres_lib from 'postgres'; // Renamed import to avoid conflict with the variable name
import { genSaltSync, hashSync } from 'bcrypt-ts';

// 1. Define Tables for Drizzle
export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 64 }),
  password: varchar('password', { length: 64 }),
  role: varchar('role', { length: 20 }).default('user'),
});

// 2. Setup the Postgres Client and Export it
// This fixes the "postgres is not exported" error
export const postgres = postgres_lib(`${process.env.POSTGRES_URL!}?sslmode=require`);
export const db = drizzle(postgres);

// 3. Database Helper Functions
export async function getUser(username: string) {
  await ensureTableExists();
  return await db.select().from(users).where(eq(users.username, username));
}

export async function createUser(username: string, password: string) {
  await ensureTableExists();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({
    username,
    password: hash,
    role: 'user'
  });
}

// 4. Table Guard - Ensures both User and ChatMessage tables exist in Neon
async function ensureTableExists() {
  // Check for User table
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
        role VARCHAR(20) DEFAULT 'user'
      );`;
  }

  // Check for ChatMessage table
  const chatTableCheck = await postgres`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'ChatMessage'
    );`;

  if (!chatTableCheck[0].exists) {
    await postgres`
      CREATE TABLE "ChatMessage" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(64) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`;
  }

  return users;
}