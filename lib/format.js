// Client-safe helpers (no server-only imports).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Gather';
export const TZ = process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Kolkata';
export const CATEGORIES = ['Technology', 'Business', 'Networking', 'Workshops', 'Sports', 'Music', 'Social'];

export const slugify = (s) => String(s || '').toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const fmt = (iso, withTime = true) => new Intl.DateTimeFormat('en-IN', {
  timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short',
  ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
}).format(new Date(iso));

// Only https and mailto links are ever rendered.
export function safeUrl(u) {
  try {
    const x = new URL(String(u || '').trim());
    return ['https:', 'mailto:'].includes(x.protocol) ? x.toString() : '';
  } catch { return ''; }
}

// Organizer contact link with a prefilled message. Empty unless the organizer opted in.
export function contactLink(e) {
  if (!e.contact) return '';
  const msg = `Hi! I'm interested in attending "${e.title}" on ${fmt(e.start)}. Could you share more details?`;
  if (e.contact.startsWith('mailto:')) {
    return `${e.contact.split('?')[0]}?subject=${encodeURIComponent('Question about ' + e.title)}&body=${encodeURIComponent(msg)}`;
  }
  try {
    const u = new URL(e.contact);
    if (/(^|\.)wa\.me$|whatsapp\.com$/.test(u.hostname) && !u.pathname.startsWith('/c')) u.searchParams.set('text', msg);
    return u.toString();
  } catch { return ''; }
}
