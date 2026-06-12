import React from 'react';
import { Menu, ShieldAlert, Key, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, onMenuToggle }) => {
  const { token, user } = useAuth();

  // Shorten token for simple display
  const truncateToken = (str) => {
    if (!str) return '';
    return `${str.substring(0, 12)}...${str.substring(str.length - 12)}`;
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <Menu size={22} />
        </button>
        <h2 className="header-title">{title}</h2>
      </div>

      <div className="header-right">
        {token && (
          <div className="jwt-badge-wrapper">
            <span className="badge badge-blue" style={{ display: 'flex', gap: '0.4rem', padding: '0.4rem 0.8rem', cursor: 'help' }}>
              <Key size={14} />
              <span>JWT Active</span>
              <div 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success)',
                  boxShadow: '0 0 6px var(--color-success)'
                }}
              />
            </span>
            
            {/* Educational Hover Tooltip showing JWT Details */}
            <div className="jwt-tooltip">
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Key size={12} className="text-gradient" />
                <span>Active Authorization Header</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.1rem' }}>Header key:</span>
                  <code style={{ fontSize: '0.7rem' }}>Authorization</code>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.1rem' }}>Header value:</span>
                  <code style={{ fontSize: '0.7rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Bearer {truncateToken(token)}
                  </code>
                </div>
                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Verified claims:</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>email: {user?.email}</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                  <HelpCircle size={10} />
                  <span>Go to the Profile page to inspect raw token segments.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
