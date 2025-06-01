
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProfileSidebar } from '@/components/ProfileSidebar';

export const ProfileButton = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex items-center justify-center rounded-full hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
      >
        <Avatar className="h-10 w-10 border-2 border-sage-200 hover:border-sage-300 transition-colors">
          <AvatarFallback className="bg-sage-600 text-white font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </button>

      <ProfileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </>
  );
};
