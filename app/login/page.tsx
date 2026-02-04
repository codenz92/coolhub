'use client';

import Link from 'next/link';
import { Form } from 'app/form';
import { useFormStatus } from 'react-dom';
import { authenticate } from './actions'; // Import the action here

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded bg-black py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
    >
      {pending ? 'Checking...' : 'Continue'}
    </button>
  );
}

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-[320px]">
        <div className="mb-10 flex flex-col items-start">
          <h1 className="text-lg font-medium text-zinc-950">Sign in</h1>
          <p className="text-sm text-zinc-500">to continue to your dashboard</p>
        </div>

        <div className="space-y-6">
          {/* Pass the imported action to the Form */}
          <Form action={authenticate}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full border-b border-zinc-100 bg-transparent py-1 text-sm outline-none transition-colors focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full border-b border-zinc-100 bg-transparent py-1 text-sm outline-none transition-colors focus:border-black"
                />
              </div>

              <div className="pt-4">
                <SubmitButton />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}