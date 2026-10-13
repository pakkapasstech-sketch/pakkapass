import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './App.jsx';



// After a new version is deployed, a tab that was already open still points at the old
// page files, which no longer exist, so opening another section fails. Load the new
// version instead. The timestamp stops a reload loop if the file is really missing.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'pp:lastChunkReload';
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(KEY)) || 0;
  } catch {
    last = 0;
  }
  if (Date.now() - last < 30000) return;
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // storage unavailable: still reload once for this event
  }
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
