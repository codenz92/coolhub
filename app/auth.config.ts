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
      const isCoolChatRoute = nextUrl.pathname.startsWith('/dashboard/coolchat');

      if (isOnDashboard) {
        if (!isLoggedIn) return false;

        if (isCoolChatRoute) {
          // Check for '1' (Active) or Admin status
          const hasAccess = user?.coolchat === '1' || ["dev", "rio"].includes(user?.username);
          if (!hasAccess) return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;