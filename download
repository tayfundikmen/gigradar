import { useState, useEffect, useCallback } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --card: #16161f;
    --border: #2a2a3a;
    --accent: #e8ff47;
    --accent2: #ff4778;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
  }

  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
  }

  .app {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  .header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 48px 0 32px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 40px;
  }
  .logo { display: flex; flex-direction: column; gap: 2px; }
  .logo-tag { font-size: 11px; letter-spacing: 4px; color: var(--accent); text-transform: uppercase; font-weight: 500; }
  .logo-title { font-family: var(--font-display); font-size: clamp(42px, 7vw, 72px); line-height: 1; letter-spacing: 2px; color: var(--text); }
  .logo-title span { color: var(--accent); }
  .header-meta { text-align: right; }
  .header-meta .city { font-size: 13px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
  .header-meta .last-update { font-size: 12px; color: var(--muted); margin-top: 4px; }

  .no-api-banner {
    background: linear-gradient(135deg, #1a1a0a 0%, #1a0a14 100%);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent2);
    padding: 16px 20px;
    border-radius: 4px;
    margin-bottom: 32px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
  }
  .no-api-banner strong { color: var(--text); }

  .tabs {
    display: flex; gap: 2px; margin-bottom: 32px; border-bottom: 1px solid var(--border);
  }
  .tab {
    font-family: var(--font-display); font-size: 20px; letter-spacing: 1px;
    padding: 12px 24px 14px; background: none; border: none; color: var(--muted);
    cursor: pointer; position: relative; transition: color 0.2s;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); }
  .tab.active::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
    height: 2px; background: var(--accent);
  }
  .tab-count {
    font-family: var(--font-body); font-size: 11px; background: var(--border);
    color: var(--muted); padding: 2px 7px; border-radius: 20px; margin-left: 6px;
    vertical-align: middle; font-weight: 500;
  }
  .tab.active .tab-count { background: var(--accent); color: #000; }

  .toolbar {
    display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; align-items: center;
  }
  .search-wrap { flex: 1; min-width: 200px; position: relative; }
  .search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--muted); font-size: 14px; pointer-events: none;
  }
  .search-input {
    width: 100%; background: var(--card); border: 1px solid var(--border);
    border-radius: 4px; padding: 11px 14px 11px 38px; color: var(--text);
    font-family: var(--font-body); font-size: 14px; outline: none; transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--muted); }

  .filter-btn {
    padding: 10px 16px; background: var(--card); border: 1px solid var(--border);
    border-radius: 4px; color: var(--muted); font-family: var(--font-body);
    font-size: 13px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .filter-btn:hover, .filter-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(232,255,71,0.05); }

  .btn-refresh {
    padding: 10px 18px; background: var(--accent); border: none; border-radius: 4px;
    color: #000; font-family: var(--font-body); font-weight: 600; font-size: 13px;
    cursor: pointer; transition: opacity 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .btn-refresh:hover { opacity: 0.88; }
  .btn-refresh:disabled { opacity: 0.4; cursor: not-allowed; }
  .spin { animation: spin 1s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .concerts-grid { display: flex; flex-direction: column; gap: 2px; }

  .concert-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 4px;
    padding: 20px 24px; display: grid; grid-template-columns: 72px 1fr auto;
    gap: 20px; align-items: center; transition: border-color 0.2s, transform 0.15s;
    animation: fadeIn 0.3s ease both;
  }
  .concert-card:hover { border-color: #3a3a4a; transform: translateX(3px); }
  .concert-card.on-sale { border-left: 3px solid var(--accent2); }
  .concert-card.soon { border-left: 3px solid var(--accent); }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  .card-date { text-align: center; line-height: 1; }
  .date-day { font-family: var(--font-display); font-size: 36px; color: var(--text); line-height: 1; }
  .date-month { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 3px; }
  .date-year { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .card-info { overflow: hidden; }
  .card-artist {
    font-family: var(--font-display); font-size: 22px; letter-spacing: 0.5px;
    color: var(--text); line-height: 1; margin-bottom: 5px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .card-event { font-size: 13px; color: var(--muted); margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-meta { display: flex; gap: 12px; flex-wrap: wrap; }
  .meta-tag { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
  .genre-tag { font-size: 10px; padding: 2px 8px; border-radius: 20px; border: 1px solid var(--border); color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .genre-rock { border-color: #ff4778; color: #ff4778; }
  .genre-electronic { border-color: #47d4ff; color: #47d4ff; }
  .genre-indie { border-color: #b447ff; color: #b447ff; }

  .card-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
  .ticket-status {
    font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
    letter-spacing: 1px; text-transform: uppercase; white-space: nowrap;
  }
  .status-on-sale { background: rgba(255,71,120,0.15); color: var(--accent2); }
  .status-soon { background: rgba(232,255,71,0.1); color: var(--accent); }
  .status-announced { background: rgba(255,255,255,0.05); color: var(--muted); }

  .btn-tickets {
    font-size: 12px; padding: 6px 14px; background: none; border: 1px solid var(--border);
    border-radius: 3px; color: var(--text); cursor: pointer; font-family: var(--font-body);
    text-decoration: none; transition: all 0.2s;
  }
  .btn-tickets:hover { border-color: var(--accent); color: var(--accent); }

  .artist-manager { display: flex; flex-direction: column; gap: 24px; }
  .add-artist-row { display: flex; gap: 10px; }
  .artist-input {
    flex: 1; background: var(--card); border: 1px solid var(--border); border-radius: 4px;
    padding: 12px 16px; color: var(--text); font-family: var(--font-body); font-size: 14px;
    outline: none; transition: border-color 0.2s;
  }
  .artist-input:focus { border-color: var(--accent); }
  .artist-input::placeholder { color: var(--muted); }
  .btn-add {
    background: var(--accent); color: #000; border: none; padding: 12px 20px;
    border-radius: 4px; font-family: var(--font-body); font-weight: 600; font-size: 14px; cursor: pointer;
  }

  .artist-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
  .artist-chip {
    background: var(--card); border: 1px solid var(--border); border-radius: 4px;
    padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
    gap: 8px; animation: fadeIn 0.3s ease;
  }
  .artist-name { font-size: 14px; font-weight: 500; }
  .btn-remove {
    background: none; border: none; color: var(--muted); cursor: pointer;
    font-size: 18px; padding: 2px 4px; border-radius: 3px; transition: color 0.2s; line-height: 1;
  }
  .btn-remove:hover { color: var(--accent2); }

  .genre-section { margin-bottom: 8px; }
  .genre-heading {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted);
    margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
  }
  .genre-heading::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .empty { text-align: center; padding: 80px 20px; color: var(--muted); }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
  .empty h3 { font-family: var(--font-display); font-size: 28px; color: var(--text); margin-bottom: 8px; }
  .empty p { font-size: 14px; line-height: 1.6; }

  .loading-row {
    display: flex; align-items: center; justify-content: center; gap: 12px;
    padding: 40px; color: var(--muted); font-size: 14px;
  }

  .notif-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 4px;
    padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
  }
  .notif-info h4 { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
  .notif-info p { font-size: 13px; color: var(--muted); }
  .toggle {
    width: 44px; height: 24px; background: var(--border); border-radius: 12px;
    position: relative; cursor: pointer; border: none; transition: background 0.3s; flex-shrink: 0;
  }
  .toggle.on { background: var(--accent); }
  .toggle::after {
    content: ''; position: absolute; width: 18px; height: 18px; background: #fff;
    border-radius: 50%; top: 3px; left: 3px; transition: transform 0.3s;
  }
  .toggle.on::after { transform: translateX(20px); }

  .section-title { font-family: var(--font-display); font-size: 24px; letter-spacing: 1px; margin-bottom: 16px; }

  .info-box {
    background: var(--card); border: 1px solid var(--border); border-radius: 4px;
    padding: 16px 20px; font-size: 13px; color: var(--muted); line-height: 1.8; margin-bottom: 10px;
  }
  .info-box strong { color: var(--text); }
  .info-box code {
    background: var(--bg); padding: 2px 8px; border-radius: 3px;
    font-family: 'Courier New', monospace; color: var(--accent); font-size: 12px;
  }

  @media (max-width: 600px) {
    .concert-card { grid-template-columns: 56px 1fr; }
    .card-actions { display: none; }
    .header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .tabs { overflow-x: auto; }
    .tab { font-size: 16px; padding: 10px 16px 12px; }
  }
`;

// API key from Vercel environment variable (injected at build time)
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY || "";

const DEFAULT_ARTISTS = [
  { id: 1, name: "Radiohead", genre: "indie" },
  { id: 2, name: "The Chemical Brothers", genre: "electronic" },
  { id: 3, name: "Arctic Monkeys", genre: "indie" },
  { id: 4, name: "Nine Inch Nails", genre: "rock" },
  { id: 5, name: "Massive Attack", genre: "electronic" },
  { id: 6, name: "Placebo", genre: "rock" },
];

const DEMO_CONCERTS = [
  { id: 1, artist: "Arctic Monkeys", eventName: "The Car Tour", date: "2026-05-14", venue: "O2 Arena", city: "London", genre: "indie", status: "on-sale", ticketUrl: "https://ticketmaster.co.uk", onSaleDate: "On sale now" },
  { id: 2, artist: "The Chemical Brothers", eventName: "For That Beautiful Feeling", date: "2026-06-21", venue: "Glastonbury Festival", city: "Somerset", genre: "electronic", status: "soon", ticketUrl: "https://ticketmaster.co.uk", onSaleDate: "Tickets 28 Mar" },
  { id: 3, artist: "Placebo", eventName: "Never Let Me Go Tour", date: "2026-04-03", venue: "O2 Academy Brixton", city: "London", genre: "rock", status: "on-sale", ticketUrl: "https://ticketmaster.co.uk", onSaleDate: "On sale now" },
  { id: 4, artist: "Massive Attack", eventName: "Mezzanine 25th Anniversary", date: "2026-07-10", venue: "Manchester Arena", city: "Manchester", genre: "electronic", status: "announced", ticketUrl: "https://ticketmaster.co.uk", onSaleDate: "TBA" },
  { id: 5, artist: "Nine Inch Nails", eventName: "Hesitation Marks Tour", date: "2026-06-05", venue: "Download Festival", city: "Donington", genre: "rock", status: "soon", ticketUrl: "https://ticketmaster.co.uk", onSaleDate: "Tickets 1 Apr" },
  { id: 6, artist: "Radiohead", eventName: "A Moon Shaped Pool", date: "2026-09-18", venue: "Wembley Stadium", city: "London", genre: "indie", status: "announced", ticketUrl: "https://ticketmaster.co.uk", onSaleDate: "TBA" },
];

const GENRE_COLORS = { rock: "genre-rock", electronic: "genre-electronic", indie: "genre-indie" };

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
};

const StatusBadge = ({ status, onSaleDate }) => {
  if (status === "on-sale") return <span className="ticket-status status-on-sale">● On Sale</span>;
  if (status === "soon") return <span className="ticket-status status-soon">⏰ {onSaleDate}</span>;
  return <span className="ticket-status status-announced">Announced</span>;
};

export default function App() {
  const [tab, setTab] = useState("concerts");
  const [artists, setArtists] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gr_artists")) || DEFAULT_ARTISTS; }
    catch { return DEFAULT_ARTISTS; }
  });
  const [concerts, setConcerts] = useState(DEMO_CONCERTS);
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [newArtist, setNewArtist] = useState("");
  const [newGenre, setNewGenre] = useState("indie");
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [notifs, setNotifs] = useState({ onsale: true, week: true, day: false });
  const [error, setError] = useState(null);

  // Persist artists
  useEffect(() => {
    localStorage.setItem("gr_artists", JSON.stringify(artists));
  }, [artists]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const notify = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const fetchConcerts = useCallback(async () => {
    if (!API_KEY) return;
    setLoading(true);
    setError(null);
    try {
      const results = [];
      for (const a of artists) {
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(a.name)}&countryCode=GB&classificationName=music&size=5&sort=date,asc&apikey=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const events = data._embedded?.events || [];
        for (const ev of events) {
          const saleStart = ev.sales?.public?.startDateTime;
          const statusCode = ev.dates?.status?.code;
          results.push({
            id: ev.id,
            artist: a.name,
            eventName: ev.name,
            date: ev.dates?.start?.localDate || "TBA",
            venue: ev._embedded?.venues?.[0]?.name || "TBA",
            city: ev._embedded?.venues?.[0]?.city?.name || "UK",
            genre: a.genre,
            status: statusCode === "onsale" ? "on-sale" : statusCode === "offsale" ? "announced" : saleStart && new Date(saleStart) > new Date() ? "soon" : "announced",
            ticketUrl: ev.url || "#",
            onSaleDate: saleStart ? new Date(saleStart).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "TBA"
          });
        }
      }
      setConcerts(results);
      setLastUpdate(new Date());

      // Notify on-sale concerts
      const onSale = results.filter(c => c.status === "on-sale");
      if (onSale.length > 0 && notifs.onsale) {
        notify("🎟 Bilet Satışta!", onSale.map(c => c.artist).join(", ") + " — şu an satışta");
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [artists, notifs]);

  // Auto-fetch on load if API key exists
  useEffect(() => {
    if (API_KEY) fetchConcerts();
  }, []);

  const filtered = concerts.filter(c => {
    const tracked = artists.some(a => a.name.toLowerCase() === c.artist.toLowerCase());
    if (!tracked) return false;
    if (filterGenre !== "all" && c.genre !== filterGenre) return false;
    if (search && !c.artist.toLowerCase().includes(search.toLowerCase()) &&
        !c.venue.toLowerCase().includes(search.toLowerCase()) &&
        !c.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const onSaleList = filtered.filter(c => c.status === "on-sale");

  const addArtist = () => {
    const name = newArtist.trim();
    if (!name || artists.find(a => a.name.toLowerCase() === name.toLowerCase())) return;
    setArtists([...artists, { id: Date.now(), name, genre: newGenre }]);
    setNewArtist("");
  };

  const removeArtist = (id) => setArtists(artists.filter(a => a.id !== id));
  const byGenre = (g) => artists.filter(a => a.genre === g);

  const displayConcerts = tab === "onsale" ? onSaleList : filtered;

  return (
    <>
      <style>{STYLE}</style>
      <div className="grain" />
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="logo">
            <span className="logo-tag">UK Concert Tracker</span>
            <h1 className="logo-title">GIG<span>RADAR</span></h1>
          </div>
          <div className="header-meta">
            <div className="city">📍 United Kingdom</div>
            {lastUpdate && (
              <div className="last-update">Updated {lastUpdate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
            )}
          </div>
        </header>

        {/* NO API KEY WARNING */}
        {!API_KEY && (
          <div className="no-api-banner">
            <strong>⚠️ Demo modu</strong> — Vercel'de <code>VITE_TICKETMASTER_API_KEY</code> environment variable'ı eklenmedi. Şu an örnek veriler gösteriliyor.
          </div>
        )}

        {error && (
          <div className="no-api-banner" style={{ borderLeftColor: "var(--accent2)" }}>
            <strong>Hata:</strong> {error}
          </div>
        )}

        {/* TABS */}
        <nav className="tabs">
          <button className={`tab ${tab === "concerts" ? "active" : ""}`} onClick={() => setTab("concerts")}>
            Konserler <span className="tab-count">{filtered.length}</span>
          </button>
          <button className={`tab ${tab === "onsale" ? "active" : ""}`} onClick={() => setTab("onsale")}>
            Satışta {onSaleList.length > 0 && <span className="tab-count">{onSaleList.length}</span>}
          </button>
          <button className={`tab ${tab === "artists" ? "active" : ""}`} onClick={() => setTab("artists")}>
            Sanatçılar <span className="tab-count">{artists.length}</span>
          </button>
          <button className={`tab ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>
            Ayarlar
          </button>
        </nav>

        {/* CONCERTS / ONSALE TAB */}
        {(tab === "concerts" || tab === "onsale") && (
          <>
            <div className="toolbar">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input className="search-input" placeholder="Sanatçı, mekan, şehir..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {["all", "rock", "electronic", "indie"].map(g => (
                <button key={g} className={`filter-btn ${filterGenre === g ? "active" : ""}`} onClick={() => setFilterGenre(g)}>
                  {g === "all" ? "Tümü" : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
              <button className="btn-refresh" onClick={fetchConcerts} disabled={loading || !API_KEY}>
                <span className={loading ? "spin" : ""}>↻</span>
                {loading ? "Yükleniyor..." : "Yenile"}
              </button>
            </div>

            {loading ? (
              <div className="loading-row"><span className="spin" style={{ fontSize: 20 }}>↻</span> Konserler yükleniyor...</div>
            ) : displayConcerts.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🎸</div>
                <h3>{tab === "onsale" ? "Aktif Satış Yok" : "Konser Bulunamadı"}</h3>
                <p>{!API_KEY ? "Vercel'e API key ekleyince gerçek konserler gelir." : "Filtreni değiştir ya da sanatçı ekle."}</p>
              </div>
            ) : (
              <div className="concerts-grid">
                {displayConcerts.map((c, i) => {
                  const d = c.date !== "TBA" ? formatDate(c.date) : null;
                  return (
                    <div key={c.id} className={`concert-card ${c.status}`} style={{ animationDelay: `${i * 40}ms` }}>
                      <div className="card-date">
                        {d ? (<><div className="date-day">{d.day}</div><div className="date-month">{d.month}</div><div className="date-year">{d.year}</div></>) : <div style={{ fontSize: 13, color: "var(--muted)" }}>TBA</div>}
                      </div>
                      <div className="card-info">
                        <div className="card-artist">{c.artist}</div>
                        <div className="card-event">{c.eventName}</div>
                        <div className="card-meta">
                          <span className="meta-tag">📍 {c.venue}, {c.city}</span>
                          <span className={`genre-tag ${GENRE_COLORS[c.genre] || ""}`}>{c.genre}</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <StatusBadge status={c.status} onSaleDate={c.onSaleDate} />
                        <a href={c.ticketUrl} target="_blank" rel="noreferrer" className="btn-tickets">Bilet Al →</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ARTISTS TAB */}
        {tab === "artists" && (
          <div className="artist-manager">
            <div>
              <p className="section-title">Sanatçı Ekle</p>
              <div className="add-artist-row">
                <input className="artist-input" placeholder="Sanatçı adı..." value={newArtist} onChange={e => setNewArtist(e.target.value)} onKeyDown={e => e.key === "Enter" && addArtist()} />
                <select className="artist-input" style={{ maxWidth: 140 }} value={newGenre} onChange={e => setNewGenre(e.target.value)}>
                  <option value="rock">Rock / Metal</option>
                  <option value="electronic">Electronic</option>
                  <option value="indie">Indie / Alt</option>
                </select>
                <button className="btn-add" onClick={addArtist}>+ Ekle</button>
              </div>
            </div>
            {["rock", "electronic", "indie"].map(g => byGenre(g).length > 0 && (
              <div key={g} className="genre-section">
                <div className="genre-heading">{g === "rock" ? "Rock / Metal" : g === "electronic" ? "Electronic / Dance" : "Indie / Alternative"}</div>
                <div className="artist-list">
                  {byGenre(g).map(a => (
                    <div key={a.id} className="artist-chip">
                      <div className="artist-name">{a.name}</div>
                      <button className="btn-remove" onClick={() => removeArtist(a.id)}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div>
            <p className="section-title">Bildirimler</p>
            {[
              { key: "onsale", title: "Bilet Satışa Çıktı", desc: "Takip ettiğin sanatçının bileti satışa girince bildir" },
              { key: "week", title: "1 Hafta Kala", desc: "Konserden 7 gün önce hatırlat" },
              { key: "day", title: "Gün Hatırlatması", desc: "Konser günü sabahı bildir" },
            ].map(n => (
              <div key={n.key} className="notif-card">
                <div className="notif-info"><h4>{n.title}</h4><p>{n.desc}</p></div>
                <button className={`toggle ${notifs[n.key] ? "on" : ""}`} onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))} />
              </div>
            ))}

            <p className="section-title" style={{ marginTop: 24 }}>PWA Kurulumu</p>
            <div className="info-box">
              <strong>Android'e uygulama olarak eklemek için:</strong><br />
              Chrome'da aç → sağ üst menü (⋮) → <strong>"Add to Home Screen"</strong> → Ana ekranda GigRadar ikonu belirir. Bildirimler otomatik çalışır.
            </div>

            <p className="section-title" style={{ marginTop: 24 }}>API Durumu</p>
            <div className="info-box">
              {API_KEY
                ? <><strong style={{ color: "var(--accent)" }}>✓ Bağlı</strong> — Ticketmaster API aktif, gerçek veriler çekiliyor.</>
                : <><strong style={{ color: "var(--accent2)" }}>✗ API Key Eksik</strong> — Vercel dashboard'unda <code>VITE_TICKETMASTER_API_KEY</code> ekle.</>
              }
            </div>
          </div>
        )}
      </div>
    </>
  );
}
