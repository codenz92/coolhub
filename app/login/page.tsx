import Link from 'next/link';
import { Form } from 'app/form';
import { signIn } from 'app/auth';
import { SubmitButton } from 'app/submit-button';
import { isRedirectError } from 'next/dist/client/components/redirect';

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your username and password to sign in
          </p>
        </div>
        <Form
          action={async (formData: FormData) => {
            'use server';
            try {
              await signIn('credentials', {
                redirectTo: '/protected',
                username: formData.get('username') as string,
                password: formData.get('password') as string,
              });
            } catch (error) {
              // If it's a redirect error, we MUST re-throw it so Next.js can redirect
              if (isRedirectError(error)) {
                throw error;
              }

              // For credential errors, return a string to your Form component
              // Your 'app/form' component should be set up to display this string
              return 'Invalid username or password';
            }
          }}
        >
          <SubmitButton>Sign in</SubmitButton>
        </Form>
      </div>
    </div>
  );
}