'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";

export default function DashboardClient({ apps, isAdminUser, sessionUser }: any) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recentlyLaunched, setRecentlyLaunched] = useState<string[]>([]);

    // 1. Load persistence data from localStorage on mount
    useEffect(() => {
        const savedFavs = localStorage.getItem('coolhub_favorites');
        const savedRecent = localStorage.getItem('coolhub_recent');
        if (savedFavs) setFavorites(JSON.parse(savedFavs));
        if (savedRecent) setRecentlyLaunched(JSON.parse(savedRecent));
    }, []);

    // 2. Toggle Favorite (Pinning) Logic
    const toggleFavorite = (e: React.MouseEvent, appName: string) => {
        e.preventDefault(); // Prevent Link from triggering
        e.stopPropagation();
        const updated = favorites.includes(appName)
            ? favorites.filter(name => name !== appName)
            : [...favorites, appName];
        setFavorites(updated);
        localStorage.setItem('coolhub_favorites', JSON.stringify(updated));
    };

    // 3. Track Recent Launches
    const trackLaunch = (appName: string) => {
        const updated = [appName, ...recentlyLaunched.filter(name => name !== appName)].slice(0, 3);
        setRecentlyLaunched(updated);
        localStorage.setItem('coolhub_recent', JSON.stringify(updated));
    };

    // 4. Filtering Logic
    const filteredApps = apps.filter((app: any) => {
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
        const isFree = !app.permission;

        if (filter === "free") return matchesSearch && isFree;
        if (filter === "premium") return matchesSearch && !isFree;
        return matchesSearch;
    });

    // 5. Sorting Logic (Favorites pinned to top)
    const sortedApps = [...filteredApps].sort((a, b) => {
        const aFav = favorites.includes(a.name) ? 1 : 0;
        const bFav = favorites.includes(b.name) ? 1 : 0;
        return bFav - aFav;
    });

    return (
        <div className="space-y-12">
            {/* 1. RECENTLY LAUNCHED SECTION */}
            {recentlyLaunched.length > 0 && !search && filter === "all" && (
                <section className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Jump Back In
                        </h2>
                        <button
                            onClick={() => {
                                setRecentlyLaunched([]);
                                localStorage.removeItem('coolhub_recent');
                            }}
                            className="text-[10px] font-bold text-gray-300 hover:text-red-500 transition-colors uppercase tracking-widest"
                        >
                            Clear History
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {recentlyLaunched.map(name => {
                            const app = apps.find((a: any) => a.name === name);
                            if (!app) return null;
                            return (
                                <Link
                                    key={name}
                                    href={app.url}
                                    onClick={() => trackLaunch(app.name)}
                                    className="flex items-center gap-3 bg-white border border-gray-100 pr-6 pl-2 py-2 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                                >
                                    <div className={`w-10 h-10 ${app.color} rounded-xl flex items-center justify-center text-xl shadow-inner`}>
                                        {app.icon}
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600">{app.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* SEARCH & FILTER SECTION */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-black"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                    {["all", "free", "premium"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-white text-black shadow-md" : "text-gray-400 hover:text-black"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    {favorites.length > 0 && !search && "Favorites pinned • "} Found {sortedApps.length} Results
                </p>
            </div>

            {/* APPLICATIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedApps.map((app: any) => {
                    const hasAccess = !app.permission || isAdminUser || sessionUser?.[app.permission] === '1';
                    const isFavorited = favorites.includes(app.name);

                    return (
                        <div key={app.name} className="relative group">
                            {/* Favorite Star Toggle */}
                            <button
                                onClick={(e) => toggleFavorite(e, app.name)}
                                className={`absolute top-6 right-6 z-20 p-2 rounded-full transition-all ${isFavorited ? 'text-yellow-500 scale-110' : 'text-gray-200 opacity-0 group-hover:opacity-100 hover:text-yellow-400'
                                    }`}
                                {...({} as any)} // bypass type strictness for raw svg
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </button>

                            <Link
                                href={hasAccess ? app.url : "#"}
                                onClick={() => hasAccess && trackLaunch(app.name)}
                                className={`block h-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm transition-all duration-300 
                  ${hasAccess ? 'hover:shadow-2xl hover:-translate-y-2 hover:border-blue-100' : 'opacity-70 cursor-not-allowed grayscale'}`}
                            >
                                {/* Icon Container */}
                                <div className={`w-14 h-14 ${app.color} rounded-2xl mb-6 flex items-center justify-center text-3xl text-white shadow-lg relative`}>
                                    {app.icon}
                                    {isFavorited && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <h3 className={`text-2xl font-black tracking-tight ${hasAccess ? 'text-black group-hover:text-blue-600' : 'text-gray-400'}`}>
                                        {app.name}
                                    </h3>

                                    {!app.permission ? (
                                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 uppercase">
                                            Free
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200 uppercase">
                                            Premium
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-500 text-sm mt-4 leading-relaxed font-light">
                                    {hasAccess ? app.description : "This application requires a subscription or special permissions to access."}
                                </p>

                                <div className="mt-8 flex items-center gap-2">
                                    {hasAccess ? (
                                        <div className="text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                            Launch Console →
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0110 0v4" />
                                            </svg>
                                            Locked
                                        </div>
                                    )}
                                </div>
                            </Link>

                            {!hasAccess && (
                                <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-dashed border-zinc-200 flex items-center justify-center bg-zinc-50/5 backdrop-blur-[1px]">
                                    <span className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-2xl">
                                        Upgrade Access
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* EMPTY STATE */}
            {sortedApps.length === 0 && (
                <div className="text-center py-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px]">
                    <div className="text-4xl mb-4">🔦</div>
                    <h3 className="text-xl font-bold text-gray-900">No applications found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filter settings.</p>
                </div>
            )}
        </div>
    );
}