import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Ensure dark mode is applied by default to match the in-IDE preview
document.documentElement.classList.add('dark');

// Create root and render app
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
