import { NavLink } from 'react-router-dom';
import { CloudSun, User } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-mark"><CloudSun size={21} /></span>
          <span>Forecast<span className="logo-accent">AI</span></span>
        </NavLink>

        <nav className="navbar-actions" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Forecast
          </NavLink>

          <NavLink
            to="/farm"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Farm AI
          </NavLink>

          <ThemeSelector />

          <NavLink to="/account" className="profile-btn" aria-label="Account">
            <User size={19} />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
