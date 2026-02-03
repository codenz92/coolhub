import { postgres } from '@/app/db';
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
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

    // Capture the new encrypted payload from the Option 3 frontend
    const { username, text, created_at } = await req.json();

    try {
        // Save the encrypted blobs directly into the DB
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