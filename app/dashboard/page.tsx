// app/dashboard/page.tsx
import { auth, signOut } from '../auth';
import { redirect } from 'next/navigation';
import Link from "next/link";

const MY_APPS = [
  {
    name: "COOLCHAT",
    description: "Launch the coolest end-to-end encrypted chat ever.",
    url: "/dashboard/coolchat", // Ensure this matches your folder name in /app
    icon: "💬",
    color: "bg-zinc-900",
  },
  {
    name: "Demo app",
    description: "Launch the internal demo app living in your project.",
    url: "/dashboard/demo-app", // Ensure this matches your folder name in /app
    icon: "🚀",
    color: "bg-orange-500",
  },
];

export default async function Dashboard() {
  const session = await auth(); //

  if (!session) redirect('/login'); //

  // Logic to allow both dev and rio admin-level view
  const isAdminUser = ["dev", "rio"].includes(session.user?.username || "") || (session.user as any)?.role === "admin"; //

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-lg text-gray-500 mt-2 font-light">
          Logged in as <span className="font-medium text-black">{session.user?.username}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MY_APPS.map((app) => (
          <Link
            key={app.name}
            href={app.url}
            className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`w-12 h-12 ${app.color} rounded-xl mb-4 flex items-center justify-center text-2xl text-white shadow-inner`}>
              {app.icon}
            </div>

            {/* Wrapper for Title and Badge */}
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                {app.name}
              </h3>
              {/* The Pulsing Glow Badge */}
              {app.name === "COOLCHAT" && (
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
            <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
              Launch Application →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}