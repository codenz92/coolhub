'use client'
import { useState, useEffect } from 'react';
import { getIpData } from './actions';
import Link from 'next/link';

export default function IpLookupApp() {
    const [data, setData] = useState<any>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (ip?: string) => {
        setLoading(true);
        const result = await getIpData(ip);
        setData(result);
        setLoading(false);
    };

    // Load the user's current IP info on mount
    useEffect(() => { handleSearch(); }, []);

    return (
        <div className="min-h-screen bg-zinc-50 p-8 text-black">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tight">IP Scanner 📡</h1>
                    <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-black">← Back</Link>
                </div>

                {/* Search Bar */}
                <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-zinc-200">
                    <input
                        type="text"
                        placeholder="Search any IP address..."
                        className="flex-1 px-4 py-2 outline-none"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        onClick={() => handleSearch(input)}
                        className="bg-black text-white px-6 py-2 rounded-lg font-medium"
                    >
                        {loading ? '...' : 'Lookup'}
                    </button>
                </div>

                {/* Results Grid */}
                {data && data.status === 'success' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ResultCard label="IP Address" value={data.query} />
                        <ResultCard label="Location" value={`${data.city}, ${data.regionName}, ${data.country}`} />
                        <ResultCard label="Zip Code" value={data.zip || "N/A"} />
                        <ResultCard label="ISP" value={data.isp} />
                        <ResultCard label="Organization" value={data.org || "N/A"} />
                        <ResultCard label="AS Number" value={data.as} />
                        <ResultCard label="Timezone" value={data.timezone} />
                        <ResultCard label="Latitude" value={data.lat.toString()} />
                        <ResultCard label="Longitude" value={data.lon.toString()} />

                        {/* Security / VPN Check Card */}
                        <div className={`p-6 rounded-2xl border shadow-sm ${data.proxy ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                            <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">Security Check</p>
                            <p className={`text-lg font-bold ${data.proxy ? 'text-red-700' : 'text-emerald-700'}`}>
                                {data.proxy ? '🚩 VPN/Proxy Detected' : '✅ Direct Connection'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center text-zinc-400 border-2 border-dashed rounded-2xl">
                        {loading ? 'Locating...' : 'Enter a valid IP to see details'}
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <p className="text-xs font-semibold text-zinc-400 uppercase mb-1">{label}</p>
            <p className="text-lg font-mono text-zinc-900">{value}</p>
        </div>
    );
}