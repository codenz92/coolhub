import Link from 'next/link';
import { Form } from 'app/form';
import { signIn } from 'app/auth';
import { SubmitButton } from 'app/submit-button';
import { isRedirectError } from 'next/dist/client/components/redirect';

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-4">
      <div className="w-full max-w-[400px] space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground text-gray-500">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <Form
            action={async (prevState: any, formData: FormData) => {
              'use server';
              try {
                await signIn('credentials', {
                  redirectTo: '/dashboard',
                  username: formData.get('username') as string,
                  password: formData.get('password') as string,
                });
              } catch (error) {
                if (isRedirectError(error)) throw error;
                return 'Invalid username or password';
              }
            }}
          >
            <div className="grid gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  placeholder="name@example.com"
                  type="text"
                  required
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                />
              </div>

              <SubmitButton>
                Sign in
              </SubmitButton>
            </div>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link
              href="/register"
              className="font-medium text-black underline underline-offset-4 hover:text-gray-700"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Sub-text footer */}
        <p className="px-8 text-center text-xs text-gray-400 leading-relaxed">
          By clicking continue, you agree to our{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-gray-900">Terms of Service</Link>{' '}
          and{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-gray-900">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}