'use client'
import { useState, useEffect } from 'react';
import { getIpData } from './actions';
import Link from 'next/link';

export default function IpLookupApp() {
    const [data, setData] = useState<any>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showRaw, setShowRaw] = useState(false);

    const handleSearch = async (ip?: string) => {
        setLoading(true);
        const result = await getIpData(ip);
        setData(result);
        setLoading(false);
    };

    useEffect(() => { handleSearch(); }, []);

    return (
        <div className="min-h-screen bg-zinc-900 p-8 text-zinc-100">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-mono font-bold">NET INSPECTOR v1.0</h1>
                        <p className="text-zinc-500 text-sm mt-1">Deep packet geolocation & routing analysis</p>
                    </div>
                    <Link href="/dashboard" className="px-4 py-2 bg-zinc-800 rounded border border-zinc-700 hover:bg-zinc-700 transition text-sm">
                        EXIT
                    </Link>
                </header>

                {/* Search Bar */}
                <div className="flex gap-2 mb-10 bg-zinc-800 p-1 rounded-lg border border-zinc-700 shadow-2xl">
                    <input
                        type="text"
                        placeholder="ENTER TARGET IP..."
                        className="flex-1 px-4 py-3 bg-transparent outline-none font-mono"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        onClick={() => handleSearch(input)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded font-bold transition shadow-lg shadow-blue-900/20"
                    >
                        {loading ? 'RUNNING...' : 'SCAN'}
                    </button>
                </div>

                {data && data.status === 'success' ? (
                    <div className="space-y-6">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard label="IP_ADDR" value={data.query} />
                            <StatCard label="LOC_COORDS" value={`${data.lat}, ${data.lon}`} />
                            <StatCard label="ASN" value={data.as} />
                        </div>

                        {/* Detailed Technical Specs */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-xl">
                                <h3 className="text-blue-400 font-mono text-xs mb-4 underline">GEOGRAPHIC INTEL</h3>
                                <div className="space-y-3">
                                    <DataRow label="Country" value={data.country} />
                                    <DataRow label="Region" value={data.regionName} />
                                    <DataRow label="City" value={data.city} />
                                    <DataRow label="Zip" value={data.zip} />
                                    <DataRow label="Timezone" value={data.timezone} />
                                </div>
                            </div>

                            <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-xl">
                                <h3 className="text-emerald-400 font-mono text-xs mb-4 underline">NETWORK INTEL</h3>
                                <div className="space-y-3">
                                    <DataRow label="ISP" value={data.isp} />
                                    <DataRow label="Org" value={data.org} />
                                    <DataRow label="Reverse DNS" value={data.reverse || 'N/A'} />
                                    <DataRow label="Node Hosting" value={data.hosting ? 'TRUE' : 'FALSE'} />
                                    <DataRow label="Mobile Gateway" value={data.mobile ? 'TRUE' : 'FALSE'} />
                                </div>
                            </div>
                        </div>

                        {/* Raw JSON Toggle */}
                        <div className="mt-10">
                            <button
                                onClick={() => setShowRaw(!showRaw)}
                                className="text-xs text-zinc-500 hover:text-zinc-300 underline font-mono"
                            >
                                {showRaw ? 'HIDE RAW DATA' : 'VIEW RAW DATA'}
                            </button>
                            {showRaw && (
                                <pre className="mt-4 p-4 bg-black border border-zinc-800 rounded text-[10px] text-emerald-500 overflow-x-auto shadow-inner">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-700 rounded-xl bg-zinc-800/20">
                        <div className="animate-pulse text-zinc-600 font-mono">{loading ? 'SCANNING PORTS...' : 'AWAITING INPUT'}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-zinc-800 p-5 rounded-lg border border-zinc-700 shadow-md">
            <p className="text-[10px] font-mono text-zinc-500 mb-1">{label}</p>
            <p className="text-lg font-mono font-bold text-white truncate">{value}</p>
        </div>
    );
}

function DataRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between border-b border-zinc-700/50 pb-2">
            <span className="text-zinc-500 text-sm font-mono">{label}:</span>
            <span className="text-zinc-200 text-sm font-medium">{value}</span>
        </div>
    );
}