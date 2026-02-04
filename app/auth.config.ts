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
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnDemo = nextUrl.pathname.startsWith('/dashboard/demo-app');
      const isOnCoolChat = nextUrl.pathname.startsWith('/dashboard/coolchat');

      // Fallback: in Middleware, properties might be on auth or auth.user
      const userData = auth?.user as any;
      const username = userData?.username || (auth as any)?.username;
      const coolchatPermission = userData?.coolchat || (auth as any)?.coolchat;

      // 1. Protect routes: If trying to access Dashboard, Admin, or Demo or CoolChat
      if (isOnDashboard || isOnAdmin || isOnDemo || isOnCoolChat) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login
      }

      // 2. Only redirect to dashboard if they are already logged in AND hitting login
      // This prevents the redirect loop when trying to go to /admin
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      if (isOnCoolChat) {
        const isSuperAdmin = ["dev", "rio"].includes(username);
        const hasAccess = coolchatPermission === '1' || isSuperAdmin;

        // If no access, kick back to main dashboard
        if (!hasAccess) return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;