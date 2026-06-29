import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#1e293b',
          color: '#f8fafc',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#059669', secondary: '#ecfdf5' } },
        error: { iconTheme: { primary: '#dc2626', secondary: '#fef2f2' } },
      }}
    />
  </React.StrictMode>
);
