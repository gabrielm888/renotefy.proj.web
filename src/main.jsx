import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './providers/ThemeProvider';
import App from './App';

// Styles
import './index.css';

// Create root and render app
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Enable smooth scrolling for the entire app
if (typeof window !== 'undefined') {
  // Smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
