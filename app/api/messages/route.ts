import { postgres } from '@/app/db';
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch messages ordered by the encrypted time string
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

    // Accept all encrypted metadata from the frontend
    const { username, text, created_at } = await req.json();

    try {
        await postgres`
            INSERT INTO "ChatMessage" (username, text, created_at) 
            VALUES (${username}, ${text}, ${created_at})
        `;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Post Error:", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}