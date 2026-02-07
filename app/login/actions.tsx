'use server';

import { signIn } from 'app/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';

// Explicitly define the return type for the state to avoid build errors
export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', {
            redirectTo: '/dashboard',
            username: formData.get('username') as string,
            password: formData.get('password') as string,
        });
    } catch (error) {
        // Next.js uses redirect errors for successful navigation
        if (isRedirectError(error)) throw error;

        return 'Invalid username or password';
    }
}