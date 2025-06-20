import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin, ChevronDown } from 'lucide-react';
import './navbar.css';

interface HeaderNavProps {
  location?: string;
  onLocationChange?: (location: string) => void;
}

const HeaderNav: React.FC<HeaderNavProps> = ({
  location = 'New York',
  onLocationChange,
}) => {
  // ✅ Hooks must always come before conditional logic
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Detect if we are inside the Expo mobile app
  const isInMobileApp = /ConnectUsApp/i.test(navigator.userAgent);
  if (isInMobileApp) return null; // Hooks already called, safe to return early

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <Link to="/" onClick={() => handleNavClick('/')} className="brand-link">
            JustServe
          </Link>
        </div>

        {/* Location Selector - Desktop */}
        {/* <div className="location-selector desktop-only">
          <MapPin className="location-icon" />
          {/* <span className="location-text">{location}</span> 
          <ChevronDown className="location-chevron" />
        </div> */}

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-only">
          <Link to="/" onClick={() => handleNavClick('/')} className="nav-link">
            Home
          </Link>
          <Link to="/search-engine" onClick={() => handleNavClick('/search-engine')} className="nav-link">
            Search
          </Link>
          <Link to="/ServiceList" onClick={() => handleNavClick('/ServiceList')} className="nav-link">
            Services
          </Link>
          <Link to="/complaint-form" onClick={() => handleNavClick('/complaint-form')} className="nav-link nav-cta">
            Submit Complaint
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-menu-toggle mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu">
          {/* Close Button */}
          <button className="mobile-menu-close" onClick={toggleMobileMenu} aria-label="Close mobile menu">
            <X size={24} />
          </button>

          {/* Location Selector - Mobile */}
          {/* <div className="mobile-location">
            {/* <MapPin className="location-icon" /> */}
            {/* <span className="location-text">{location}</span> 
            <ChevronDown className="location-chevron" />
          </div> */}

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-links">
            <Link to="/" onClick={() => handleNavClick('/')} className="mobile-nav-link">
              Home
            </Link>
            <Link to="/search-engine" onClick={() => handleNavClick('/search-engine')} className="mobile-nav-link">
              Search
            </Link>
            <Link to="/ServiceList" onClick={() => handleNavClick('/ServiceList')} className="mobile-nav-link">
              Services
            </Link>
            <Link
              to="/complaint-form"
              onClick={() => handleNavClick('/complaint-form')}
              className="mobile-nav-link mobile-nav-cta"
            >
              Submit Complaint
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
