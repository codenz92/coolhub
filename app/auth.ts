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
        let user = await getUser(username);
        if (user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0].password!);

        if (passwordsMatch) return user[0] as any;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.username = (user as any).username;
        token.role = (user as any).role;
        // NEW: Pass the permission flag to the token
        token.coolchat = (user as any).coolchat;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
        // NEW: Pass the permission flag to the session
        (session.user as any).coolchat = token.coolchat;
      }
      return session;
    },
  },
});