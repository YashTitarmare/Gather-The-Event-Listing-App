import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventCard from '@/components/EventCard';
import { getEvents, upcoming, citiesOf } from '@/lib/events';
import { slugify, CATEGORIES } from '@/lib/format';

export const revalidate = 600;
export async function generateStaticParams() { return citiesOf(await getEvents()).map((c) => ({ city: slugify(c) })); }

async function load(slug) {
  const all = await getEvents();
  const name = citiesOf(all).find((c) => slugify(c) === slug);
  return { name, events: upcoming(all).filter((e) => e.city === name) };
}
export async function generateMetadata({ params }) {
  const { name } = await load(params.city);
  if (!name) return { robots: { index: false } };
  return { title: `Events in ${name}`, description: `Upcoming meetups, workshops and activities in ${name}. Find free and paid events and contact organizers.`, alternates: { canonical: `/city/${params.city}` } };
}
export default async function CityPage({ params }) {
  const { name, events } = await load(params.city);
  if (!name) notFound();
  return (
    <div className="wrap sec">
      <h1>Events in {name}</h1>
      {events.length ? <div className="grid">{events.map((e) => <EventCard key={e.id} e={e} />)}</div> : <p className="empty">No upcoming events in {name} right now.</p>}
      <h2>Explore categories</h2>
      <div className="row">{CATEGORIES.map((c) => <Link key={c} className="pill" href={`/category/${slugify(c)}`}>{c}</Link>)}</div>
    </div>
  );
}
