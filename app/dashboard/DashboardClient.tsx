'use client'

import { useState } from 'react';
import Link from "next/link";

export default function DashboardClient({ apps, isAdminUser, sessionUser }: any) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // Filtering Logic
    const filteredApps = apps.filter((app: any) => {
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
        const isFree = !app.permission;

        if (filter === "free") return matchesSearch && isFree;
        if (filter === "premium") return matchesSearch && !isFree;
        return matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Search and Filter Section */}
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
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-white text-black shadow-md" : "text-gray-400 hover:text-black"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Found {filteredApps.length} Result{filteredApps.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredApps.map((app: any) => {
                    const hasAccess = !app.permission || isAdminUser || sessionUser?.[app.permission] === '1';

                    return (
                        <div key={app.name} className="relative group">
                            <Link
                                href={hasAccess ? app.url : "#"}
                                className={`block h-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm transition-all duration-300 
                  ${hasAccess ? 'hover:shadow-2xl hover:-translate-y-2 hover:border-blue-100' : 'opacity-70 cursor-not-allowed grayscale'}`}
                            >
                                {/* Icon Container */}
                                <div className={`w-14 h-14 ${app.color} rounded-2xl mb-6 flex items-center justify-center text-3xl text-white shadow-lg`}>
                                    {app.icon}
                                </div>

                                <div className="flex items-center gap-3">
                                    <h3 className={`text-2xl font-black tracking-tight ${hasAccess ? 'text-black group-hover:text-blue-600' : 'text-gray-400'}`}>
                                        {app.name}
                                    </h3>

                                    {/* Badge Logic */}
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

            {filteredApps.length === 0 && (
                <div className="text-center py-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px]">
                    <div className="text-4xl mb-4">🔦</div>
                    <h3 className="text-xl font-bold text-gray-900">No applications found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filter settings.</p>
                </div>
            )}
        </div>
    );
}