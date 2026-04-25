import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

const Settings = ({ theme, setTheme }: { theme: string, setTheme: (val: string) => void }) => {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your application preferences.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Appearance</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <button 
            className="btn"
            onClick={() => setTheme('light')}
            style={{ 
              flexDirection: 'column', 
              padding: '1.5rem', 
              border: theme === 'light' ? '2px solid var(--accent)' : '2px solid transparent',
              background: theme === 'light' ? 'rgba(0, 122, 255, 0.05)' : 'var(--bg-primary)',
              color: theme === 'light' ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <Sun size={32} style={{ marginBottom: '0.5rem' }} />
            Light Mode
          </button>
          
          <button 
            className="btn"
            onClick={() => setTheme('dark')}
            style={{ 
              flexDirection: 'column', 
              padding: '1.5rem', 
              border: theme === 'dark' ? '2px solid var(--accent)' : '2px solid transparent',
              background: theme === 'dark' ? 'rgba(0, 122, 255, 0.05)' : 'var(--bg-primary)',
              color: theme === 'dark' ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <Moon size={32} style={{ marginBottom: '0.5rem' }} />
            Dark Mode
          </button>

          <button 
            className="btn"
            onClick={() => setTheme('system')}
            style={{ 
              flexDirection: 'column', 
              padding: '1.5rem', 
              border: theme === 'system' ? '2px solid var(--accent)' : '2px solid transparent',
              background: theme === 'system' ? 'rgba(0, 122, 255, 0.05)' : 'var(--bg-primary)',
              color: theme === 'system' ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <Monitor size={32} style={{ marginBottom: '0.5rem' }} />
            System Match
          </button>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          "System Match" will automatically follow your OS setting.
        </p>
      </div>
    </div>
  );
};

export default Settings;
