import { Readex_Pro, Open_Sans, Arvo, Geist_Mono } from 'next/font/google';

// Heading font
export const readexPro = Readex_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-heading',
  display: 'swap',
});

// Body font (Sans Serif)
export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

// Serif font
export const arvo = Arvo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap',
});

// Monospace font
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});
