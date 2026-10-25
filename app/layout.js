import Link from 'next/link';
import './globals.css';
import { SITE_URL, SITE_NAME } from '@/lib/format';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} – Find events near you`, template: `%s | ${SITE_NAME}` },
  description: 'Discover meetups, workshops, sports, music and more happening in your city, and connect with the organizers.',
  alternates: { canonical: '/' },
  openGraph: { siteName: SITE_NAME, type: 'website' },
  verification: process.env.NEXT_PUBLIC_GSC_TOKEN ? { google: process.env.NEXT_PUBLIC_GSC_TOKEN } : undefined,
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0f1b2d' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="top"><div className="wrap bar">
          <Link href="/" className="logo">{SITE_NAME}</Link>
          <nav aria-label="Main"><Link href="/events">All events</Link><Link href="/events?price=free">Free</Link><Link href="/events?when=week">This week</Link></nav>
        </div></header>
        <main>{children}</main>
        <footer className="foot"><div className="wrap">
          <p>{SITE_NAME} lists events run by independent organizers. We don’t sell tickets or host chat; registration and messaging happen on the organizer’s own links.</p>
          <p><Link href="/events">Browse events</Link> · <Link href="/sitemap.xml">Sitemap</Link></p>
        </div></footer>
      </body>
    </html>
  );
}
