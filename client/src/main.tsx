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

// Set up global fetch for API requests
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };
  
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return originalFetch(input, {
    ...init,
    headers,
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);