'use client'

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`
        relative w-full py-4 mt-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] 
        transition-all duration-300 overflow-hidden group/btn
        ${pending
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-emerald-500 hover:text-white active:scale-[0.98]'}
      `}
        >
            {/* Background Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {pending ? (
                    <>
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Decrypting...
                    </>
                ) : (
                    children
                )}
            </span>
        </button>
    );
}