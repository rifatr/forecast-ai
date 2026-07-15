import { useState, useEffect } from 'react';
import { User, Zap, Trees as TreesIcon, RefreshCw } from 'lucide-react';

export function Account() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
      const response = await fetch(`${baseUrl}/v1/dashboard`);
      
      if (!response.ok) throw new Error('Failed to fetch account data');
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
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
          <User size={40} color="var(--text-secondary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>My Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your API plan and quotas</p>
        </div>
      </div>

      {loading && !data ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto', display: 'block', marginBottom: '1rem' }} />
          Loading usage...
        </div>
      ) : error ? (
        <div style={{ padding: '1rem', backgroundColor: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      ) : data ? (
        <div className="grid-dashboard">
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
