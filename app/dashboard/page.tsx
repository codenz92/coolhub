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
  },
  {
    name: "Hangman Game",
    description: "Launch the internal demo app living in your project.",
    url: "/dashboard/hangman-app",
    icon: "🚀",
    color: "bg-orange-500",
  },
  {
    name: "Internal Demo 3",
    description: "Launch the internal demo app living in your project.",
    url: "/dashboard/demo-app",
    icon: "🚀",
    color: "bg-orange-500",
  },
  {
    name: "Internal Demo 4",
    description: "Launch the internal demo app living in your project.",
    url: "/dashboard/demo-app",
    icon: "🚀",
    color: "bg-orange-500",
  },
  {
    name: "Internal Demo 5",
    description: "Launch the internal demo app living in your project.",
    url: "/dashboard/demo-app",
    icon: "🚀",
    color: "bg-orange-500",
  },
  {
    name: "Internal Demo 6",
    description: "Launch the internal demo app living in your project.",
    url: "/dashboard/demo-app",
    icon: "🚀",
    color: "bg-orange-500",
  },
];

export default async function Dashboard() {
  const session = await auth(); //

  if (!session) redirect('/login'); //

  // Permissions Logic: Grant access if user is admin OR has the '1' flag
  const isDevOrRio = ["dev", "rio"].includes(session.user?.username || "");
  const hasCoolChatAccess = (session.user as any)?.coolchat === '1' || isDevOrRio;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-lg text-gray-500 mt-2 font-light">
          Logged in as <span className="font-medium text-black">{session.user?.username}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MY_APPS.map((app) => {
          // Check if this specific user can access this specific app
          const isCoolChat = app.name === "COOLCHAT";
          const canAccess = isCoolChat ? hasCoolChatAccess : true;

          return (
            <div key={app.name} className="relative group">
              <Link
                href={canAccess ? app.url : "#"}
                className={`block h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all 
                  ${canAccess ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-60 cursor-not-allowed'}`}
              >
                <div className={`w-12 h-12 ${app.color} rounded-xl mb-4 flex items-center justify-center text-2xl text-white shadow-inner`}>
                  {app.icon}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className={`text-xl font-bold transition-colors ${canAccess ? 'group-hover:text-blue-600' : ''}`}>
                    {app.name}
                  </h3>

                  {isCoolChat && (
                    <span className="relative flex h-5 w-fit items-center justify-center">
                      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                      <span className="relative inline-flex items-center text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                        PREMIUM
                      </span>
                    </span>
                  )}
                </div>

                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  {app.description}
                </p>

                {/* Status Indicator */}
                {canAccess ? (
                  <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                    Launch Application →
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    ACCESS RESTRICTED
                  </div>
                )}
              </Link>

              {/* Locked Overlay for UI clarity */}
              {!canAccess && (
                <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center bg-zinc-50/10 backdrop-blur-[0.5px]">
                  <span className="bg-zinc-800 text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-[0.2em] uppercase shadow-2xl">
                    LOCKED
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}