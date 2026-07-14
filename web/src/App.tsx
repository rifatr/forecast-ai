import { useState } from 'react'

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>ForecastAI</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={() => console.log('Refresh')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <div className="grid-dashboard">
        {/* Placeholder for Dashboard Component */}
        <section className="glass-panel stat-card" style={{ gridColumn: '1 / -1' }}>
          <div className="stat-label">Weather Overview</div>
          <div className="stat-value">21°C</div>
          <p>Nairobi, Kenya — Clear sky</p>
        </section>

        {/* Placeholder for Quick Stats */}
        <section className="glass-panel stat-card">
          <div className="stat-label">API Plan</div>
          <div className="stat-value" style={{ fontSize: '1.5rem', background: 'var(--success-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Free Tier
          </div>
          <p>Rate limit status: Healthy</p>
        </section>

        {/* Placeholder for Farm Intelligence */}
        <section className="glass-panel stat-card">
          <div className="stat-label">Trees Analyzed</div>
          <div className="stat-value">0 / 200</div>
          <p>Upload a farm image to get started.</p>
        </section>
      </div>
    </div>
  )
}

export default App
