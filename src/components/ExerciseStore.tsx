
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CleanExerciseStoreHeader } from './store/CleanExerciseStoreHeader';
import { CleanExerciseStoreGrid } from './store/CleanExerciseStoreGrid';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useExerciseStore } from '@/hooks/useExerciseStore';
import { useStoreIntegration } from '@/hooks/useStoreIntegration';
import { useToast } from '@/hooks/use-toast';

export const ExerciseStore = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const {
    storeExercises,
    userLibrary,
    loading,
    refetch
  } = useExerciseStore();

  const { addStoreExerciseToLibrary } = useStoreIntegration();

  const handleAddToLibrary = async (exerciseId: string) => {
    try {
      const exercise = storeExercises.find(ex => ex.id === exerciseId);
      if (!exercise) {
        throw new Error('Exercise not found');
      }

      await addStoreExerciseToLibrary(exercise);
      await refetch(); // Refresh to show updated library
      
    } catch (error) {
      console.error('Error adding exercise to library:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise to library. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
            <p className="text-sage-600">Please sign in to access the exercise store.</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sage-600">Loading store...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <CleanExerciseStoreHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="p-4">
        <CleanExerciseStoreGrid
          exercises={storeExercises}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onAddToLibrary={handleAddToLibrary}
          userLibrary={userLibrary}
        />
      </div>

      <BottomNavigation />
    </div>
  );
};
