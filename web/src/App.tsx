import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/weather" element={<div className="page-header"><h1>Weather & Geo</h1><p>Detailed weather data will appear here.</p></div>} />
            <Route path="/farm" element={<div className="page-header"><h1>Farm Intelligence</h1><p>Upload farm images for AI analysis.</p></div>} />
            <Route path="/history" element={<div className="page-header"><h1>Analysis History</h1><p>Past AI farm analysis logs.</p></div>} />
            <Route path="/account" element={<div className="page-header"><h1>Account Usage</h1><p>Detailed API rate limits and quotas.</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
