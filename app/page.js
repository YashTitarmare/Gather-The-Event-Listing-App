import Link from 'next/link';
import EventCard from '@/components/EventCard';
import { getEvents, upcoming, citiesOf } from '@/lib/events';
import { CATEGORIES, slugify } from '@/lib/format';

export const revalidate = 600;

export default async function Home() {
  const events = upcoming(await getEvents());
  const cities = citiesOf(events);
  return (
    <>
      <section className="hero"><div className="wrap">
        <h1>Find something to do, then find your people.</h1>
        <form action="/events" method="get" className="bigsearch" role="search">
          <input name="q" type="search" placeholder="Search events, e.g. photography, startup, yoga" aria-label="Search events" />
          <select name="city" aria-label="City"><option value="">Any city</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
          <button className="btn" type="submit">Search events</button>
        </form>
        <div className="row quick">
          <Link className="pill" href="/events?price=free">Free events</Link>
          <Link className="pill" href="/events?price=paid">Paid events</Link>
          <Link className="pill" href="/events?when=week">Next 7 days</Link>
          <Link className="pill" href="/events?when=month">Next 30 days</Link>
        </div>
      </div></section>

      <section className="wrap sec">
        <div className="head"><h2>Upcoming events</h2><Link href="/events" className="btn ghost sm">Explore all events</Link></div>
        
        {events.length ? <div className="grid">{events.slice(0, 6).map((e) => <EventCard key={e.id} e={e} />)}</div>
        
          : <p className="empty">No upcoming events yet. Add a row with status “published” in the Google Sheet.</p>}
      </section>

      <section className="wrap sec">
        <h2>Browse by category</h2>
        <div className="row">{CATEGORIES.map((c) => <Link key={c} className="pill big" href={`/category/${slugify(c)}`}>{c}</Link>)}</div>
      </section>

      {cities.length > 0 && <section className="wrap sec">
        <h2>Events by city</h2>
        <div className="row">{cities.map((c) => <Link key={c} className="pill big" href={`/city/${slugify(c)}`}>{c}</Link>)}</div>
      </section>}

      <section className="wrap sec"><div className="panel">
        <h2>Meet the people behind the events</h2>
        <p>Every event page has a Contact organizer button and, where the organizer provides one, a link to their WhatsApp or community group. Organizers run events? Add a row to the sheet and set contact_public to TRUE to opt in.</p>
      </div></section>
    </>
  );
}
