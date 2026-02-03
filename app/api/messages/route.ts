import { postgres } from '@/app/db';
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. AUTO-DELETE: Purge messages where the server_timestamp is older than 24 hours
        await postgres`
            DELETE FROM "ChatMessage" 
            WHERE server_timestamp < NOW() - INTERVAL '24 hours'
        `;

        // 2. Fetch the remaining fresh messages
        const messages = await postgres`SELECT * FROM "ChatMessage" ORDER BY id ASC LIMIT 50`;
        return NextResponse.json(messages);
    } catch (error) {
        console.error("DB Error:", error);
        return NextResponse.json({ error: "Table error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { username, text, created_at } = await req.json();

    try {
        // 3. The server_timestamp is filled automatically by the database
        await postgres`
            INSERT INTO "ChatMessage" (username, text, created_at) 
            VALUES (${username}, ${text}, ${created_at})
        `;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Post Error:", error);
        return NextResponse.json({ error: "Failed to save encrypted message" }, { status: 500 });
    }
}