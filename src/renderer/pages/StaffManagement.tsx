import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, QrCode, Download } from 'lucide-react';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'attendance-secret-key'; // In production, this should be more secure

const StaffManagement = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    description: ''
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const data = await window.electronAPI.invoke('get-teachers');
    setTeachers(data);
  };

  const handleOpenModal = (teacher: any = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        nickname: teacher.nickname,
        description: teacher.description || ''
      });
    } else {
      setEditingTeacher(null);
      setFormData({ firstName: '', lastName: '', nickname: '', description: '' });
    }
    setIsModalOpen(true);
    setQrCodeUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTeacher) {
        await window.electronAPI.invoke('update-teacher', editingTeacher.id, formData);
      } else {
        const qrData = JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          nickname: formData.nickname,
          timestamp: Date.now()
        });
        const encryptedData = CryptoJS.AES.encrypt(qrData, ENCRYPTION_KEY).toString();
        
        await window.electronAPI.invoke('add-teacher', {
          ...formData,
          qrCode: encryptedData
        });
      }
      
      setIsModalOpen(false);
      fetchTeachers();
    } catch (err: any) {
      alert("Failed to save teacher: " + err.message);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this teacher? This will also delete their logs.')) {
      await window.electronAPI.invoke('delete-teacher', id);
      fetchTeachers();
    }
  };

  const generateQR = async (teacher: any) => {
    try {
      const url = await QRCode.toDataURL(teacher.qrCode, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
      setEditingTeacher(teacher);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQR = () => {
    if (!qrCodeUrl || !editingTeacher) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR_${editingTeacher.nickname.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Staff Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <UserPlus size={20} />
          Add Teacher
        </button>
      </div>

      <div className="staff-grid">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="card staff-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>"{teacher.nickname}"</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => handleOpenModal(teacher)} style={{ padding: '0.5rem' }}>
                  <Edit2 size={16} />
                </button>
                <button className="btn btn-secondary" onClick={() => handleDelete(teacher.id)} style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p style={{ fontSize: '0.875rem', flex: 1 }}>{teacher.description || 'No description provided.'}</p>
            
            <button className="btn btn-secondary" onClick={() => generateQR(teacher)} style={{ width: '100%', justifyContent: 'center' }}>
              <QrCode size={18} />
              View QR Code
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 100 
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="input-group">
                <label>First Name</label>
                <input 
                  required 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input 
                  required 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Nickname</label>
                <input 
                  required 
                  value={formData.nickname}
                  onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  rows={3} 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingTeacher ? 'Save Changes' : 'Add Teacher'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrCodeUrl && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 100 
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <h2>Teacher QR Code</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{editingTeacher?.firstName} {editingTeacher?.lastName}</p>
            <div className="qr-preview">
              <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={downloadQR} style={{ flex: 1 }}>
                <Download size={20} />
                Download PNG
              </button>
              <button className="btn btn-secondary" onClick={() => setQrCodeUrl(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
