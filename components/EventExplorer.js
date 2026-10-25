'use client';
import { useEffect, useMemo, useState } from 'react';
import EventCard from './EventCard';

const PAGE = 9;
const blank = { q: '', city: '', cat: '', price: '', when: '', sort: 'date' };

export default function EventExplorer({ events, cities, categories }) {
  const [f, setF] = useState(blank);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setF({ ...blank, q: p.get('q') || '', city: p.get('city') || '', cat: p.get('cat') || '', price: p.get('price') || '', when: p.get('when') || '' });
  }, []);

  const set = (k) => (ev) => { setF((x) => ({ ...x, [k]: ev.target.value })); setPage(1); };

  const list = useMemo(() => {
    const limit = { week: 7, month: 30 }[f.when];
    const now = Date.now();
    const q = f.q.toLowerCase();
    const r = events.filter((e) =>
      (!q || `${e.title} ${e.description} ${e.city} ${e.category} ${e.organizer}`.toLowerCase().includes(q)) &&
      (!f.city || e.city === f.city) && (!f.cat || e.category === f.cat) &&
      (!f.price || (f.price === 'free') === e.free) &&
      (!limit || new Date(e.start).getTime() <= now + limit * 864e5));
    return f.sort === 'title' ? [...r].sort((a, b) => a.title.localeCompare(b.title)) : r;
  }, [events, f]);

  return (
    <>
      <div className="filters" role="search">
        <input type="search" placeholder="Search events, topics, organizers" aria-label="Search events" value={f.q} onChange={set('q')} />
        <select aria-label="City" value={f.city} onChange={set('city')}><option value="">All cities</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
        <select aria-label="Category" value={f.cat} onChange={set('cat')}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select aria-label="Price" value={f.price} onChange={set('price')}><option value="">Free and paid</option><option value="free">Free</option><option value="paid">Paid</option></select>
        <select aria-label="Date" value={f.when} onChange={set('when')}><option value="">Any date</option><option value="week">Next 7 days</option><option value="month">Next 30 days</option></select>
        <select aria-label="Sort" value={f.sort} onChange={set('sort')}><option value="date">Soonest first</option><option value="title">Title A–Z</option></select>
      </div>
      <p className="count" aria-live="polite">{list.length} {list.length === 1 ? 'event' : 'events'}</p>
      {list.length === 0 ? (
        <p className="empty">No events match these filters. <button className="link" onClick={() => setF(blank)}>Clear filters</button></p>
      ) : (
        <div className="grid">{list.slice(0, page * PAGE).map((e) => <EventCard key={e.id} e={e} />)}</div>
      )}
      {list.length > page * PAGE && <div className="center"><button className="btn ghost" onClick={() => setPage(page + 1)}>Show more events</button></div>}
    </>
  );
}
