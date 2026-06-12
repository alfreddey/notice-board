import type {Metadata} from 'next';
import { Kalam } from 'next/font/google';
import './globals.css';

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-kalam',
});

export const metadata: Metadata = {
  title: 'SVG Doodle Board',
  description: 'Hand-drawn UI using pure SVGs.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={kalam.variable}>
      <body className="font-kalam font-medium" suppressHydrationWarning>{children}</body>
    </html>
  );
}
