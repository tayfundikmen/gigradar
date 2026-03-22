export default async function handler(req, res) {
  const { attractionId, city } = req.query;
  const apiKey = process.env.VITE_TICKETMASTER_API_KEY;

  if (!attractionId && !city) {
    return res.status(400).json({ error: 'attractionId or city required' });
  }

  let url;
  if (attractionId) {
    url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${attractionId}&countryCode=GB&classificationName=music&size=10&sort=date,asc&apikey=${apiKey}`;
  } else {
    url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(city)}&countryCode=GB&classificationName=music&size=20&sort=date,asc&apikey=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    const events = data._embedded?.events || [];

    const results = events.map(ev => ({
      id: ev.id,
      name: ev.name,
      date: ev.dates?.start?.localDate || 'TBA',
      time: ev.dates?.start?.localTime || '',
      venue: ev._embedded?.venues?.[0]?.name || 'TBA',
      city: ev._embedded?.venues?.[0]?.city?.name || 'UK',
      status: (() => {
  const now = new Date();
  const saleStart = ev.sales?.public?.startDateTime ? new Date(ev.sales.public.startDateTime) : null;
  const saleEnd = ev.sales?.public?.endDateTime ? new Date(ev.sales.public.endDateTime) : null;
  const code = ev.dates?.status?.code;
  if (code === 'cancelled' || code === 'postponed') return 'announced';
  if (saleStart && saleStart > now) return 'soon';
  if (saleStart && saleStart <= now && (!saleEnd || saleEnd > now)) return 'on-sale';
  return 'announced';
})(),
      onSaleDate: ev.sales?.public?.startDateTime
        ? new Date(ev.sales.public.startDateTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        : 'TBA',
      ticketUrl: ev.url || '#',
      attractions: ev._embedded?.attractions?.map(a => a.name) || [],
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
