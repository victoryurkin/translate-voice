import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './middleware/app.tsx';
import '@translate-voice/design-tokens';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
