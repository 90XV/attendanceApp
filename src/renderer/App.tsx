import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  History, 
  Settings, 
  Camera,
  LogOut,
  UserPlus
} from 'lucide-react';

// Components (to be created)
import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import AttendanceScanner from './pages/AttendanceScanner';
import HistoryLogs from './pages/HistoryLogs';
import SettingsPage from './pages/Settings';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scan', icon: Camera, label: 'Scan Attendance' },
    { path: '/staff', icon: Users, label: 'Staff Management' },
    { path: '/history', icon: History, label: 'History Logs' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <QrCode size={32} />
        <span>AttnLog</span>
      </div>
      
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <Settings size={20} />
          Settings
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('attn-theme') || 'system');

  useEffect(() => {
    localStorage.setItem('attn-theme', theme);
    
    const applyTheme = () => {
      let activeTheme = theme;
      if (theme === 'system') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      if (activeTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  return (
    <Router>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/scan" element={<AttendanceScanner />} />
          <Route path="/history" element={<HistoryLogs />} />
          <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

