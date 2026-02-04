// app/auth.config.ts
import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const user = auth?.user as any;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      // Specifically check for COOLCHAT access
      const isCoolChatRoute = nextUrl.pathname.startsWith('/dashboard/coolchat');

      if (isOnDashboard || isOnAdmin) {
        if (!isLoggedIn) return false;

        // If trying to access CoolChat, check for permission or admin status
        if (isCoolChatRoute) {
          const hasAccess = user?.coolchat === '1' || ["dev", "rio"].includes(user?.username);
          if (!hasAccess) return Response.redirect(new URL('/dashboard', nextUrl));
        }

        return true;
      }

      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;