'use client';

import Link from 'next/link';
import { Form } from 'app/form';
import { useFormStatus } from 'react-dom';
import { authenticate } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="relative flex w-full items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-50 transition-all hover:bg-zinc-800 disabled:opacity-50"
    >
      <span className={pending ? 'text-transparent' : 'opacity-100'}>Continue</span>
      {pending && (
        <span className="absolute flex items-center justify-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-zinc-50" />
        </span>
      )}
    </button>
  );
}

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] selection:bg-zinc-200">
      <div className="w-full max-w-[380px] px-8">
        {/* Top Branding / Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
          <span className="text-zinc-900">Auth</span>
          <span>/</span>
          <span>Login</span>
        </nav>

        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_24px_rgba(0,0,0,0.05)]">
          <header className="mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Welcome back
            </h1>
          </header>

          <Form action={authenticate}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-xs font-medium text-zinc-500"
                >
                  Email or Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:ring-[3px] focus:ring-zinc-100"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-zinc-500"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:ring-[3px] focus:ring-zinc-100"
                />
              </div>

              <div className="pt-2">
                <SubmitButton />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}