// app/auth.config.ts
import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  // app/auth.config.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user || !!auth;
      const nextPath = nextUrl.pathname;
      const isOnDashboard = nextPath.startsWith('/dashboard');
      const isOnCoolChat = nextPath.startsWith('/dashboard/coolchat');
      const isOnAdmin = nextPath.startsWith('/admin');

      // 1. If not logged in and trying to access protected areas, redirect to login
      if ((isOnDashboard || isOnAdmin) && !isLoggedIn) {
        return false;
      }

      // 2. SPECIFIC CHECK: CoolChat Permissions
      // This must happen BEFORE 'return true' for the dashboard
      if (isOnCoolChat) {
        const userData = auth?.user as any;
        const username = userData?.username || (auth as any)?.username;
        const coolchatPermission = userData?.coolchat || (auth as any)?.coolchat;

        const isSuperAdmin = ["dev", "rio"].includes(username);
        const hasAccess = coolchatPermission === '1' || isSuperAdmin;

        if (!hasAccess) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }

      // 3. General Dashboard/Admin access (if they got past the specific checks)
      if (isOnDashboard || isOnAdmin) {
        return true;
      }

      // 4. Redirect logged-in users away from login page
      if (isLoggedIn && nextPath === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;