import { getEvents, citiesOf } from '@/lib/events';
import { CATEGORIES, slugify } from '@/lib/format';

const base = 'https://gather-the-event-listing-app.vercel.app/';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
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