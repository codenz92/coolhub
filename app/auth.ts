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
        
	if (username === 'admin' && password === '123') {
          return {
            id: 'admin-id',
            username: 'admin',
            email: 'admin@vercel-app.com',
            role: 'admin', // This helps identify them in your admin page
          };
        }

	let user = await getUser(username);
        if (user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0].password!);

        // Ensure the object returned here contains the username
        if (passwordsMatch) return user[0] as any;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      // 'user' is the object returned from authorize() above
      if (user) {
        token.username = (user as any).username;
        token.role = (user as any).role;
        token.coolchat = (user as any).coolchat;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Assign the username from the token to the session
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
        (session.user as any).coolchat = token.coolchat;
      }
      return session;
    },
  },
});
