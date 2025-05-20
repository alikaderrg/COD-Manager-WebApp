import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Make sure Tailwind or your global styles are imported

// Create a simple error handler for debugging
window.addEventListener('error', function(e) {
  console.log('Global error handler:', e.message, e.filename, e.lineno, e.colno, e.error);
});

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
