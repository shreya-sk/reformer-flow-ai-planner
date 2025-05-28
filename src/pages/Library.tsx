
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, X } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/AuthPage';

const Library = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [cartExercises, setCartExercises] = useState<Exercise[]>([]);
  const [showCart, setShowCart] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 flex items-center justify-center">
        <div className="text-sage-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const addToCart = (exercise: Exercise) => {
    setCartExercises(prev => [...prev, { ...exercise, id: `${exercise.id}-${Date.now()}` }]);
  };

  const removeFromCart = (exerciseId: string) => {
    setCartExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const startNewClass = () => {
    if (cartExercises.length === 0) {
      navigate('/plan');
    } else {
      // Navigate to plan page with exercises in state
      navigate('/plan', { state: { cartExercises } });
    }
  };

  const clearCart = () => {
    setCartExercises([]);
    setShowCart(false);
  };

  const totalDuration = cartExercises.reduce((sum, ex) => sum + ex.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-200 px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-sage-600 hover:text-sage-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className="h-6 w-px bg-sage-300" />
            
            <h1 className="text-xl font-semibold text-sage-800">Exercise Library</h1>
          </div>

          <div className="flex items-center gap-4">
            {cartExercises.length > 0 && (
              <Button
                onClick={() => setShowCart(!showCart)}
                variant="outline"
                size="sm"
                className="relative border-sage-300"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                <Badge className="ml-2 bg-sage-600 text-white">
                  {cartExercises.length}
                </Badge>
              </Button>
            )}

            <Button 
              onClick={startNewClass}
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
            >
              {cartExercises.length > 0 ? 'Plan with Cart' : 'New Class'}
            </Button>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      {showCart && cartExercises.length > 0 && (
        <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-sage-200 shadow-lg z-30 overflow-y-auto">
          <div className="p-4 border-b border-sage-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sage-800">Exercise Cart</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCart(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {cartExercises.map((exercise, index) => (
              <div key={exercise.id} className="flex items-center gap-3 p-2 bg-sage-50 rounded border">
                <div className="w-6 h-6 bg-sage-200 rounded-full flex items-center justify-center text-xs font-medium text-sage-700">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sage-800 text-sm">{exercise.name}</div>
                  <div className="text-xs text-sage-600">{exercise.duration}min</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(exercise.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            <div className="pt-3 border-t border-sage-200">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sage-800">Total: {totalDuration}min</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 border-red-300"
                >
                  Clear All
                </Button>
              </div>
              <Button
                onClick={startNewClass}
                className="w-full bg-sage-600 hover:bg-sage-700"
              >
                Plan Class
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-[calc(100vh-85px)]">
        <ExerciseLibrary onAddExercise={addToCart} />
        
        {/* Exercise suggestions or tips */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-sage-500" />
            </div>
            <h3 className="text-xl font-semibold text-sage-700 mb-3">Build Your Class</h3>
            <p className="text-sage-500 text-sm leading-relaxed mb-4">
              Browse the exercise library and add movements to your cart. When you're ready, click "Plan Class" to organize them into a complete session.
            </p>
            {cartExercises.length > 0 && (
              <div className="bg-sage-50 rounded-lg p-4 border border-sage-200">
                <p className="text-sage-700 font-medium">
                  {cartExercises.length} exercises selected ({totalDuration} minutes)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Library;
