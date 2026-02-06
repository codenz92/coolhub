'use server';

import { signIn } from 'app/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';

export async function authenticate(prevState: any, formData: FormData) {
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
}