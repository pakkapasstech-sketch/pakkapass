import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';

if (import.meta.env.VITE_USE_MOCK !== 'false') {
  const { setupMocks } = await import('./api/setupMocks');
  setupMocks();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
