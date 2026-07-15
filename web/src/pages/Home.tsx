import { useState, useEffect } from 'react';
import { MapPin, Droplets, Wind, RefreshCw, CloudSun } from 'lucide-react';

export function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
      // Using weather-geo with 7 days to get a rich weather app experience
      const response = await fetch(`${baseUrl}/v1/weather-geo?days=7`);
      
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

  const { current, hourly, geo } = data;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Current Weather */}
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1.25rem' }}>
          <MapPin size={24} />
          <span>{geo?.city}, {geo?.country}</span>
        </div>
        
        <h1 style={{ fontSize: '6rem', lineHeight: '1', margin: '0', fontWeight: '300' }}>
          {current?.temperature}°
        </h1>
        
        <div style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: '1rem', textTransform: 'capitalize' }}>
          {/* Mapping weather code to string could go here, fallback to general icon */}
          <CloudSun size={32} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }} />
          Code {current?.weathercode}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wind size={20} />
            <span>{current?.windspeed} km/h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Droplets size={20} />
            <span>Precipitation: 0%</span>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Horizontal Scroll */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Today's Forecast</h2>
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '1rem', 
          paddingBottom: '1rem',
          scrollbarWidth: 'none' // Hide scrollbar for Firefox
        }}>
          {hourly?.slice(0, 24).map((hour: any, idx: number) => {
            const time = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={idx} style={{
                minWidth: '80px',
                padding: '1.5rem 1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid var(--border-color)'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{time}</span>
                <CloudSun size={24} color="var(--accent-primary)" />
                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{hour.temp}°</span>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
