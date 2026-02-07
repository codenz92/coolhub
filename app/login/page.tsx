import Link from 'next/link';
import { Form } from 'app/form';
import { SubmitButton } from 'app/submit-button';
import { authenticate } from './actions'; // Import the cleaned-up action

export default function Login() {
  return (
    // Background with a subtle radial dot grid for a technical feel
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">

      <div className="z-10 w-full max-w-sm px-4">
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-2xl">
            🚀
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-black uppercase">
            Coolhub
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-[0.3em]">
            Identity Portal
          </p>
        </div>

        {/* Form Container */}
        <div className="overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <Form action={authenticate}>
            <div className="space-y-5">
              {/* Note: Ensure your Form component renders Username/Password inputs */}
              <SubmitButton>Access Dashboard</SubmitButton>
            </div>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>
        </div>

        {/* Footer info matches the "vibe" of your dashboard count */}
        <footer className="mt-8 flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span className="hover:text-black cursor-help transition-colors">Support</span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-300 italic">SYSTEM v2.0.46</span>
        </footer>
      </div>
    </div>
  );
}