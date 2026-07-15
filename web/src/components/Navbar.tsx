import { NavLink } from 'react-router-dom';
import { CloudRain, Search, User } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <CloudRain size={28} className="text-accent-primary" />
          <span>ForecastAI</span>
        </NavLink>
        
        {/* Right Actions */}
        <nav className="navbar-actions">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/farm" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Farm AI
          </NavLink>
          <NavLink to="/account" className="profile-btn">
            <User size={20} />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
