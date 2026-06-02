import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fenice/shared/styles/tokens.css';
import '@fenice/shared/styles/components.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
