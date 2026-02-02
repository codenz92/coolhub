// app/dashboard/layout.tsx
import { auth, signOut } from '../auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect('/login');

    return (
        <div className="min-h-screen bg-gray-50/50">
            <nav className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CH</span>
                    </div>
                    <span className="font-semibold text-xl tracking-tight">Dashboard</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden md:block text-sm text-gray-500">
                        {session.user?.username}
                    </span>
                    {/* Corrected Admin visibility check */}
                    {(session.user as any)?.username === "dev" || (session.user as any)?.username === "rio" && (
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Admin Panel
                        </Link>
                    )}

                    <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                        <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </nav>
            {/* This is where the specific page content (Dashboard or Demo) will load */}
            <main>{children}</main>
        </div>
    );
}