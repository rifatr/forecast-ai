import { RefreshCw, CloudRain, Zap, Trees as TreesIcon, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // In production, /v1/dashboard is on the same host. 
      // In local dev, Vite proxy or full URL is needed if not running via Docker fully.
      // Since they are on the same origin when deployed, we just use /v1/dashboard
      // But for local dev (Vite on 5173, Nest on 3001), we should use absolute URL if dev
      const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
      const response = await fetch(`${baseUrl}/v1/dashboard`);
      
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="page-header animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Unified telemetry, weather, and AI quotas.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={fetchDashboardData}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {loading && !data ? (
        <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto', display: 'block', marginBottom: '1rem' }} />
          Loading unified dashboard payload...
        </div>
      ) : data ? (
        <div className="grid-dashboard" style={{ marginTop: '2rem' }}>
          {/* Weather Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <p>Current Weather</p>
              <CloudRain size={20} />
            </div>
            {data.weather?.error ? (
              <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>{data.weather.error}</div>
            ) : (
              <>
                <div className="stat-value">{data.weather?.current?.temperature}°C</div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Code: {data.weather?.current?.weathercode} • Wind: {data.weather?.current?.windspeed}km/h
                </p>
              </>
            )}
          </div>

          {/* Geo Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <p>Geological Location</p>
              <MapPin size={20} />
            </div>
            {data.geo?.error ? (
              <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>{data.geo.error}</div>
            ) : (
              <>
                <div className="stat-value" style={{ fontSize: '1.75rem' }}>{data.geo?.city || 'Unknown'}</div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  {data.geo?.country} • {data.geo?.timezone}
                </p>
              </>
            )}
          </div>

          {/* Usage Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <p>Upstream API Plan</p>
              <Zap size={20} />
            </div>
            {data.usage?.error ? (
              <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>{data.usage.error}</div>
            ) : (
              <>
                <div className="stat-value" style={{ color: 'var(--accent-primary)', textTransform: 'capitalize' }}>
                  {data.usage?.plan} Tier
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <span className="badge">
                    {data.usage?.unlimited ? 'Unlimited' : `${data.usage?.remaining} Requests Left`}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Trees Quota Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <p>Farm AI Quota</p>
              <TreesIcon size={20} />
            </div>
            {data.treesQuota?.error ? (
              <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>{data.treesQuota.error}</div>
            ) : (
              <>
                <div className="stat-value">{data.treesQuota?.remaining} / {data.treesQuota?.limit}</div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Analyses remaining
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
