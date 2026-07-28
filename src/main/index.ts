import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import * as db from './db';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
  });

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  db.initDb();
  createWindow();

  // IPC Handlers
  ipcMain.handle('get-teachers', () => db.getTeachers());
  ipcMain.handle('add-teacher', (_: any, teacher: any) => db.addTeacher(teacher));
  ipcMain.handle('update-teacher', (_: any, id: number, teacher: any) => db.updateTeacher(id, teacher));
  ipcMain.handle('delete-teacher', (_: any, id: number) => db.deleteTeacher(id));
  ipcMain.handle('get-logs', () => db.getLogs());
  ipcMain.handle('add-log', (_: any, teacherId: number, type: string) => db.addLog(teacherId, type));
  ipcMain.handle('get-teacher-by-qr', (_: any, qrCode: string) => db.getTeacherByQRCode(qrCode));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
