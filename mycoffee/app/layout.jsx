import './home.css';
import './responsive.css';
import ClientProviders from './components/ClientProviders';

export const metadata = { title: 'Starbucks' };

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}