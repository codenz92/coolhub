// app/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { getUser } from 'app/db';
import { authConfig } from 'app/auth.config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ username, password }: any) {
        // getUser now returns the user object directly
        const user = await getUser(username);

        // Check if user exists
        if (!user) return null;

        // Compare password directly from the user object
        const passwordsMatch = await compare(password, user.password!);

        if (passwordsMatch) return user as any;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.username = (user as any).username;
        token.role = (user as any).role;
        token.coolchat = (user as any).coolchat;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
        (session.user as any).coolchat = token.coolchat;
      }
      return session;
    },
  },
});