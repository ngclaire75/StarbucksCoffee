import './home.css';

export const metadata = { title: 'Starbucks' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}