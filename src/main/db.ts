import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: any;

export function initDb() {
  const dbPath = path.join(app.getPath('userData'), 'attendance.db');
  db = new Database(dbPath);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      nickname TEXT NOT NULL,
      description TEXT,
      qrCode TEXT UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacherId INTEGER NOT NULL,
      type TEXT NOT NULL, -- morning_in, morning_out, afternoon_in, afternoon_out, unplanned, school_matter
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacherId) REFERENCES teachers(id)
    );
  `);
}

export function addTeacher(teacher: { firstName: string, lastName: string, nickname: string, description: string, qrCode: string }) {
  const stmt = db.prepare('INSERT INTO teachers (firstName, lastName, nickname, description, qrCode) VALUES (?, ?, ?, ?, ?)');
  return stmt.run(teacher.firstName, teacher.lastName, teacher.nickname, teacher.description, teacher.qrCode);
}

export function getTeachers() {
  return db.prepare('SELECT * FROM teachers').all();
}

export function updateTeacher(id: number, teacher: { firstName: string, lastName: string, nickname: string, description: string }) {
  const stmt = db.prepare('UPDATE teachers SET firstName = ?, lastName = ?, nickname = ?, description = ? WHERE id = ?');
  return stmt.run(teacher.firstName, teacher.lastName, teacher.nickname, teacher.description, id);
}

export function deleteTeacher(id: number) {
  db.prepare('DELETE FROM logs WHERE teacherId = ?').run(id);
  return db.prepare('DELETE FROM teachers WHERE id = ?').run(id);
}

export function addLog(teacherId: number, type: string) {
  const stmt = db.prepare('INSERT INTO logs (teacherId, type) VALUES (?, ?)');
  return stmt.run(teacherId, type);
}

export function getLogs() {
  return db.prepare(`
    SELECT logs.*, teachers.firstName, teachers.lastName, teachers.nickname 
    FROM logs 
    JOIN teachers ON logs.teacherId = teachers.id 
    ORDER BY timestamp DESC
  `).all();
}

export function getTeacherByQRCode(qrCode: string) {
  return db.prepare('SELECT * FROM teachers WHERE qrCode = ?').get(qrCode);
}
