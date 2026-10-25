import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventCard from '@/components/EventCard';
import ShareButtons from '@/components/ShareButtons';
import { getEvents, related, isPast } from '@/lib/events';
import { SITE_URL, fmt, contactLink, slugify } from '@/lib/format';

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}
const find = async (slug) => (await getEvents()).find((e) => e.slug === slug);

export async function generateMetadata({ params }) {
  const e = await find(params.slug);
  if (!e) return { title: 'Event not found', robots: { index: false } };
  const desc = `${fmt(e.start)} · ${e.online ? 'Online' : e.city} · ${e.price}. ${e.description}`.replace(/\s+/g, ' ').slice(0, 155);
  return {
    title: `${e.title} – ${e.online ? 'Online' : e.city}`,
    description: desc,
    alternates: { canonical: `/events/${e.slug}` },
    openGraph: { title: e.title, description: desc, type: 'website', url: `${SITE_URL}/events/${e.slug}`, images: e.image ? [e.image] : undefined },
    twitter: { card: e.image ? 'summary_large_image' : 'summary' },
  };
}

export default async function EventPage({ params }) {
  const all = await getEvents();
  const e = all.find((x) => x.slug === params.slug);
  if (!e) notFound();
  const url = `${SITE_URL}/events/${e.slug}`;
  const contact = contactLink(e);

  const ld = {
    '@context': 'https://schema.org', '@type': 'Event', name: e.title, description: e.description || e.title,
    startDate: e.start, ...(e.end && { endDate: e.end }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: e.online ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    location: e.online
      ? { '@type': 'VirtualLocation', url: e.registration || url }
      : { '@type': 'Place', name: e.venue || e.city, address: { '@type': 'PostalAddress', addressLocality: e.city } },
    ...(e.image && { image: [e.image] }),
    ...(e.organizer && { organizer: { '@type': 'Organization', name: e.organizer } }),
    offers: { '@type': 'Offer', url: e.registration || url, availability: 'https://schema.org/InStock',
      ...(e.free ? { price: '0', priceCurrency: 'INR' } : {}) },
    url,
  };
  const rel = related(e, all);

  return (
    <article className="wrap sec event">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/events">Events</Link> / <Link href={`/category/${slugify(e.category)}`}>{e.category}</Link>
        {e.city && <> / <Link href={`/city/${slugify(e.city)}`}>{e.city}</Link></>}
      </nav>
      <div className="poster">{e.image ? <img src={e.image} alt={`Poster for ${e.title}`} width="1200" height="630" fetchPriority="high" /> : <div className="ph">{e.category}</div>}</div>
      <div className="cols">
        <div>
          <h1>{e.title}</h1>
          {isPast(e) && <p className="notice">This event has ended.</p>}
          {(e.description || '').split(/\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <aside className="side">
          <dl>
            <dt>When</dt><dd>{fmt(e.start)}{e.end && ` – ${fmt(e.end)}`}</dd>
            <dt>Where</dt><dd>{e.online ? 'Online' : [e.venue, e.city].filter(Boolean).join(', ')}{e.online && e.venue ? ` (${e.venue})` : ''}</dd>
            <dt>Price</dt><dd>{e.price}</dd>
            {e.organizer && <><dt>Organizer</dt><dd>{e.organizer}</dd></>}
          </dl>
          {e.registration && !isPast(e) && <a className="btn block" href={e.registration} target="_blank" rel="noopener noreferrer nofollow">Register or book</a>}
          <h2>Connect</h2>
          {contact
            ? <a className="btn ghost block" href={contact} target="_blank" rel="noopener noreferrer">Contact organizer</a>
            : <p className="muted">The organizer hasn’t shared a public contact link for this event.</p>}
          {e.group && <a className="btn ghost block" href={e.group} target="_blank" rel="noopener noreferrer nofollow">Join the community group</a>}
          <p className="muted small">To meet other attendees, use the community group above and share your own contact only if you choose to. We don’t store or show attendee details.</p>
          <h2>Share</h2>
          <ShareButtons url={url} title={e.title} />
        </aside>
      </div>
      {rel.length > 0 && <section className="sec"><h2>Related events</h2><div className="grid">{rel.map((x) => <EventCard key={x.id} e={x} />)}</div></section>}
    </article>
  );
}
