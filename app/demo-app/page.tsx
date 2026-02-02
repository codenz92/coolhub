// app/demo-app/page.tsx
import Link from 'next/link';

export default function DemoApp() {
    return (
        <div className="min-h-screen bg-white p-12">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4 text-black">Demo Application 🚀</h1>
                <p className="text-gray-600 mb-8 font-light">
                    This is a separate &quot;app&quot; living inside your Next.js project.
                </p>
                <Link
                    href="/dashboard"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all inline-block"
                >
                    ← Return to Dashboard
                </Link>
            </div>
        </div>
    );
}