import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GrowNsure — Financial Solutions For A Secure Future',
    template: '%s | GrowNsure',
  },
  description:
    'GrowNsure helps families achieve short-term financial security and long-term wealth creation through mutual funds, insurance, fixed deposits, and personalized investment strategies.',
  keywords: [
    'financial advisor',
    'mutual funds',
    'SIP',
    'term insurance',
    'health insurance',
    'wealth management',
    'investment planning',
    'GrowNsure',
  ],
  authors: [{ name: 'GrowNsure' }],
  openGraph: {
    type: 'website',
    title: 'GrowNsure — Financial Solutions For A Secure Future',
    description:
      'Helping Families Achieve Short-Term Financial Security & Long-Term Wealth Creation',
    siteName: 'GrowNsure',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
