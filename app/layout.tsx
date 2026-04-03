import type {Metadata} from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css'; // Global styles

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TechnoFixer | IT Solutions',
  description: 'Professional IT Solutions for businesses that can\'t afford to slow down.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-inter antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
