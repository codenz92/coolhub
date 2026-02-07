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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
            {/* 1. Integrated Background Logic (Matches Login) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Subtle technical grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

                {/* Animated Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
            </div>

            {/* 2. Glass Terminal Navigation */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl px-6 py-4 shadow-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg group">
                            <span className="text-white font-black text-xs group-hover:text-emerald-500 transition-colors">CH</span>
                        </div>
                        <span className="font-black text-lg tracking-tighter uppercase italic select-none">
                            COOLHUB
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Status/User Details */}
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Operator</span>
                            <span className="text-sm font-bold text-zinc-200">{session.user?.username}</span>
                        </div>

                        {(session.user as any)?.role === "admin" && (
                            <Link
                                href="/admin"
                                className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full transition-all bg-emerald-500/5"
                            >
                                Admin_Root
                            </Link>
                        )}

                        <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                            <button className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-400 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 group-hover:bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                Terminate
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* 3. Dashboard Viewport */}
            <main className="relative z-10">
                {children}
            </main>
        </div>
    );
}