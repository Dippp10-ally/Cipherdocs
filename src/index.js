import React from 'react';
import { createRoot } from 'react-dom/client';
import process from 'process';
import { Buffer } from 'buffer';
import './index.css';
import App from './App.tsx';

window.Buffer = Buffer;
window.process = process;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 