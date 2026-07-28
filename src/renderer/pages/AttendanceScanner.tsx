import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'attendance-secret-key';

const AttendanceScanner = () => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const [sessionType, setSessionType] = useState('morning_in');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    // Prevent double scanning within 5 seconds
    const now = Date.now();
    if (now - lastScanTime < 5000) return;

    try {
      // First try directly matching teacher by QR code in database
      let teacher = await window.electronAPI.invoke('get-teacher-by-qr', decodedText);

      // If not found directly, attempt AES decryption
      if (!teacher) {
        try {
          const bytes = CryptoJS.AES.decrypt(decodedText, ENCRYPTION_KEY);
          const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
          if (decryptedStr) {
            const decryptedData = JSON.parse(decryptedStr);
            const allTeachers = await window.electronAPI.invoke('get-teachers');
            teacher = allTeachers.find((t: any) => 
              t.nickname === decryptedData.nickname && t.firstName === decryptedData.firstName
            );
          }
        } catch (decryptErr) {
          console.warn("Decryption attempt failed:", decryptErr);
        }
      }

      if (teacher) {
        await window.electronAPI.invoke('add-log', teacher.id, sessionType);
        setScanResult({
          name: `${teacher.firstName} ${teacher.lastName}`,
          nickname: teacher.nickname,
          time: new Date().toLocaleTimeString(),
          type: sessionType
        });
        setError(null);
        setLastScanTime(now);
      } else {
        setError("Invalid QR Code: Teacher not found in database.");
      }
    } catch (err: any) {
      console.error("Scan error:", err);
      setError("Failed to process scan: " + (err.message || "Unknown error"));
    }
  };

  const onScanFailure = (error: any) => {
    // console.warn(`Code scan error = ${error}`);
  };

  const sessionTypes = [
    { id: 'morning_in', label: 'Morning Log In' },
    { id: 'morning_out', label: 'Morning Log Out' },
    { id: 'afternoon_in', label: 'Afternoon Log In' },
    { id: 'afternoon_out', label: 'Afternoon Log Out' },
    { id: 'unplanned', label: 'Unplanned/Urgent' },
    { id: 'school_matter', label: 'School Matter' }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Scan Attendance</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Point the teacher's QR code towards the camera to log their attendance.
      </p>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>Select Session Type</label>
          <select 
            value={sessionType} 
            onChange={(e) => setSessionType(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            {sessionTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="scanner-container">
        <div id="reader"></div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {scanResult && (
          <div className="card" style={{ borderLeft: '4px solid var(--success)', animation: 'slideIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--success)' }}>
                <CheckCircle size={32} />
              </div>
              <div>
                <h3 style={{ color: 'var(--success)' }}>Scan Successful!</h3>
                <p><strong>{scanResult.name}</strong> ({scanResult.nickname}) logged as <strong>{sessionType.replace('_', ' ')}</strong> at {scanResult.time}.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="card" style={{ borderLeft: '4px solid var(--danger)', animation: 'shake 0.4s ease-in-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--danger)' }}>
                <AlertCircle size={32} />
              </div>
              <div>
                <h3 style={{ color: 'var(--danger)' }}>Scan Failed</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AttendanceScanner;
