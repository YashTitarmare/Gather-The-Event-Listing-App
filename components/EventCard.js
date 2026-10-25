import Link from 'next/link';
import { fmt } from '@/lib/format';

export default function EventCard({ e }) {
  const href = `/events/${e.slug}`;
  return (
    <article className="card">
      <Link href={href} className="thumb" tabIndex={-1} aria-hidden="true">
{(e.image_url || e.image) ? (
  <img
    src={e.image_url || e.image}
    alt={e.title}
    loading="lazy"
    width="640"
    height="360"
  />
) : (
  <div className="ph">{e.category}</div>
)}      </Link>
      <div className="cbody">
        <div className="chips"><span className="chip">{e.category}</span><span className={`chip ${e.free ? 'free' : ''}`}>{e.price}</span></div>
        <h3><Link href={href}>{e.title}</Link></h3>
        <p className="when">{fmt(e.start)}</p>
        <p className="where">{e.online ? 'Online' : [e.venue, e.city].filter(Boolean).join(', ')}</p>
        <Link className="btn sm" href={href}>View details</Link>
      </div>
    </article>
  );
}
