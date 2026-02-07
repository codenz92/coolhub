'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";

export default function DashboardClient({ apps, isAdminUser, sessionUser }: any) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recentlyLaunched, setRecentlyLaunched] = useState<string[]>([]);

    useEffect(() => {
        const savedFavs = localStorage.getItem('coolhub_favorites');
        const savedRecent = localStorage.getItem('coolhub_recent');
        if (savedFavs) setFavorites(JSON.parse(savedFavs));
        if (savedRecent) setRecentlyLaunched(JSON.parse(savedRecent));
    }, []);

    const toggleFavorite = (e: React.MouseEvent, appName: string) => {
        e.preventDefault();
        e.stopPropagation();
        const updated = favorites.includes(appName)
            ? favorites.filter(name => name !== appName)
            : [...favorites, appName];
        setFavorites(updated);
        localStorage.setItem('coolhub_favorites', JSON.stringify(updated));
    };

    const trackLaunch = (appName: string) => {
        const updated = [appName, ...recentlyLaunched.filter(name => name !== appName)].slice(0, 3);
        setRecentlyLaunched(updated);
        localStorage.setItem('coolhub_recent', JSON.stringify(updated));
    };

    const filteredApps = apps.filter((app: any) => {
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
        if (filter === "free") return matchesSearch && !app.permission;
        if (filter === "premium") return matchesSearch && app.permission;
        return matchesSearch;
    });

    return (
        <div className="space-y-12 py-12 px-6 max-w-7xl mx-auto">
            {/* 1. Header & System Status */}
            <header className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">System_Authorized</p>
                </div>
                <h1 className="text-5xl font-black tracking-[-0.08em] text-white uppercase italic leading-none">
                    Welcome Back
                </h1>
            </header>

            {/* 2. Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <input
                        type="text"
                        placeholder="Search modules..."
                        className="w-full pl-6 pr-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-white placeholder:text-zinc-700 text-sm"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex bg-zinc-900/80 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                    {["all", "free", "premium"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Application Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredApps.map((app: any) => {
                    const hasAccess = !app.permission || isAdminUser || sessionUser?.[app.permission] === '1';
                    const isFavorited = favorites.includes(app.name);

                    return (
                        <div key={app.name} className="relative group">
                            <Link
                                href={hasAccess ? app.url : "#"}
                                onClick={() => hasAccess && trackLaunch(app.name)}
                                className={`block h-full relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-1 backdrop-blur-xl transition-all duration-500 
                                ${hasAccess ? 'hover:border-emerald-500/30 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]' : 'opacity-40 grayscale pointer-events-none'}`}
                            >
                                <div className="bg-zinc-950/40 rounded-[2.2rem] p-8 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center text-3xl text-white shadow-2xl border border-white/10 group-hover:scale-110 transition-transform`}>
                                            {app.icon}
                                        </div>
                                        <button
                                            onClick={(e) => toggleFavorite(e, app.name)}
                                            className={`p-2 transition-all ${isFavorited ? 'text-emerald-500' : 'text-zinc-700 hover:text-zinc-400'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                            {app.name}
                                        </h3>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter ${!app.permission ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5'}`}>
                                            {!app.permission ? 'Free' : 'Premium'}
                                        </span>
                                    </div>

                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 flex-grow">
                                        {hasAccess ? app.description : "Module requires elevated privileges."}
                                    </p>

                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-emerald-500 transition-colors">
                                        {hasAccess ? 'Execute Module' : 'Locked'} <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}