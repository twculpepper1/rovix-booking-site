
import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Rovix — Adventure Delivered',
  description: 'Book a 2025 Palomino Puma with transparent pricing and easy delivery around Greater Houston.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
