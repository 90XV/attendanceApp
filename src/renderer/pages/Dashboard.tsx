import React, { useState, useEffect } from 'react';
import { Users, Camera, History, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    logsToday: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const teachers = await (window as any).electronAPI.invoke('get-teachers');
    const logs = await (window as any).electronAPI.invoke('get-logs');
    
    const today = new Date().toDateString();
    const todayLogs = logs.filter((log: any) => new Date(log.timestamp).toDateString() === today);

    setStats({
      totalTeachers: teachers.length,
      logsToday: todayLogs.length
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, Clerk</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening with the attendance today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent)' }}>
            <Users size={24} />
            <span style={{ fontWeight: 600 }}>Total Teachers</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '1rem' }}>{stats.totalTeachers}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--success)' }}>
            <Calendar size={24} />
            <span style={{ fontWeight: 600 }}>Logs Today</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '1rem' }}>{stats.logsToday}</div>
        </div>
      </div>

      <h2>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        <Link to="/scan" className="card nav-item" style={{ height: 'auto', padding: '2rem', textAlign: 'center', flexDirection: 'column', gap: '1rem' }}>
          <Camera size={48} style={{ color: 'var(--accent)' }} />
          <div>
            <div style={{ fontWeight: 700, color: 'white' }}>Start Scanning</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Log teacher attendance</div>
          </div>
        </Link>

        <Link to="/staff" className="card nav-item" style={{ height: 'auto', padding: '2rem', textAlign: 'center', flexDirection: 'column', gap: '1rem' }}>
          <Users size={48} style={{ color: '#a855f7' }} />
          <div>
            <div style={{ fontWeight: 700, color: 'white' }}>Manage Staff</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Add or edit teachers</div>
          </div>
        </Link>

        <Link to="/history" className="card nav-item" style={{ height: 'auto', padding: '2rem', textAlign: 'center', flexDirection: 'column', gap: '1rem' }}>
          <History size={48} style={{ color: '#f59e0b' }} />
          <div>
            <div style={{ fontWeight: 700, color: 'white' }}>View History</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Check past records</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
