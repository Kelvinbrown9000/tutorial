import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { brand } from '@/content/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://www.guardiantrustfederal.org'),
  title: {
    template: `%s | ${brand.name}`,
    default: `${brand.name} — Banking Built on Trust`,
  },
  description:
    'Guardian Trust Federal Credit Union is a member-owned, not-for-profit financial institution offering checking, savings, loans, credit cards, and digital banking services.',
  keywords: ['credit union', 'guardian trust', 'federal credit union', 'checking accounts', 'savings accounts', 'auto loans', 'mortgage', 'credit cards', 'mobile banking'],
  openGraph: { type: 'website', siteName: brand.name, locale: 'en_US' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col bg-white text-[#18181b]">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
