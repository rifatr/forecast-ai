import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CloudRain, Trees, FileClock, User } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <CloudRain size={28} className="text-accent-primary" />
        ForecastAI
      </div>
      
      <nav className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/weather" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <CloudRain size={20} />
          Weather & Geo
        </NavLink>
        
        <NavLink 
          to="/farm" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Trees size={20} />
          Farm Intelligence
        </NavLink>

        <NavLink 
          to="/history" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <FileClock size={20} />
          Analysis History
        </NavLink>

        <NavLink 
          to="/account" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <User size={20} />
          Account Usage
        </NavLink>
      </nav>
    </div>
  );
}
