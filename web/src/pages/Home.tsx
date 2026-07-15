import { useState, useEffect } from 'react';
import { MapPin, Droplets, Wind, RefreshCw, CloudSun, Search, Calendar } from 'lucide-react';

export function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLat, setSearchLat] = useState('');
  const [searchLon, setSearchLon] = useState('');

  const fetchWeather = async (lat?: string, lon?: string) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
      let url = `${baseUrl}/v1/weather/geo?days=7`;
      
      if (lat && lon) {
        url = `${baseUrl}/v1/weather?lat=${lat}&lon=${lon}&days=7`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    if (data?.current) {
      if (data.current.is_day === 0) {
        document.documentElement.classList.add('theme-night');
        localStorage.setItem('theme', 'night');
      } else {
        document.documentElement.classList.remove('theme-night');
        localStorage.setItem('theme', 'day');
      }
    }
  }, [data?.current?.is_day]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLat && searchLon) {
      fetchWeather(searchLat, searchLon);
    }
  };

  if (loading && !data) {
    return (
      <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto', display: 'block', marginBottom: '1rem' }} />
        Detecting location and fetching forecast...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', backgroundColor: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-md)' }}>
        {error}
      </div>
    );
  }

  const { current, hourly, daily, geo } = data;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Search Location */}
      <div className="card" style={{ padding: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <Search size={20} color="var(--text-secondary)" />
            <input 
              type="number" 
              step="any"
              placeholder="Latitude (e.g. 40.71)" 
              value={searchLat}
              onChange={(e) => setSearchLat(e.target.value)}
              className="search-input"
              required
            />
            <input 
              type="number" 
              step="any"
              placeholder="Longitude (e.g. -74.00)" 
              value={searchLon}
              onChange={(e) => setSearchLon(e.target.value)}
              className="search-input"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Search Weather</button>
        </form>
      </div>

      {/* Hero Current Weather */}
      <div style={{ textAlign: 'center', padding: '1rem 1rem 3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1.25rem' }}>
          <MapPin size={24} />
          <span>{geo?.city || `Lat: ${data.lat}, Lon: ${data.lon}`} {geo?.country ? `, ${geo.country}` : ''}</span>
        </div>
        
        <h1 style={{ fontSize: '7rem', lineHeight: '1', margin: '0', fontWeight: '300', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {Math.round(current?.temperature)}°
        </h1>
        
        <div style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: '1rem', textTransform: 'capitalize', fontWeight: '500' }}>
          <CloudSun size={32} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }} />
          Code {current?.weathercode}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
            <Wind size={20} />
            <span>{current?.windspeed} km/h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
            <Droplets size={20} />
            <span>Precipitation: 0%</span>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Horizontal Scroll */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600', paddingLeft: '0.5rem' }}>Today's Forecast</h2>
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '1rem', 
          paddingBottom: '1rem',
          scrollbarWidth: 'none'
        }}>
          {hourly?.slice(0, 24).map((hour: any, idx: number) => {
            const time = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={idx} className="card" style={{
                minWidth: '90px',
                padding: '1.25rem 1rem',
                alignItems: 'center',
                gap: '0.75rem',
                flexShrink: 0
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600' }}>{time}</span>
                <CloudSun size={28} color="var(--accent-primary)" />
                <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>{Math.round(hour.temp)}°</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 7-Day Forecast */}
      {daily && daily.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} />
            7-Day Forecast
          </h2>
          <div className="card" style={{ padding: '0.5rem 1rem' }}>
            {daily.map((day: any, idx: number) => {
              const dateObj = new Date(day.date);
              const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
              return (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '1rem 0',
                  borderBottom: idx < daily.length - 1 ? '1px solid var(--glass-border)' : 'none'
                }}>
                  <div style={{ width: '100px', fontWeight: '600' }}>{dayName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'center' }}>
                    <Droplets size={16} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.875rem', width: '30px', color: 'var(--text-secondary)', fontWeight: '600' }}>{day.precipitation}%</span>
                  </div>
                  <CloudSun size={24} color="var(--accent-primary)" style={{ margin: '0 2rem' }} />
                  <div style={{ display: 'flex', gap: '1rem', width: '100px', justifyContent: 'flex-end', fontSize: '1.1rem' }}>
                    <span style={{ fontWeight: '700' }}>{Math.round(day.temp_max)}°</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{Math.round(day.temp_min)}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
