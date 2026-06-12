import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  User, 
  LogOut, 
  Layers,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogoutClick = () => {
    logout();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop shadow */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 10, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 95
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Layers size={20} />
          </div>
          <span className="brand-name">TaskFlow</span>
          <button 
            className="menu-toggle" 
            onClick={onClose}
            style={{ marginLeft: 'auto', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              end
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/tasks" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <CheckSquare size={18} />
              <span>Tasks</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <FolderKanban size={18} />
              <span>Projects</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-footer">
          {user && (
            <div className="user-profile-summary">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
          )}
          <button className="btn btn-secondary btn-block" onClick={handleLogoutClick} style={{ width: '100%', marginTop: '0.5rem' }}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
