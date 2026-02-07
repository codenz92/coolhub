import { auth } from '../auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

const MY_APPS = [
  {
    name: "COOLCHAT",
    description: "Launch the coolest end-to-end encrypted chat ever.",
    url: "/dashboard/coolchat",
    icon: "💬",
    color: "bg-zinc-900",
    permission: "coolchat",
  },
  {
    name: "NET INSPECTOR",
    description: "Scan any IP address for geolocation and network details.",
    url: "/dashboard/ip-lookup",
    icon: "📍",
    color: "bg-zinc-900",
  },
  {
    name: "demo app",
    description: "A placeholder for future projects.",
    url: "#",
    icon: "🧪",
    color: "bg-zinc-900",
  }
];

export default async function Dashboard() {
  const session = await auth();

  if (!session) redirect('/login');

  const isAdminUser = ["dev", "rio"].includes(session.user?.username || "") || (session.user as any)?.role === "admin";

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-black">Welcome back</h1>
        <p className="text-lg text-gray-500 mt-2 font-light">
          Logged in as <span className="font-medium text-black">{session.user?.username}</span>
        </p>
      </header>

      {/* Inject the Client Component for Search/Filter functionality */}
      <DashboardClient
        apps={MY_APPS}
        isAdminUser={isAdminUser}
        sessionUser={session.user}
      />
    </main>
  );
}