
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseStoreHeader } from './store/ExerciseStoreHeader';
import { ExerciseStoreBundles } from './store/ExerciseStoreBundles';
import { ExerciseStoreGrid } from './store/ExerciseStoreGrid';
import { ExerciseStoreCart } from './store/ExerciseStoreCart';
import { useExerciseStore } from '@/hooks/useExerciseStore';

export const ExerciseStore = () => {
  const { user } = useAuth();
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
  };

  const handleRemoveFromCart = (exerciseId: string) => {
    setCartItems(prev => prev.filter(id => id !== exerciseId));
  };

  const handleAddToLibrary = async (exerciseIds: string[]) => {
    try {
      await Promise.all(exerciseIds.map(id => addToUserLibrary(id)));
      setCartItems([]);
      setShowCart(false);
    } catch (error) {
      console.error('Error adding exercises to library:', error);
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
        <p className="text-sage-600">Loading store...</p>
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

      <div className="p-4 space-y-6">
        <ExerciseStoreBundles
          bundles={bundles}
          onAddBundle={addBundleToLibrary}
          userLibrary={userLibrary}
        />

        <ExerciseStoreGrid
          exercises={storeExercises}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onAddToCart={handleAddToCart}
          onAddToLibrary={addToUserLibrary}
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
