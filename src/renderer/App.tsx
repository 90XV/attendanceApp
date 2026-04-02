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

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scan', icon: Camera, label: 'Scan Attendace' },
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
        <div className="nav-item">
          <Settings size={20} />
          Settings
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/scan" element={<AttendanceScanner />} />
          <Route path="/history" element={<HistoryLogs />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
