// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import global styles
import './assets/styles/global.css';
import './assets/styles/variables.css';

// Optional: Import and configure i18n for internationalization
// import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);