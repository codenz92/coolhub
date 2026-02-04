// app/dashboard/page.tsx
import { auth } from '../auth';
import { redirect } from 'next/navigation';
import Link from "next/link";

const MY_APPS = [
  {
    name: "COOLCHAT",
    description: "Launch the coolest end-to-end encrypted chat ever.",
    url: "/dashboard/coolchat",
    icon: "💬",
    color: "bg-zinc-900",
    permission: "coolchat", // Matches the database column
  },
  {
    name: "Hangman Game",
    description: "Launch the internal demo app living in your project.",
    url: "/dashboard/hangman-app",
    icon: "🚀",
    color: "bg-orange-500",
  },
];

export default async function Dashboard() {
  const session = await auth();

  if (!session) redirect('/login');

  const user = session.user as any;
  // Admins (dev/rio) bypass all permission locks
  const isSuperAdmin = ["dev", "rio"].includes(user?.username || "");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">TERMINAL DASHBOARD</h1>
        <p className="text-lg text-gray-500 mt-2 font-light">
          Authorized User: <span className="font-medium text-black">{user?.username}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MY_APPS.map((app) => {
          // Access check: true if app has no permission key, user is admin, or flag is '1'
          const hasAccess = !app.permission || isSuperAdmin || user[app.permission] === '1';

          return (
            <div key={app.name} className="relative group">
              <Link
                href={hasAccess ? app.url : "#"}
                className={`block h-full bg-white border border-gray-200 rounded-2xl p-6 transition-all 
                  ${hasAccess ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-40 cursor-not-allowed'}`}
              >
                <div className={`w-12 h-12 ${app.color} rounded-xl mb-4 flex items-center justify-center text-white text-2xl shadow-inner`}>
                  {app.icon}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className={`text-xl font-bold ${hasAccess ? 'group-hover:text-blue-600' : 'text-gray-400'}`}>
                    {app.name}
                  </h3>
                  {app.name === "COOLCHAT" && (
                    <span className="relative flex h-5 w-fit items-center justify-center">
                      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                      <span className="relative inline-flex items-center text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300">
                        PREMIUM
                      </span>
                    </span>
                  )}
                </div>

                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  {hasAccess ? app.description : "Access restricted. Contact an administrator to unlock this terminal."}
                </p>

                {hasAccess ? (
                  <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                    Launch Terminal →
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    LOCKED
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}