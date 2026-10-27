import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default function robots() {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const base = `${host.startsWith('localhost') ? 'http' : 'https'}://${host}`;
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${base}/sitemap.xml` };
}