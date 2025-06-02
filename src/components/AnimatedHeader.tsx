
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const AnimatedHeader = () => {
  const { user } = useAuth();
  
  const firstName = user?.email?.split('@')[0] || 'there';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-sage-400/30 via-sage-500/40 to-sage-600/30 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-sage-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-8 right-8 w-16 h-16 bg-sage-400/40 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-4 left-12 w-20 h-20 bg-sage-200/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[slide-in-right_8s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-sage-800 mb-2 animate-[fade-in_1s_ease-out_0.5s_both]">
            Welcome back, {firstName}! ✨
          </h1>
          <p className="text-sage-600 text-lg animate-[fade-in_1s_ease-out_1s_both]">
            Ready to create amazing Pilates classes?
          </p>
        </div>
        
        {/* Floating accent elements */}
        <div className="absolute top-2 right-4 w-2 h-2 bg-sage-500/60 rounded-full animate-ping"></div>
        <div className="absolute bottom-6 right-8 w-1 h-1 bg-sage-400/80 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-3xl border border-sage-300/30 animate-pulse"></div>
    </div>
  );
};
