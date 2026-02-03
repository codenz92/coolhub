import { postgres } from '@/app/db';
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch the 50 most recent messages including all encrypted columns
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

    // 1. EXTRACT: Get the encrypted username, text, and created_at from the frontend
    const { username, text, created_at } = await req.json();

    try {
        // 2. SAVE: Insert the encrypted strings exactly as they arrived
        // Note: Using 'created_at' to match your database column name
        await postgres`
            INSERT INTO "ChatMessage" (username, text, created_at) 
            VALUES (${username}, ${text}, ${created_at})
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Post Error:", error);
        return NextResponse.json({ error: "Failed to save encrypted data" }, { status: 500 });
    }
}