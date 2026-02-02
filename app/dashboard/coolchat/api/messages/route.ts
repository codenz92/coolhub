// app/api/messages/route.ts
import { postgres } from '../../../../db';
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

const sql = postgres;

// This function sends the messages to your Chat page
export async function GET() {
    try {
        const messages = await sql`
      SELECT * FROM "ChatMessage" 
      ORDER BY created_at ASC 
      LIMIT 50
    `;
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Table might not exist yet" }, { status: 500 });
    }
}

// This function saves new messages when someone clicks 'Send'
export async function POST(req: Request) {
    const session = await auth();

    // Security check: must be logged in to chat
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await req.json();
    const username = session.user?.username || 'Guest';

    await sql`
    INSERT INTO "ChatMessage" (username, text)
    VALUES (${username}, ${text})
  `;

    return NextResponse.json({ success: true });
}