
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { usePWA } from '@/hooks/usePWA';
import { backgroundSync, processSyncQueue } from '@/utils/backgroundSync';
import { AuthPage } from '@/components/AuthPage';
import Index from './pages/Index';
import Library from './pages/Library';
import PlanClass from './pages/PlanClass';
import Teaching from './pages/Teaching';
import Timer from './pages/Timer';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import Store from './pages/Store';
import ClassPlans from './pages/ClassPlans';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry if offline
        if (!navigator.onLine) return false;
        return failureCount < 3;
      },
    },
  },
});

function AppContent() {
  const { isOnline } = usePWA();

  useEffect(() => {
    // Initialize background sync
    backgroundSync.init().catch(console.error);

    // Process sync queue when coming online
    if (isOnline) {
      processSyncQueue().catch(console.error);
    }

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SYNC_DATA') {
          processSyncQueue().catch(console.error);
        }
      });
    }
  }, [isOnline]);

  return (
    <div className="min-h-screen w-full">
      <main className="w-full">
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/plan" element={<PlanClass />} />
          <Route path="/class-plans" element={<ClassPlans />} />
          <Route path="/teaching/:classId" element={<Teaching />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/store" element={<Store />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
