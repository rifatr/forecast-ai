import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Account } from './pages/Account';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night') {
      document.documentElement.classList.add('theme-night');
    } else if (savedTheme === 'day') {
      document.documentElement.classList.remove('theme-night');
    }
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        
        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<div className="page-header"><h1>Search Results</h1><p>Weather data for your search will appear here.</p></div>} />
            <Route path="/farm" element={<div className="page-header"><h1>Farm Intelligence</h1><p>Upload farm images for AI analysis.</p></div>} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
