import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { registerServiceWorker } from './utils/service-worker.js';

// Register service worker for offline support and caching
registerServiceWorker();

// Debug: Log environment variables
console.log('Environment check:', {
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
  VITE_FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID ? 'Set' : 'Missing',
  NODE_ENV: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
