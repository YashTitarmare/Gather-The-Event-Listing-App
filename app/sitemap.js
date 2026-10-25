import { getEvents, citiesOf } from '@/lib/events';
import { SITE_URL, CATEGORIES, slugify } from '@/lib/format';

export const revalidate = 3600;
export default async function sitemap() {
  const events = await getEvents();
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now },
    { url: `${SITE_URL}/events`, lastModified: now },
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/category/${slugify(c)}`, lastModified: now })),
    ...citiesOf(events).map((c) => ({ url: `${SITE_URL}/city/${slugify(c)}`, lastModified: now })),
    ...events.map((e) => ({ url: `${SITE_URL}/events/${e.slug}`, lastModified: new Date(e.start) })),
  ];
}
