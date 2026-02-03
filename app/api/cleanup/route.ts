import { postgres } from '@/app/db';
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. AUTO-DELETE: Purge messages older than 24 hours based on server_timestamp
        await postgres`
            DELETE FROM "ChatMessage" 
            WHERE server_timestamp < NOW() - INTERVAL '24 hours'
        `;

        // 2. Fetch fresh messages
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

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { ids } = await req.json();
        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
        }

        // 3. TARGETED DELETE: Clears only the IDs currently decrypted by the user
        await postgres`
            DELETE FROM "ChatMessage" 
            WHERE id IN (${ids})
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Failed to clear targeted messages" }, { status: 500 });
    }
}