import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Account } from './pages/Account';
import { Farm } from './pages/Farm';
import { ThemeProvider } from './theme';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />

          <main className="main-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/search"
                element={(
                  <div className="page-header">
                    <h1>Search Results</h1>
                    <p>Weather data for your search will appear here.</p>
                  </div>
                )}
              />
              <Route path="/farm" element={<Farm />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
