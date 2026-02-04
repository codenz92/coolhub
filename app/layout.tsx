import './globals.css';

import { GeistSans } from 'geist/font/sans';
import { Providers } from './providers'; // Import the new providers component

let title = 'CoolHub - Dashboard';
let description =
  'This is one of the biggest secrets ever.';

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
      <Providers>{children}</Providers>
    </html>
  );
}
