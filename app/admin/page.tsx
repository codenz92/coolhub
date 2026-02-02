import Link from 'next/link';
import { Form } from 'app/form';
import { redirect } from 'next/navigation';
import { createUser, getUser } from 'app/db';
import { SubmitButton } from 'app/submit-button';

export default function Login() {
    async function register(formData: FormData) {
        'use server';
        let username = formData.get('username') as string;
        let password = formData.get('password') as string;
        let user = await getUser(username);

        if (user.length > 0) {
            return 'User already exists'; // TODO: Handle errors with useFormStatus
        } else {
            await createUser(username, password);
        }
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                    <h3 className="text-xl font-semibold">Sign Up</h3>
                    <p className="text-sm text-gray-500">
                        Create an account with your username and password
                    </p>
                </div>
                <Form action={register}>
                    <SubmitButton>Sign Up</SubmitButton>
                    <p className="text-center text-sm text-gray-600">
                        {'Go back to dashboard'}
                        <Link href="/dashboard" className="font-semibold text-gray-800">
                            Dashboard
                        </Link>
                        {' instead.'}
                    </p>
                </Form>
            </div>
        </div>
    );
}