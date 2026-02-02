import './globals.css';

import { GeistSans } from 'geist/font/sans';

let title = 'CoolHub - Dashboard';
let description =
  'This is a full stack website built with Next.js, PostgreSQL, and NextAuth.js for authentication.';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://nextjs-postgres-auth.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.variable}>{children}</body>
    </html>
  );
}
