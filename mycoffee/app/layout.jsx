import { Inter, Dancing_Script } from 'next/font/google';
import './home.css';
import './responsive.css';
import ClientProviders from './components/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-dancing',
  display: 'swap',
});

export const metadata = { title: 'Starbucks' };

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${dancing.variable}`}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}