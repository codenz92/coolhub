'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { Form } from 'app/form';
import { SubmitButton } from 'app/submit-button';
import { authenticate } from './actions';

export default function Login() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center bg-[#fafafa] overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-sm px-4 animate-in fade-in zoom-in-95 duration-700">
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 duration-300">
              <span className="text-2xl font-black text-white tracking-tighter">CH</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
              Coolhub
            </h1>
            <div className="flex items-center gap-2 mt-2 justify-center">
              <span className="h-[1px] w-4 bg-gray-200" />
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                Identity Portal
              </p>
              <span className="h-[1px] w-4 bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="group overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white p-1 shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <div className="bg-white rounded-[2.2rem] p-8">
            <Form action={dispatch}>
              <div className="space-y-6">
                {errorMessage && (
                  <div className="bg-red-50 border border-red-100 rounded-xl py-3 px-4 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest text-center">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <SubmitButton>Access Dashboard</SubmitButton>
              </div>
            </Form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Authorized Personnel Only
              </p>
            </div>
          </div>
        </div>

        {/* Refined Footer */}
        <footer className="mt-10 flex flex-col items-center gap-4">
          <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="#" className="hover:text-black transition-colors">Support</Link>
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms</Link>
          </div>
          <div className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            <span className="text-[9px] font-bold text-gray-400 tracking-tighter uppercase">
              Node: <span className="text-emerald-600">Hetzner_DE_01</span> {'//'} v2.0.46
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}