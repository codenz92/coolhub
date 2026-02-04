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
    permissionKey: "coolchat" // Key to check in the user object
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

  // Assuming your database adapter adds the 'coolchat' column to the session user object
  // If your session doesn't have it yet, ensure your auth config includes it in the session callback
  const userPermissions = session.user as any;
  const hasAccess = userPermissions.coolchat === 1;

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
          // CHECK ACCESS: If the app requires 'coolchat' permission, check if user.coolchat === 1
          const hasAccess = app.permissionKey
            ? userPermissions[app.permissionKey] === 1
            : true;

          const CardContent = (
            <div className={`h-full flex flex-col ${!hasAccess ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
              <div className={`w-12 h-12 ${app.color} rounded-xl mb-4 flex items-center justify-center text-2xl text-white shadow-inner`}>
                {app.icon}
              </div>

              <div className="flex items-center gap-2">
                <h3 className={`text-xl font-bold ${hasAccess ? 'group-hover:text-blue-600' : ''} transition-colors`}>
                  {app.name}
                </h3>
                {app.name === "COOLCHAT" && hasAccess && (
                  <span className="relative flex h-5 w-fit items-center justify-center">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                    <span className="relative inline-flex items-center text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                      PREMIUM
                    </span>
                  </span>
                )}
                {!hasAccess && (
                  <span className="text-[10px] font-black text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-300 uppercase">
                    Locked
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                {app.description}
              </p>

              <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 transition-all">
                {hasAccess ? "Launch Application →" : "Access Restricted"}
              </div>
            </div>
          );

          if (!hasAccess) {
            return (
              <div key={app.name} className="relative bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-sm">
                {CardContent}
              </div>
            );
          }

          return (
            <Link
              key={app.name}
              href={app.url}
              className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {CardContent}
            </Link>
          );
        })}
      </div>
    </main>
  );
}