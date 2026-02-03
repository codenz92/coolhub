import { postgres } from '@/app/db';
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. AUTO-DELETE: Purge messages older than 24 hours automatically
        await postgres`
            DELETE FROM "ChatMessage" 
            WHERE server_timestamp < NOW() - INTERVAL '24 hours'
        `;

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

    const { username, text, server_timestamp } = await req.json();

    try {
        // server_timestamp is filled automatically by your Vercel database
        await postgres`
            INSERT INTO "ChatMessage" (username, text, server_timestamp) 
            VALUES (${username}, ${text}, ${server_timestamp})
        `;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Post Error:", error);
        return NextResponse.json({ error: "Failed to save encrypted message" }, { status: 500 });
    }
}

// 2. TARGETED DELETE: Added to support the "Clear Vault" button in page.jsx
export async function DELETE(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: "Invalid IDs provided" }, { status: 400 });
        }

        // Deletes only the specific rows your frontend was able to decrypt
        await postgres`
            DELETE FROM "ChatMessage" 
            WHERE id = ANY(${ids})
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Failed to clear targeted messages" }, { status: 500 });
    }
}