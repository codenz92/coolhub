import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';

export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 64 }),
  password: varchar('password', { length: 64 }),
});

let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
export const db = drizzle(client);

export async function getUser(username: string) {
  // Use the top-level exported 'users' directly
  return await db.select().from(users).where(eq(users.username, username));
}

export async function createUser(username: string, password: string) {
  const users = await ensureTableExists();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ username, password: hash });
}

async function ensureTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'User'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE "User" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(64),
        password VARCHAR(64),
        role VARCHAR(20) DEFAULT 'user'
      );`;
  }

  const table = pgTable('User', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 64 }),
    password: varchar('password', { length: 64 }),
  });

  return table;
}
