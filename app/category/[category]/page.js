import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventCard from '@/components/EventCard';
import { getEvents, upcoming, citiesOf } from '@/lib/events';
import { slugify, CATEGORIES } from '@/lib/format';

export const revalidate = 600;
export async function generateStaticParams() { return CATEGORIES.map((c) => ({ category: slugify(c) })); }

async function load(slug) {
  const all = await getEvents();
  const name = [...CATEGORIES, ...all.map((e) => e.category)].find((c) => slugify(c) === slug);
  return { name, all, events: upcoming(all).filter((e) => e.category === name) };
}
export async function generateMetadata({ params }) {
  const { name } = await load(params.category);
  if (!name) return { robots: { index: false } };
  return { title: `${name} events`, description: `Upcoming ${name.toLowerCase()} events. Browse by city, see what’s free, and contact organizers.`, alternates: { canonical: `/category/${params.category}` } };
}
export default async function CategoryPage({ params }) {
  const { name, all, events } = await load(params.category);
  if (!name) notFound();
  return (
    <div className="wrap sec">
      <h1>{name} events</h1>
      {events.length ? <div className="grid">{events.map((e) => <EventCard key={e.id} e={e} />)}</div> : <p className="empty">No upcoming {name.toLowerCase()} events right now.</p>}
      <h2>Browse by city</h2>
      <div className="row">{citiesOf(all).map((c) => <Link key={c} className="pill" href={`/city/${slugify(c)}`}>{c}</Link>)}</div>
    </div>
  );
}
