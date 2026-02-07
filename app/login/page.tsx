'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { Form } from 'app/form';
import { SubmitButton } from 'app/submit-button';
import { authenticate } from './actions';

export default function Login() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center bg-[#050505] overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* 1. Deep Space Background Layout */}
      <div className="absolute inset-0 z-0">
        {/* Subtle grid with a fading mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

        {/* Animated Glow Orbs - Dynamic positions */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* 2. Enhanced Branding with "Scan" effect */}
        <div className="flex flex-col items-center mb-10 group cursor-default">
          <div className="relative">
            {/* Outer spinning ring (Optional: requires custom CSS animation) */}
            <div className="absolute -inset-4 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite] [mask-image:linear-gradient(transparent,black)]" />

            <div className="relative w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/20">
              <span className="text-3xl font-black text-white tracking-tighter drop-shadow-md">CH</span>

              {/* Vertical scanning line */}
              <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                <div className="w-full h-[2px] bg-emerald-500/50 blur-[2px] absolute top-0 animate-[scan_3s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-5xl font-black tracking-tightest text-white uppercase leading-none italic select-none">
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

        {/* 3. The "Glass Terminal" Form */}
        <div className="relative group">
          {/* Subtle colored border glow */}
          <div className="absolute -inset-px bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-[3rem] opacity-50" />

          <div className="relative overflow-hidden rounded-[2.9rem] bg-zinc-900/80 backdrop-blur-xl border border-white/5 p-8 shadow-2xl">
            <Form action={dispatch}>
              <div className="space-y-6">
                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl py-3 px-4 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest text-center">
                      Critical Error: {errorMessage}
                    </p>
                  </div>
                )}

                <SubmitButton>Initialize Session</SubmitButton>
              </div>
            </Form>

            {/* Bottom Status Ticker */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                  ))}
                </div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  Encrypted Tunnel: <span className="text-zinc-300">Active</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Infrastructure Footer */}
        <footer className="mt-12 flex flex-col items-center gap-6">
          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link href="#" className="hover:text-emerald-400 transition-colors duration-300">Support</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors duration-300">Registry</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors duration-300">Legal</Link>
          </div>

          <div className="group flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-[9px] font-bold text-zinc-500 tracking-tighter uppercase whitespace-nowrap">
              Master Node: <span className="text-zinc-300">coolhub_NL_01</span> <span className="mx-1 text-zinc-700">|</span> <span className="text-emerald-500/80 italic">v2.0.46-stable</span>
            </span>
          </div>
        </footer>
      </div>

      {/* 5. Custom Scanline Animation (Add to global CSS or tailwind config) */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .tracking-tightest { letter-spacing: -0.08em; }
      `}</style>
    </div>
  );
}