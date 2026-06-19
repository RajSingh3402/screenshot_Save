import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SiteWatch – Website Monitoring Portal',
  description: 'Real-life SiteWatch website screenshot monitoring portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
