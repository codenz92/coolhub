// app/dashboard/coolchat/page.tsx
import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import CoolChatClient from '../coolchat/coolchatclient'; // This is your chat UI file

export default async function CoolChatPage() {
    const session = await auth();

    // 1. Force login if session is lost
    if (!session) redirect('/login');

    const user = session.user as any;

    // 2. Server-side security check: Only allow if flag is '1' or user is an admin
    const hasAccess =
        user?.coolchat === '1' ||
        ["dev", "rio"].includes(user?.username || "");

    if (!hasAccess) {
        redirect('/dashboard?error=unauthorized');
    }

    // 3. Render the client component and pass the session
    return <CoolChatClient session={session} />;
}