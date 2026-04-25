import React, { useState, useEffect } from 'react';
import { History, Search, Download, Clock } from 'lucide-react';

const HistoryLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const data = await (window as any).electronAPI.invoke('get-logs');
    setLogs(data);
  };

  const getBadgeClass = (type: string) => {
    if (type.includes('morning')) return 'badge-morning';
    if (type.includes('afternoon')) return 'badge-afternoon';
    if (type === 'unplanned') return 'badge-urgent';
    return 'badge-school';
  };

  const filteredLogs = logs.filter(log => 
    `${log.firstName} ${log.lastName} ${log.nickname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Teacher', 'Nickname', 'Session Type'];
    const rows = filteredLogs.map(log => {
      const date = new Date(log.timestamp);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        `${log.firstName} ${log.lastName}`,
        log.nickname,
        log.type.replace('_', ' ')
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Attendance History</h1>
        <button className="btn btn-secondary" onClick={exportToCSV}>
          <Download size={20} />
          Export to CSV
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            className="search-input"
            style={{ paddingLeft: '3rem', width: '100%', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid transparent', color: 'var(--text-primary)', padding: '0.875rem 0.875rem 0.875rem 3rem' }}
            placeholder="Search by teacher name or nickname..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Teacher</th>
              <th>Nickname</th>
              <th>Session Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{log.firstName} {log.lastName}</td>
                <td>"{log.nickname}"</td>
                <td>
                  <span className={`badge ${getBadgeClass(log.type)}`}>
                    {log.type.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryLogs;
