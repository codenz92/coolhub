// app/dashboard/page.tsx
import { auth, signOut } from '../auth';
import { redirect } from 'next/navigation';

// 1. Data Structure (Static for now, can be moved to Neon/Drizzle later)
const MY_APPS = [
  {
    name: "Analytics Pro",
    description: "Real-time traffic tracking and user behavior insights.",
    url: "https://analytics.example.com",
    icon: "📊",
    color: "bg-blue-500",
  },
  {
    name: "Inventory Manager",
    description: "Manage stock levels and supplier contacts seamlessly.",
    url: "https://inventory.example.com",
    icon: "📦",
    color: "bg-emerald-500",
  },
  {
    name: "Customer Support",
    description: "Help desk and ticketing system for your clients.",
    url: "https://support.example.com",
    icon: "🎧",
    color: "bg-purple-500",
  },
];

export default async function Dashboard() {
  const session = await auth();

  // If no user is authenticated, redirect to login
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50/50 text-slate-900">
      {/* Navigation Header */}
      <nav className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-xl tracking-tight">Console</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-gray-500">{session.user?.email}</span>

          {/* Sign Out Button - Built-in so you don't need a separate component file */}
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="text-lg text-gray-500 mt-2 font-light">
            You are logged in as <span className="font-medium text-black">{session.user?.email}</span>
          </p>
        </header>

        {/* The Grid of Apps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MY_APPS.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200"
            >
              <div className={`w-12 h-12 ${app.color} rounded-xl mb-4 flex items-center justify-center text-2xl shadow-inner text-white`}>
                {app.icon}
              </div>
              <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                {app.name}
              </h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                {app.description}
              </p>

              <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                Launch Application
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}

          {/* New App Request Card */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
            <div className="text-3xl mb-1">+</div>
            <p className="text-sm font-medium">Request App Access</p>
          </div>
        </div>
      </main>
    </div>
  );
}