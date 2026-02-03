import { postgres } from '@/app/db';
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // We use double quotes to match the Drizzle table name exactly
        const messages = await postgres`SELECT * FROM "ChatMessage" ORDER BY created_at ASC LIMIT 50`;
        return NextResponse.json(messages);
    } catch (error) {
        console.error("DB Error:", error);
        return NextResponse.json({ error: "Table error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await req.json();
    const username = session.user?.username || 'Guest';

    await postgres`INSERT INTO "ChatMessage" (username, text) VALUES (${username}, ${text})`;
    return NextResponse.json({ success: true });
}