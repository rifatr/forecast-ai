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
      const response = await fetch(`${baseUrl}/v1/weather/geo?days=7`);
      
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
        document.body.classList.add('theme-night');
      } else {
        document.body.classList.remove('theme-night');
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('theme-night');
    };
  }, [data?.current?.is_day]);

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
        
        <h1 style={{ fontSize: '7rem', lineHeight: '1', margin: '0', fontWeight: '300', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {Math.round(current?.temperature)}°
        </h1>
        
        <div style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: '1rem', textTransform: 'capitalize', fontWeight: '500' }}>
          {/* Mapping weather code to string could go here, fallback to general icon */}
          <CloudSun size={32} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }} />
          Code {current?.weathercode}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.4)', padding: '0.5rem 1rem', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
            <Wind size={20} />
            <span>{current?.windspeed} km/h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.4)', padding: '0.5rem 1rem', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
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
          scrollbarWidth: 'none' // Hide scrollbar for Firefox
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
      
    </div>
  );
}
