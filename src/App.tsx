
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/AppSidebar';
import Index from './pages/Index';
import Library from './pages/Library';
import PlanClass from './pages/PlanClass';
import Teaching from './pages/Teaching';
import Timer from './pages/Timer';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Store from './pages/Store';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1">
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/plan" element={<PlanClass />} />
                  <Route path="/teaching/:classId" element={<Teaching />} />
                  <Route path="/timer" element={<Timer />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
