import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Set up global fetch for API requests with logging
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const timestamp = new Date().toLocaleTimeString();
  const method = init?.method || 'GET';
  let url = typeof input === 'string' ? input : input.url;
  
  // Convert relative API URLs to absolute URLs pointing to backend
  if (url.startsWith('/api/') || url.startsWith('api/')) {
    const backendPort = '3001';
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    url = `${protocol}//${hostname}:${backendPort}${url.startsWith('/') ? url : '/' + url}`;
    console.log(`🔄 [${timestamp}] Redirecting API call to backend: ${url}`);
  }
  
  console.log(`🟡 [${timestamp}] Frontend ${method} ${url}`);
  
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };
  
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
    console.log(`🔑 [${timestamp}] Using auth token: ${token.substring(0, 20)}...`);
  }

  // Log request body if present
  if (init?.body) {
    console.log(`📝 [${timestamp}] Request body:`, JSON.stringify(JSON.parse(init.body as string)).substring(0, 200));
  }

  try {
    const response = await originalFetch(url, {
      ...init,
      headers,
    });
    
    console.log(`🟢 [${timestamp}] Response ${response.status} ${response.statusText}`);
    
    // Log response for debugging
    const responseClone = response.clone();
    responseClone.text().then(text => {
      if (text) {
        console.log(`📋 [${timestamp}] Response data:`, text.substring(0, 200) + (text.length > 200 ? '...' : ''));
      }
    }).catch(() => {});
    
    return response;
  } catch (error) {
    console.error(`🔴 [${timestamp}] Fetch error:`, error);
    throw error;
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);