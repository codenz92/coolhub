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
            {/* Universal Navigation Bar */}
            <nav className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CH</span>
                        </div>
                        <span className="font-semibold text-xl tracking-tight text-slate-900">Platform</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        Dashboard
                    </Link>

                    {(session.user as any)?.role === "admin" && (
                        <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
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