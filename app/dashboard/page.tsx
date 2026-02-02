// app/dashboard/page.tsx
import { auth, signOut } from '../auth';
import { redirect } from 'next/navigation';
import Link from "next/link";

const MY_APPS = [
  {
    name: "Internal Demo",
    description: "Launch the internal demo app living in your project.",
    url: "/dashboard/demo-app", // Ensure this matches your folder name in /app
    icon: "🚀",
    color: "bg-orange-500",
  },
  {
    name: "Analytics Pro",
    description: "Real-time traffic tracking and user behavior insights.",
    url: "https://analytics.example.com",
    icon: "📊",
    color: "bg-blue-500",
  },
];

export default async function Dashboard() {
  const session = await auth();

  if (!session) redirect('/login');

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
            <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
              {app.name}
            </h3>
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