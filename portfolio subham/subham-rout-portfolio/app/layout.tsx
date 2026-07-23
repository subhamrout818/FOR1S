import type { Metadata } from 'next';
import { Syne, Instrument_Serif, Space_Mono } from 'next/font/google';
import './globals.css';
import Cursor from '@/components/layout/Cursor';
import ProgressBar from '@/components/layout/ProgressBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Subham Rout — Cinema Editor & Visual Storyteller',
  description:
    'Award-winning cinematic video editor specializing in emotional storytelling, anime edits, automotive films, and high-energy productions.',
  keywords: [
    'video editor',
    'cinematic',
    'anime editor',
    'automotive films',
    'visual storyteller',
  ],
  authors: [{ name: 'Subham Rout' }],
  openGraph: {
    title: 'Subham Rout — Cinema Editor & Visual Storyteller',
    description: 'Award-winning cinematic video editor specializing in emotional storytelling',
    type: 'website',
    url: 'https://subham-rout.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subham Rout — Cinema Editor & Visual Storyteller',
    description: 'Award-winning cinematic video editor',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${instrumentSerif.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050505" />
      </head>
      <body>
        <ProgressBar />
        <Cursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
