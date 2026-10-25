import { SAMPLE } from './sample';
import { slugify, safeUrl } from './format';

const bool = (v) => String(v).trim().toUpperCase() === 'TRUE';

function normalize(r) {
  const title = String(r.title || '').trim();
  const start = new Date(r.start_datetime);
  if (!title || isNaN(start) || String(r.status).trim().toLowerCase() !== 'published') return null;
  const end = r.end_datetime ? new Date(r.end_datetime) : null;
  const venue = String(r.venue || '').trim();
  const priceRaw = String(r.price ?? '').trim();
  const free = !priceRaw || /^(free|0|0\.0+)$/i.test(priceRaw);
  const id = String(r.id || slugify(title));
  return {
    id,
    slug: slugify(r.slug) || `${slugify(title)}-${slugify(id)}`,
    title, venue,
    description: String(r.description || '').trim(),
    category: String(r.category || 'Social').trim(),
    city: String(r.city || '').trim(),
    start: start.toISOString(),
    end: end && !isNaN(end) ? end.toISOString() : '',
    image: safeUrl(r.image_url),
    free, price: free ? 'Free' : priceRaw,
    organizer: String(r.organizer_name || '').trim(),
    registration: safeUrl(r.registration_url),
    // Contact link is only used if the organizer opted in (also enforced in Apps Script).
    contact: bool(r.contact_public) ? safeUrl(r.contact_url) : '',
    group: safeUrl(r.group_url),
    online: /^online/i.test(venue) || /^online$/i.test(String(r.city || '')),
  };
}

export async function getEvents() {
  let rows = SAMPLE;
  const base = process.env.APPS_SCRIPT_URL;
  if (base) {
    try {
      const u = new URL(base);
      if (process.env.APPS_SCRIPT_TOKEN) u.searchParams.set('token', process.env.APPS_SCRIPT_TOKEN);
      const res = await fetch(u, { next: { revalidate: 600 } });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      rows = json.events || [];
    } catch (err) {
      console.error('Could not load events from Apps Script:', err.message);
      rows = [];
    }
  }
  return rows.map(normalize).filter(Boolean).sort((a, b) => a.start.localeCompare(b.start));
}

const endOf = (e) => new Date(e.end || new Date(e.start).getTime() + 3 * 36e5).getTime();
export const upcoming = (events) => events.filter((e) => endOf(e) >= Date.now());
export const isPast = (e) => endOf(e) < Date.now();
export const citiesOf = (events) => [...new Set(events.map((e) => e.city).filter(Boolean))].sort();
export const categoriesOf = (events) => [...new Set([...events.map((e) => e.category)])].sort();
export const related = (e, all) => upcoming(all).filter((x) => x.id !== e.id && (x.category === e.category || x.city === e.city)).slice(0, 3);
