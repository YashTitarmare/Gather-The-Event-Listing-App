import EventExplorer from '@/components/EventExplorer';
import { getEvents, upcoming, citiesOf, categoriesOf } from '@/lib/events';

export const revalidate = 600;
export const metadata = {
  title: 'All upcoming events',
  description: 'Search and filter upcoming meetups, workshops, sports and music events by city, category, date and price.',
  alternates: { canonical: '/events' },
};

export default async function EventsPage() {
  const events = upcoming(await getEvents());
  return (
    <div className="wrap sec">
      <h1>All upcoming events</h1>
      <EventExplorer events={events} cities={citiesOf(events)} categories={categoriesOf(events)} />
    </div>
  );
}
