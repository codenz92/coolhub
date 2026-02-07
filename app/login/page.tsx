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
          <h3 className="text-xl font-semibold">COOLHUB</h3>
        </div>
        <Form
          // Added prevState as the first argument to match useFormState
          action={async (prevState: any, formData: FormData) => {
            'use server';
            try {
              await signIn('credentials', {
                redirectTo: '/dashboard',
                username: formData.get('username') as string,
                password: formData.get('password') as string,
              });
            } catch (error) {
              if (isRedirectError(error)) {
                throw error;
              }

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
