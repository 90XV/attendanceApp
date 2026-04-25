# AttnLog - Staff Attendance Application

AttnLog is a native desktop application designed for secure, fast, and reliable staff attendance tracking. Built with Electron, React, and Vite, it provides a seamless user experience tailored for administrative clerks to log teacher check-ins and check-outs using encrypted QR codes.

## Features
- **Modern UI/UX**: An Apple-inspired, accessible interface featuring Light and Dark modes.
- **Secure QR Scanning**: Teachers are assigned unique QR codes encrypted with AES-256. 
- **Local-First Database**: Runs on a lightning-fast local SQLite database (`better-sqlite3`), meaning no internet connection is required for day-to-day operations.
- **Session Tracking**: Support for multiple login contexts (Morning In/Out, Afternoon In/Out, Unplanned, School Matter).
- **Exporting**: Searchable history logs with CSV export capabilities.

## Tech Stack
- **Framework**: Electron (via `electron-vite`)
- **Frontend**: React 19, TypeScript, Lucide Icons
- **Backend/Storage**: Node.js, `better-sqlite3`, `crypto-js`
- **Scanner Integration**: `html5-qrcode`

## Development

To start the development server:
```bash
npm install
npm run dev
```

To build the production Windows installer:
```bash
npm run build
```

## Security Note
The application uses local encryption for QR codes. In a production environment, ensure that the secret keys in the source code are migrated to secure environment variables or a secure key management system.
