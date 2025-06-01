
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseStoreHeader } from './store/ExerciseStoreHeader';
import { ExerciseStoreBundles } from './store/ExerciseStoreBundles';
import { ExerciseStoreGrid } from './store/ExerciseStoreGrid';
import { ExerciseStoreCart } from './store/ExerciseStoreCart';
import { useExerciseStore } from '@/hooks/useExerciseStore';
import { useToast } from '@/hooks/use-toast';

export const ExerciseStore = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);

  const {
    storeExercises,
    bundles,
    userLibrary,
    loading,
    addToUserLibrary,
    addBundleToLibrary,
    removeFromUserLibrary
  } = useExerciseStore();

  const handleAddToCart = (exerciseId: string) => {
    setCartItems(prev => [...prev, exerciseId]);
    toast({
      title: "Added to cart",
      description: "Exercise added to your cart successfully.",
    });
  };

  const handleRemoveFromCart = (exerciseId: string) => {
    setCartItems(prev => prev.filter(id => id !== exerciseId));
  };

  const handleAddToLibrary = async (exerciseIds: string[]) => {
    try {
      await Promise.all(exerciseIds.map(id => addToUserLibrary(id)));
      setCartItems([]);
      setShowCart(false);
      toast({
        title: "Success!",
        description: `${exerciseIds.length} exercise(s) added to your library.`,
      });
    } catch (error) {
      console.error('Error adding exercises to library:', error);
      toast({
        title: "Error",
        description: "Failed to add exercises to library. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSingleAddToLibrary = async (exerciseId: string) => {
    try {
      await addToUserLibrary(exerciseId);
      toast({
        title: "Added to library!",
        description: "Exercise added to your library successfully.",
      });
    } catch (error) {
      console.error('Error adding exercise to library:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise to library. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddBundle = async (bundleId: string) => {
    try {
      await addBundleToLibrary(bundleId);
      toast({
        title: "Bundle added!",
        description: "All exercises from the bundle have been added to your library.",
      });
    } catch (error) {
      console.error('Error adding bundle to library:', error);
      toast({
        title: "Error",
        description: "Failed to add bundle to library. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sage-600">Please sign in to access the exercise store.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full"></div>
        <p className="text-sage-600 ml-3">Loading store...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      <ExerciseStoreHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        cartCount={cartItems.length}
        onCartClick={() => setShowCart(true)}
      />

      <div className="p-4 space-y-6 pb-20">
        <ExerciseStoreBundles
          bundles={bundles}
          exercises={storeExercises}
          onAddBundle={handleAddBundle}
          onAddExercise={handleSingleAddToLibrary}
          userLibrary={userLibrary}
        />

        <ExerciseStoreGrid
          exercises={storeExercises}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onAddToCart={handleAddToCart}
          onAddToLibrary={handleSingleAddToLibrary}
          cartItems={cartItems}
          userLibrary={userLibrary}
        />
      </div>

      {showCart && (
        <ExerciseStoreCart
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cartItems={cartItems}
          exercises={storeExercises}
          onRemoveItem={handleRemoveFromCart}
          onAddToLibrary={handleAddToLibrary}
        />
      )}
    </div>
  );
};
