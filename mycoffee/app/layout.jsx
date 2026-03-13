import './home.css';
import ClientProviders from './components/ClientProviders';

export const metadata = { title: 'Starbucks' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}