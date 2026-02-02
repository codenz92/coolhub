import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      let isOnAdmin = nextUrl.pathname.startsWith('/admin');
      let isOnDemo = nextUrl.pathname.startsWith('/demo-app');

      // Logic for protected routes
      if (isOnDashboard || isOnAdmin || isOnDemo) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
