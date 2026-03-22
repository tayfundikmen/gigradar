import { useState, useEffect, useCallback } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #111118; --card: #16161f; --card2: #1c1c28;
    --border: #2a2a3a; --accent: #e8ff47; --accent2: #ff4778; --accent3: #47d4ff;
    --text: #e8e8f0; --muted: #6b6b80;
    --font-display: 'Bebas Neue', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
  }
  .onboard-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .onboard-box { width: 100%; max-width: 580px; }
  .ob-logo-tag { font-size: 11px; letter-spacing: 4px; color: var(--accent); text-transform: uppercase; font-weight: 500; margin-bottom: 8px; }
  .ob-logo { font-family: var(--font-display); font-size: clamp(52px, 10vw, 80px); line-height: 1; letter-spacing: 2px; margin-bottom: 40px; }
  .ob-logo span { color: var(--accent); }
  .ob-step-indicator { display: flex; gap: 6px; margin-bottom: 32px; }
  .ob-step-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); transition: all 0.3s; }
  .ob-step-dot.active { background: var(--accent); width: 24px; border-radius: 3px; }
  .ob-step-dot.done { background: var(--accent); opacity: 0.4; }
  .ob-title { font-family: var(--font-display); font-size: 32px; letter-spacing: 1px; margin-bottom: 8px; }
  .ob-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
  .ob-search-row { display: flex; gap: 10px; margin-bottom: 16px; }
  .ob-input {
    flex: 1; background: var(--card); border: 1px solid var(--border); border-radius: 6px;
    padding: 13px 16px; color: var(--text); font-family: var(--font-body); font-size: 14px; outline: none; transition: border-color 0.2s;
  }
  .ob-input:focus { border-color: var(--accent); }
  .ob-input::placeholder { color: var(--muted); }
  .ob-btn {
    padding: 13px 20px; background: var(--accent); border: none; border-radius: 6px;
    color: #000; font-family: var(--font-body); font-weight: 600; font-size: 14px; cursor: pointer; white-space: nowrap; transition: opacity 0.2s;
  }
  .ob-btn:hover { opacity: 0.88; }
  .ob-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ob-btn-outline {
    padding: 13px 20px; background: none; border: 1px solid var(--border); border-radius: 6px;
    color: var(--text); font-family: var(--font-body); font-weight: 500; font-size: 14px; cursor: pointer; transition: border-color 0.2s;
  }
  .ob-btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .search-results { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; max-height: 280px; overflow-y: auto; }
  .search-result-item {
    display: flex; align-items: center; gap: 14px; padding: 12px 16px;
    background: var(--card); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.2s;
  }
  .search-result-item:hover { border-color: var(--accent); background: var(--card2); }
  .search-result-item.selected { border-color: var(--accent); background: rgba(232,255,71,0.05); }
  .result-img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; background: var(--border); flex-shrink: 0; }
  .result-img-placeholder { width: 44px; height: 44px; border-radius: 4px; background: var(--border); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .result-info { flex: 1; overflow: hidden; }
  .result-name { font-size: 15px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .result-genre { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .result-check { color: var(--accent); font-size: 18px; }
  .selected-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; min-height: 36px; }
  .selected-chip {
    display: flex; align-items: center; gap: 8px; padding: 6px 12px;
    background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.3); border-radius: 20px; font-size: 13px; color: var(--accent);
    animation: popIn 0.2s ease;
  }
  @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .chip-remove { background: none; border: none; color: inherit; cursor: pointer; font-size: 16px; line-height: 1; padding: 0; opacity: 0.6; }
  .chip-remove:hover { opacity: 1; }
  .ob-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; align-items: center; }
  .city-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .city-chip {
    display: flex; align-items: center; gap: 8px; padding: 8px 16px;
    background: rgba(71,212,255,0.08); border: 1px solid rgba(71,212,255,0.3); border-radius: 20px; font-size: 13px; color: var(--accent3);
    animation: popIn 0.2s ease;
  }
  .skip-btn { background: none; border: none; color: var(--muted); font-size: 13px; cursor: pointer; text-decoration: underline; }
  .skip-btn:hover { color: var(--text); }
  .app { max-width: 960px; margin: 0 auto; padding: 0 24px 80px; }
  .header { display: flex; align-items: flex-end; justify-content: space-between; padding: 40px 0 28px; border-bottom: 1px solid var(--border); margin-bottom: 36px; }
  .logo-tag { font-size: 11px; letter-spacing: 4px; color: var(--accent); text-transform: uppercase; font-weight: 500; }
  .logo-title { font-family: var(--font-display); font-size: clamp(38px, 6vw, 64px); line-height: 1; letter-spacing: 2px; }
  .logo-title span { color: var(--accent); }
  .header-right { text-align: right; }
  .header-update { font-size: 12px; color: var(--muted); }
  .btn-reset { font-size: 12px; color: var(--muted); background: none; border: none; cursor: pointer; text-decoration: underline; margin-top: 4px; display: block; }
  .btn-reset:hover { color: var(--accent2); }
  .tabs { display: flex; gap: 2px; margin-bottom: 32px; border-bottom: 1px solid var(--border); overflow-x: auto; }
  .tab { font-family: var(--font-display); font-size: 20px; letter-spacing: 1px; padding: 12px 24px 14px; background: none; border: none; color: var(--muted); cursor: pointer; position: relative; transition: color 0.2s; white-space: nowrap; }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); }
  .tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--accent); }
  .tab-count { font-family: var(--font-body); font-size: 11px; background: var(--border); color: var(--muted); padding: 2px 7px; border-radius: 20px; margin-left: 6px; vertical-align: middle; font-weight: 500; }
  .tab.active .tab-count { background: var(--accent); color: #000; }
  .toolbar { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .search-wrap { flex: 1; min-width: 180px; position: relative; }
  .search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 14px; pointer-events: none; }
  .search-input { width: 100%; background: var(--card); border: 1px solid var(--border); border-radius: 4px; padding: 10px 14px 10px 36px; color: var(--text); font-family: var(--font-body); font-size: 14px; outline: none; }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--muted); }
  .btn-refresh { padding: 10px 18px; background: var(--accent); border: none; border-radius: 4px; color: #000; font-family: var(--font-body); font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity 0.2s; }
  .btn-refresh:hover { opacity: 0.88; }
  .btn-refresh:disabled { opacity: 0.4; cursor: not-allowed; }
  .spin { animation: spin 1s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .concerts-grid { display: flex; flex-direction: column; gap: 2px; }
  .concert-card { background: var(--card); border: 1px solid var(--border); border-radius: 4px; padding: 18px 22px; display: grid; grid-template-columns: 64px 1fr auto; gap: 18px; align-items: center; transition: border-color 0.15s, transform 0.15s; animation: fadeIn 0.3s ease both; }
  .concert-card:hover { border-color: #3a3a4a; transform: translateX(3px); }
  .concert-card.on-sale { border-left: 3px solid var(--accent2); }
  .concert-card.soon { border-left: 3px solid var(--accent); }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .card-date { text-align: center; }
  .date-day { font-family: var(--font-display); font-size: 32px; color: var(--text); line-height: 1; }
  .date-month { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
  .date-year { font-size: 10px; color: var(--muted); }
  .card-info { overflow: hidden; }
  .card-artist { font-family: var(--font-display); font-size: 20px; letter-spacing: 0.5px; color: var(--text); line-height: 1; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-event { font-size: 12px; color: var(--muted); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-meta { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .meta-tag { font-size: 11px; color: var(--muted); }
  .card-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
  .ticket-status { font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; }
  .status-on-sale { background: rgba(255,71,120,0.15); color: var(--accent2); }
  .status-soon { background: rgba(232,255,71,0.1); color: var(--accent); }
  .status-announced { background: rgba(255,255,255,0.05); color: var(--muted); }
  .btn-tickets { font-size: 11px; padding: 5px 12px; background: none; border: 1px solid var(--border); border-radius: 3px; color: var(--text); cursor: pointer; font-family: var(--font-body); text-decoration: none; transition: all 0.2s; }
  .btn-tickets:hover { border-color: var(--accent); color: var(--accent); }
  .city-filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; align-items: center; }
  .city-filter-btn { padding: 8px 16px; background: var(--card); border: 1px solid var(--border); border-radius: 20px; color: var(--muted); font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .city-filter-btn:hover, .city-filter-btn.active { border-color: var(--accent3); color: var(--accent3); background: rgba(71,212,255,0.05); }
  .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.3; }
  .empty h3 { font-family: var(--font-display); font-size: 24px; color: var(--text); margin-bottom: 6px; }
  .empty p { font-size: 13px; line-height: 1.6; }
  .loading-row { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 40px; color: var(--muted); font-size: 14px; }
  .error-bar { background: rgba(255,71,120,0.1); border: 1px solid rgba(255,71,120,0.3); border-radius: 4px; padding: 12px 16px; font-size: 13px; color: var(--accent2); margin-bottom: 20px; }
  @media (max-width: 600px) {
    .concert-card { grid-template-columns: 52px 1fr; }
    .card-actions { display: none; }
    .header { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
`;

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === 'TBA') return null;
  const d = new Date(dateStr);
  return { day: d.getDate().toString().padStart(2, '0'), month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(), year: d.getFullYear() };
};

const StatusBadge = ({ status, onSaleDate }) => {
  if (status === 'on-sale') return <span className="ticket-status status-on-sale">● On Sale</span>;
  if (status === 'soon') return <span className="ticket-status status-soon">⏰ {onSaleDate}</span>;
  return <span className="ticket-status status-announced">Announced</span>;
};

const ConcertCard = ({ concert, index, artistName }) => {
  const d = formatDate(concert.date);
  const displayName = artistName || concert.attractions?.[0] || concert.name;
  return (
    <div className={`concert-card ${concert.status}`} style={{ animationDelay: `${index * 35}ms` }}>
      <div className="card-date">
        {d ? (<><div className="date-day">{d.day}</div><div className="date-month">{d.month}</div><div className="date-year">{d.year}</div></>) : <div style={{ fontSize: 12, color: 'var(--muted)' }}>TBA</div>}
      </div>
      <div className="card-info">
        <div className="card-artist">{displayName}</div>
        <div className="card-event">{concert.name}</div>
        <div className="card-meta">
          <span className="meta-tag">📍 {concert.venue}, {concert.city}</span>
          {concert.time && <span className="meta-tag">🕐 {concert.time.slice(0,5)}</span>}
        </div>
      </div>
      <div className="card-actions">
        <StatusBadge status={concert.status} onSaleDate={concert.onSaleDate} />
        <a href={concert.ticketUrl} target="_blank" rel="noreferrer" className="btn-tickets">Bilet Al →</a>
      </div>
    </div>
  );
};

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [wantsCities, setWantsCities] = useState(null);

  const searchArtists = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/search-artists?keyword=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (e) { console.error(e); }
    setSearching(false);
  }, [query]);

  const toggleArtist = (artist) => {
    setSelectedArtists(prev => prev.find(a => a.id === artist.id) ? prev.filter(a => a.id !== artist.id) : [...prev, artist]);
  };

  const addCity = () => {
    const c = cityInput.trim();
    if (!c || cities.includes(c)) return;
    setCities([...cities, c]);
    setCityInput('');
  };

  const finish = () => onComplete({ artists: selectedArtists, cities });

  return (
    <div className="onboard-wrap">
      <div className="onboard-box">
        <div className="ob-logo-tag">UK Concert Tracker</div>
        <div className="ob-logo">GIG<span>RADAR</span></div>
        <div className="ob-step-indicator">
          {[0,1].map(i => <div key={i} className={`ob-step-dot ${i===step?'active':i<step?'done':''}`} />)}
        </div>

        {step === 0 && (
          <>
            <div className="ob-title">Takip etmek istediğin sanatçılar?</div>
            <div className="ob-sub">Arama yaparak sanatçı ekle. UK'deki konserlerini takip edeceğiz.</div>
            <div className="ob-search-row">
              <input className="ob-input" placeholder="Sanatçı ara... (örn. Radiohead)" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchArtists()} />
              <button className="ob-btn" onClick={searchArtists} disabled={searching || !query.trim()}>{searching ? '...' : 'Ara'}</button>
            </div>
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(artist => {
                  const isSelected = selectedArtists.find(a => a.id === artist.id);
                  return (
                    <div key={artist.id} className={`search-result-item ${isSelected ? 'selected' : ''}`} onClick={() => toggleArtist(artist)}>
                      {artist.imageUrl ? <img src={artist.imageUrl} alt={artist.name} className="result-img" /> : <div className="result-img-placeholder">🎸</div>}
                      <div className="result-info">
                        <div className="result-name">{artist.name}</div>
                        <div className="result-genre">{artist.genre}{artist.subGenre && artist.subGenre !== artist.genre ? ` · ${artist.subGenre}` : ''}</div>
                      </div>
                      {isSelected && <span className="result-check">✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
            {selectedArtists.length > 0 && (
              <div className="selected-list">
                {selectedArtists.map(a => (
                  <div key={a.id} className="selected-chip">{a.name}<button className="chip-remove" onClick={() => toggleArtist(a)}>×</button></div>
                ))}
              </div>
            )}
            <div className="ob-actions">
              {selectedArtists.length === 0 && <button className="skip-btn" onClick={() => setStep(1)}>Şimdilik geç</button>}
              <button className="ob-btn" onClick={() => setStep(1)} disabled={selectedArtists.length === 0}>Devam Et →</button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="ob-title">Lokasyon bazlı konserler?</div>
            <div className="ob-sub">Belirli şehirlerdeki tüm müzik etkinliklerini de görmek ister misin?</div>
            {wantsCities === null && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
                <button className="ob-btn" onClick={() => setWantsCities(true)}>Evet, eklemek istiyorum</button>
                <button className="ob-btn-outline" onClick={finish}>Hayır, yeterli</button>
              </div>
            )}
            {wantsCities && (
              <>
                <div className="ob-search-row">
                  <input className="ob-input" placeholder="Şehir ekle... (örn. London, Liverpool)" value={cityInput} onChange={e => setCityInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCity()} />
                  <button className="ob-btn" onClick={addCity} disabled={!cityInput.trim()}>Ekle</button>
                </div>
                {cities.length > 0 && (
                  <div className="city-list">
                    {cities.map(c => (
                      <div key={c} className="city-chip">📍 {c}<button className="chip-remove" onClick={() => setCities(cities.filter(x => x !== c))}>×</button></div>
                    ))}
                  </div>
                )}
                <div className="ob-actions">
                  <button className="skip-btn" onClick={() => setWantsCities(null)}>Geri</button>
                  <button className="ob-btn" onClick={finish}>Bitti, Başlayalım 🎸</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [setup, setSetup] = useState(() => { try { return JSON.parse(localStorage.getItem('gr_setup')) || null; } catch { return null; } });
  const [tab, setTab] = useState('artists');
  const [artistConcerts, setArtistConcerts] = useState({});
  const [cityConcerts, setCityConcerts] = useState({});
  const [activeCity, setActiveCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  const handleOnboardComplete = (data) => {
    localStorage.setItem('gr_setup', JSON.stringify(data));
    setSetup(data);
    if (data.cities?.length > 0) setActiveCity(data.cities[0]);
  };

  const fetchArtistConcerts = useCallback(async () => {
    if (!setup?.artists?.length) return;
    setLoading(true); setError(null);
    const results = {};
    try {
      for (const artist of setup.artists) {
        const res = await fetch(`/api/concerts?attractionId=${artist.id}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        results[artist.id] = await res.json();
      }
      setArtistConcerts(results);
      setLastUpdate(new Date());
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [setup]);

  const fetchCityConcerts = useCallback(async (city) => {
    if (!city) return;
    setCityLoading(true);
    try {
      const res = await fetch(`/api/concerts?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      setCityConcerts(prev => ({ ...prev, [city]: data }));
    } catch (e) { setError(e.message); }
    setCityLoading(false);
  }, []);

  useEffect(() => {
    if (setup?.artists?.length) fetchArtistConcerts();
    if (setup?.cities?.length) { setActiveCity(setup.cities[0]); fetchCityConcerts(setup.cities[0]); }
  }, [setup]);

  useEffect(() => {
    if (activeCity && !cityConcerts[activeCity]) fetchCityConcerts(activeCity);
  }, [activeCity]);

  if (!setup) return (<><style>{STYLE}</style><div className="grain" /><Onboarding onComplete={handleOnboardComplete} /></>);

  const allArtistConcerts = setup.artists.flatMap(artist =>
    (artistConcerts[artist.id] || []).map(c => ({ ...c, artistName: artist.name }))
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const filteredArtistConcerts = allArtistConcerts.filter(c =>
    !search || c.artistName?.toLowerCase().includes(search.toLowerCase()) ||
    c.venue?.toLowerCase().includes(search.toLowerCase()) || c.city?.toLowerCase().includes(search.toLowerCase())
  );

  const currentCityConcerts = activeCity ? (cityConcerts[activeCity] || []) : [];
  const filteredCityConcerts = currentCityConcerts.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.venue?.toLowerCase().includes(search.toLowerCase())
  );

  const hasCities = setup.cities?.length > 0;

  return (
    <><style>{STYLE}</style><div className="grain" />
    <div className="app">
      <header className="header">
        <div><div className="logo-tag">UK Concert Tracker</div><div className="logo-title">GIG<span>RADAR</span></div></div>
        <div className="header-right">
          {lastUpdate && <div className="header-update">Updated {lastUpdate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>}
          <button className="btn-reset" onClick={() => { localStorage.removeItem('gr_setup'); setSetup(null); }}>Ayarları sıfırla</button>
        </div>
      </header>

      {error && <div className="error-bar">⚠️ {error}</div>}

      <nav className="tabs">
        <button className={`tab ${tab==='artists'?'active':''}`} onClick={() => setTab('artists')}>
          Sanatçılarım <span className="tab-count">{filteredArtistConcerts.length}</span>
        </button>
        {hasCities && (
          <button className={`tab ${tab==='cities'?'active':''}`} onClick={() => setTab('cities')}>
            Şehirler <span className="tab-count">{currentCityConcerts.length}</span>
          </button>
        )}
      </nav>

      {tab === 'artists' && (
        <>
          <div className="toolbar">
            <div className="search-wrap"><span className="search-icon">🔍</span><input className="search-input" placeholder="Sanatçı, mekan, şehir..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <button className="btn-refresh" onClick={fetchArtistConcerts} disabled={loading}>
              <span className={loading?'spin':''}>↻</span>{loading?'Yükleniyor...':'Yenile'}
            </button>
          </div>
          {loading ? <div className="loading-row"><span className="spin" style={{fontSize:20}}>↻</span> Konserler yükleniyor...</div>
          : filteredArtistConcerts.length === 0 ? (
            <div className="empty"><div className="empty-icon">🎸</div><h3>Konser Bulunamadı</h3><p>Takip ettiğin sanatçıların UK'de yaklaşan konseri yok.</p></div>
          ) : (
            <div className="concerts-grid">{filteredArtistConcerts.map((c,i) => <ConcertCard key={`${c.id}-${i}`} concert={c} index={i} artistName={c.artistName} />)}</div>
          )}
        </>
      )}

      {tab === 'cities' && hasCities && (
        <>
          <div className="city-filter-row">
            {setup.cities.map(city => (
              <button key={city} className={`city-filter-btn ${activeCity===city?'active':''}`} onClick={() => setActiveCity(city)}>📍 {city}</button>
            ))}
          </div>
          <div className="toolbar">
            <div className="search-wrap"><span className="search-icon">🔍</span><input className="search-input" placeholder="Etkinlik, mekan ara..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <button className="btn-refresh" onClick={() => activeCity && fetchCityConcerts(activeCity)} disabled={cityLoading}>
              <span className={cityLoading?'spin':''}>↻</span>{cityLoading?'Yükleniyor...':'Yenile'}
            </button>
          </div>
          {cityLoading ? <div className="loading-row"><span className="spin" style={{fontSize:20}}>↻</span> {activeCity} konserleri yükleniyor...</div>
          : filteredCityConcerts.length === 0 ? (
            <div className="empty"><div className="empty-icon">📍</div><h3>Konser Bulunamadı</h3><p>{activeCity}'de yaklaşan müzik etkinliği bulunamadı.</p></div>
          ) : (
            <div className="concerts-grid">{filteredCityConcerts.map((c,i) => <ConcertCard key={`${c.id}-${i}`} concert={c} index={i} />)}</div>
          )}
        </>
      )}
    </div></>
  );
}
