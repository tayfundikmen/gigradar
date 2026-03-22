export default async function handler(req, res) {
  const { keyword } = req.query;
  const apiKey = process.env.VITE_TICKETMASTER_API_KEY;

  if (!keyword) {
    return res.status(400).json({ error: 'keyword required' });
  }

  const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${encodeURIComponent(keyword)}&classificationName=music&size=8&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const attractions = data._embedded?.attractions || [];

    const results = attractions.map(a => ({
      id: a.id,
      name: a.name,
      genre: a.classifications?.[0]?.genre?.name || 'Music',
      subGenre: a.classifications?.[0]?.subGenre?.name || '',
      imageUrl: a.images?.find(img => img.ratio === '16_9' && img.width > 300)?.url || '',
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
