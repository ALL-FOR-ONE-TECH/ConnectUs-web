import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Settings, 
  Users, 
  BarChart3, 
  FileText, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import './sidebar.css';

interface MenuItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  active: boolean;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 707);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Home', href: '/adm-ConnectUs/admin-home', active: true },
    { icon: Settings, label: 'Service Management', href: '/adm-ConnectUs/service-types', active: false },
    { icon: Users, label: 'Business', href: '/adm-ConnectUs/business-manager', active: false },
    { icon: BarChart3, label: 'AdminReviewLink', href: '/adm-ConnectUs/admin-review-links', active: false },
    { icon: FileText, label: 'Admin-review', href: '/adm-ConnectUs/all-reviews', active: false },
    { icon: HelpCircle, label: 'Complaints', href: '/adm-ConnectUs/all-complaints', active: false },
  ];

  // Update isOpen based on window size
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 707);
      if (window.innerWidth >= 707) {
        setIsCollapsed(false); // Ensure sidebar is not collapsed in laptop view by default
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-mobile-toggle"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} className="sidebar-toggle-icon" /> : <Menu size={24} className="sidebar-toggle-icon" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && window.innerWidth < 707 && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-hidden'} ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Settings size={20} />
            </div>
            {!isCollapsed && (
              <div className="sidebar-logo-text">
                <h2 className="sidebar-logo-title">ServicePro</h2>
                <p className="sidebar-logo-subtitle">Management</p>
              </div>
            )}
          </div>
          
          {/* Desktop Collapse Button */}
          {window.innerWidth >= 707 && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="sidebar-collapse-btn"
              aria-label="Collapse sidebar"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className="sidebar-menu-item-wrapper">
                  <Link
                    to={item.href}
                    className={`sidebar-menu-item ${item.active ? 'sidebar-menu-item-active' : ''}`}
                    onClick={() => {
                      if (window.innerWidth < 707) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <Icon size={20} className="sidebar-menu-icon" />
                    {!isCollapsed && <span className="sidebar-menu-label">{item.label}</span>}
                    {isCollapsed && (
                      <div className="sidebar-tooltip">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>


      </aside>
    </>
  );
};

export default Sidebar;