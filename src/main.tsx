import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeTokenRefresh } from './utils/tokenRefresh';

// Initialize token refresh interceptor
initializeTokenRefresh();

createRoot(document.getElementById("root")!).render(<App />);
