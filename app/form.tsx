'use client';

import { useFormState } from 'react-dom';

export function Form({
  action,
  children,
}: {
  action: any;
  children: React.ReactNode;
}) {
  // state will hold the string returned from your action (e.g., "Invalid username or password")
  const [state, formAction] = useFormState(action, null);

  return (
    <form
      action={formAction}
      className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
    >
      <div>
        <label
          htmlFor="username"
          className="block text-xs text-gray-600 uppercase"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="cooluser"
          autoComplete="username"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs text-gray-600 uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>

      {/* Error Message Display */}
      {state && (
        <p className="text-sm text-red-500 font-medium text-center">
          {state}
        </p>
      )}

      {children}
    </form>
  );
}