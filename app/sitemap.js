import { headers } from 'next/headers';
import { getEvents, citiesOf } from '@/lib/events';
import { CATEGORIES, slugify } from '@/lib/format';
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const base = `${host.startsWith('localhost') ? 'http' : 'https'}://${host}`;
  const events = await getEvents();
  const now = new Date();
  return [
    { url: base, lastModified: now },
    { url: `${base}/events`, lastModified: now },
    ...CATEGORIES.map((c) => ({ url: `${base}/category/${slugify(c)}`, lastModified: now })),
    ...citiesOf(events).map((c) => ({ url: `${base}/city/${slugify(c)}`, lastModified: now })),
    ...events.map((e) => ({ url: `${base}/events/${e.slug}`, lastModified: new Date(e.start) })),
  ];
}