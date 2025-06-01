
import React from 'react';
import { NavigationButtons } from '@/components/NavigationButtons';
import { BottomNavigation } from '@/components/BottomNavigation';
import { StoreHighlights } from '@/components/StoreHighlights';
import { ProfileButton } from '@/components/ProfileButton';
import { Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      {/* Simple Homepage Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-sage-200/50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sage-700 to-sage-900 bg-clip-text text-transparent">
            Reformer Flow
          </h1>
        </div>
        
        <ProfileButton />
      </header>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sage-400 to-sage-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Plan. Teach. Perfect.
          </h1>
          <p className="text-xl text-sage-100 max-w-2xl mx-auto">
            The ultimate Pilates reformer class planning and teaching companion
          </p>
        </div>
      </div>

      {/* Store Highlights Section */}
      <StoreHighlights />

      {/* Navigation Buttons */}
      <div className="px-6 pb-6">
        <NavigationButtons />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
