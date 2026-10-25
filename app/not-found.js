import Link from 'next/link';
export const metadata = { title: 'Page not found', robots: { index: false } };
export default function NotFound() {
  return <div className="wrap sec"><h1>We couldn’t find that page</h1><p>The event may have been removed. <Link href="/events">Browse all events</Link>.</p></div>;
}
