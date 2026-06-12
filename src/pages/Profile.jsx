import React, { useState } from 'react';
import { useAuth, parseJWT } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { User, Mail, ShieldAlert, Key, Clipboard, Check, HelpCircle } from 'lucide-react';

const Profile = () => {
  const { user, token } = useAuth();
  const { tasks } = useTasks();
  
  const [copied, setCopied] = useState(false);

  // Decoded values
  const payload = parseJWT(token);
  
  // Custom header parser
  const parseHeader = (t) => {
    if (!t) return null;
    try {
      const parts = t.split('.');
      return JSON.parse(atob(parts[0]));
    } catch (e) {
      return null;
    }
  };
  const header = parseHeader(token);

  // Raw segments
  const tokenParts = token ? token.split('.') : ['', '', ''];
  const headerRaw = tokenParts[0];
  const payloadRaw = tokenParts[1];
  const signatureRaw = tokenParts[2];

  // Calculate task counts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>User Profile</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Detailed profile and session claims decoded directly from the active JWT token.
        </p>
      </div>

      <div className="profile-grid">
        {/* Left Column: User Card */}
        <div className="glass-card profile-card-left">
          {user && (
            <>
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="profile-avatar-large"
              />
              <h2 style={{ fontSize: '1.4rem' }}>{user.name}</h2>
              <span className="badge badge-purple profile-role-badge">{user.role}</span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Mail size={16} style={{ color: 'var(--color-text-muted)' }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <User size={16} style={{ color: 'var(--color-text-muted)' }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>UID: <code>{user.id}</code></span>
                </div>
              </div>

              <div className="profile-stats-row">
                <div className="profile-stat-box">
                  <span className="profile-stat-num">{totalTasks}</span>
                  <span className="profile-stat-lbl">Tasks</span>
                </div>
                <div style={{ borderLeft: '1px solid var(--card-border)' }} />
                <div className="profile-stat-box">
                  <span className="profile-stat-num">{completedTasks}</span>
                  <span className="profile-stat-lbl">Completed</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: JWT Token Inspector */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div className="jwt-inspector-title">
            <Key size={20} className="text-gradient" />
            <h3 style={{ fontSize: '1.15rem' }}>Educational JWT Token Inspector</h3>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
            JSON Web Tokens are structured in three parts separated by dots (<span style={{ fontWeight: 700 }}>.</span>): <span className="jwt-header-part">Header</span>, <span className="jwt-payload-part">Payload</span>, and <span className="jwt-signature-part">Signature</span>. Copy and inspect this token in `jwt.io` to see how it decodes.
          </p>

          {token ? (
            <>
              {/* Token Display block */}
              <div style={{ position: 'relative' }}>
                <div className="jwt-token-display">
                  <span className="jwt-header-part">{headerRaw}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>.</span>
                  <span className="jwt-payload-part">{payloadRaw}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>.</span>
                  <span className="jwt-signature-part">{signatureRaw}</span>
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCopyToken}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.7rem'
                  }}
                  title="Copy Full Token"
                >
                  {copied ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Clipboard size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Decoded Views Grid */}
              <div className="jwt-decoded-view">
                {/* 1. Header segment */}
                <div className="jwt-block">
                  <div className="jwt-block-title">
                    <span className="jwt-header-part">■</span>
                    <span>Header (Algorithm & Type)</span>
                  </div>
                  <pre className="jwt-block-json">
                    {header ? JSON.stringify(header, null, 2) : '// No Header'}
                  </pre>
                </div>

                {/* 2. Payload segment */}
                <div className="jwt-block">
                  <div className="jwt-block-title">
                    <span className="jwt-payload-part">■</span>
                    <span>Payload (Decoded Claims)</span>
                  </div>
                  <pre className="jwt-block-json">
                    {payload ? JSON.stringify(payload, null, 2) : '// No Payload'}
                  </pre>
                </div>
              </div>

              <div 
                style={{ 
                  marginTop: '1.25rem', 
                  display: 'flex', 
                  gap: '0.5rem', 
                  alignItems: 'flex-start',
                  background: 'rgba(139, 92, 246, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px'
                }}
              >
                <HelpCircle size={16} style={{ color: 'var(--color-secondary)', marginTop: '0.1rem' }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  <strong>How the Axios interceptor reads this:</strong> On every request, Axios reads this token from <code>localStorage</code>, constructs the <code>Authorization: Bearer [JWT]</code> header, and attaches it. The server decodes it statelessly, validating that the expiration (<code>exp</code>) claim is in the future.
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No JWT Session active. Please sign in first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
