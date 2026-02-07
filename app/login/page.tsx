'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { SubmitButton } from './submit-button';
import { authenticate } from './actions';

export default function Login() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center bg-[#050505] overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Background Layout */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-10 group cursor-default">
          <div className="relative">
            <div className="absolute -inset-4 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite] [mask-image:linear-gradient(transparent,black)]" />
            <div className="relative w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] transition-all duration-500 group-hover:border-emerald-500/50">
              <span className="text-3xl font-black text-white tracking-tighter drop-shadow-md">CH</span>
              <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                <div className="w-full h-[2px] bg-emerald-500/50 blur-[2px] absolute top-0 animate-scan" />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-5xl font-black tracking-[-0.08em] text-white uppercase leading-none italic select-none">
              Coolhub
            </h1>
            <div className="flex items-center gap-3 mt-3 justify-center opacity-60">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-zinc-700" />
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em]">
                Identity Portal
              </p>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-zinc-700" />
            </div>
          </div>
        </div>

        {/* The Glass Terminal Form */}
        <div className="relative group">
          <div className="absolute -inset-px bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-[3rem] opacity-50" />
          <div className="relative overflow-hidden rounded-[2.9rem] bg-zinc-900/80 backdrop-blur-xl border border-white/5 p-1 shadow-2xl">
            <div className="bg-zinc-950/40 rounded-[2.7rem] p-8">
              <form action={dispatch} className="space-y-6">
                <div className="space-y-4">
                  {/* Username Field */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                      User Identity
                    </label>
                    <input
                      name="username"
                      required
                      className="w-full px-5 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder:text-zinc-700 text-sm"
                      placeholder="id_cooluser"
                    />
                  </div>
                  {/* Access Key Field */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                      Access Key
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full px-5 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder:text-zinc-700 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4 animate-in fade-in slide-in-from-top-2 text-center">
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <SubmitButton>Initialize Session</SubmitButton>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  Tunnel Status: <span className="text-zinc-300">Encrypted</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-6">
          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link href="#" className="hover:text-emerald-400 transition-colors">Support</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Registry</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Legal</Link>
          </div>
          <div className="group flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-[9px] font-bold text-zinc-500 tracking-tighter uppercase whitespace-nowrap">
              Master Node: <span className="text-zinc-300">coolhub_NL_01</span> <span className="mx-1 text-zinc-700">|</span> <span className="text-emerald-500/80 italic text-[8px]">v2.0.46-stable</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}