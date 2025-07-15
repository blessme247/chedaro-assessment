import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import MirageProvider from '@/lib/auth';
import { UserProvider } from '@/hooks/useUser';

export const metadata: Metadata = {
  title: 'Chedaro - Frontend Assessment ',
  description: 'Built with with Next.js'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <UserProvider>
        <MirageProvider>
        <SWRConfig
        >
          {children}
        </SWRConfig>
        </MirageProvider>
        </UserProvider>
      </body>
    </html>
  );
}
