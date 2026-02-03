import { db } from '../../db'; // Adjust path to your db file
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

export async function GET(request: Request) {
    // 1. Verify this is a legitimate request from Vercel
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Delete messages older than 24 hours
        // This ensures a "rolling window" of messages
        await db.execute(
            sql`DELETE FROM "ChatMessage" WHERE created_at < NOW() - INTERVAL '24 hours'`
        );

        return NextResponse.json({ success: true, message: "Old messages purged." });
    } catch (error) {
        console.error('Cleanup failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}