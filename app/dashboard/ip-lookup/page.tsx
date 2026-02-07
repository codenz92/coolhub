'use client'
import { useState, useEffect } from 'react';
import { getIpData } from './actions';
import Link from 'next/link';

export default function IpLookupApp() {
    const [data, setData] = useState<any>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    // Initialize history from browser storage and load initial IP
    useEffect(() => {
        const saved = localStorage.getItem('ip_history');
        if (saved) setHistory(JSON.parse(saved));
        handleSearch();
    }, []);

    const handleSearch = async (ip?: string) => {
        setLoading(true);
        const result = await getIpData(ip);
        if (result.status === 'success') {
            setData(result);
            // Save to history, keeping only the 5 most recent unique scans
            setHistory(prev => {
                const updated = [result.query, ...prev.filter(i => i !== result.query)].slice(0, 5);
                localStorage.setItem('ip_history', JSON.stringify(updated));
                return updated;
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 text-black flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar: Scan History */}
            <aside className="w-full lg:w-64 space-y-4">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recent Scans</h2>
                <div className="flex flex-col gap-2">
                    {history.map(ip => (
                        <button key={ip} onClick={() => handleSearch(ip)} className="text-left p-3 text-sm font-mono bg-white border border-zinc-200 rounded-xl hover:border-black transition shadow-sm">
                            {ip}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Network Intelligence 📡</h1>
                    <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-black">← Back</Link>
                </div>

                {/* Search Interface */}
                <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-zinc-200">
                    <input
                        type="text" placeholder="Scan any IP Address..." className="flex-1 px-4 outline-none"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button onClick={() => handleSearch(input)} className="bg-black text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95">
                        {loading ? 'Scanning...' : 'Lookup'}
                    </button>
                </div>

                {data && data.status === 'success' ? (
                    <div className="space-y-6">
                        {/* Primary Data Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <ResultCard label="IP Address" value={data.query} />
                            <ResultCard label="Provider" value={data.isp} />
                            <ResultCard label="Organization" value={data.org || 'N/A'} />
                            <ResultCard label="Location" value={`${data.city}, ${data.country}`} />
                            <ResultCard label="Currency" value={data.currency} />
                            <ResultCard label="Timezone" value={data.timezone} />
                        </div>

                        {/* Connection Intelligence */}
                        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4">Connection Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <DetailBadge label="Mobile" active={data.mobile} />
                                <DetailBadge label="Proxy/VPN" active={data.proxy} danger />
                                <DetailBadge label="Hosting/DC" active={data.hosting} />
                                <DetailBadge label="Business" active={data.business} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center border-2 border-dashed rounded-3xl text-zinc-300">
                        {loading ? 'Interpreting network packets...' : 'Ready for a new scan'}
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight mb-1">{label}</p>
            <p className="text-lg font-mono font-medium truncate text-zinc-900">{value}</p>
        </div>
    );
}

function DetailBadge({ label, active, danger }: { label: string, active: boolean, danger?: boolean }) {
    return (
        <div className={`p-4 rounded-2xl text-center border transition-all ${active
            ? (danger ? 'bg-red-50 border-red-200 text-red-700 font-bold' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
            : 'bg-zinc-50 border-zinc-100 text-zinc-400'
            }`}>
            <p className="text-[11px] mb-1">{label}</p>
            <p className="text-xs">{active ? 'DETECTED' : 'NO'}</p>
        </div>
    );
}