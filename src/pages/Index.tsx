
import React from 'react';
import { Header } from '@/components/Header';
import { NavigationButtons } from '@/components/NavigationButtons';
import { BottomNavigation } from '@/components/BottomNavigation';
import { StoreHighlights } from '@/components/StoreHighlights';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      <Header />
      
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
