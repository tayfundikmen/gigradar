export default async function handler(req, res) {
  const { keyword } = req.query;
  const apiKey = process.env.VITE_TICKETMASTER_API_KEY;
  
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(keyword)}&countryCode=GB&classificationName=music&size=5&sort=date,asc&apikey=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}
