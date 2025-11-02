/**
 * TRON ULTIMATE AI PLATFORM - ROOT LAYOUT
 * Pure class Next.js layout with Tron aesthetics
 * Black background, red accents, professional design
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Getron - Ultimate AI Platform',
  description: 'Pure class AI agent platform with 8 specialized Gemini models',
  keywords: ['AI', 'Gemini', 'TRON', 'Machine Learning', 'Artificial Intelligence'],
  authors: [{ name: 'TRON AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <div className="min-h-screen bg-black">
          {children}
        </div>
      </body>
    </html>
  );
}