
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ProfileButton } from '@/components/ProfileButton';
import { AuthPage } from '@/components/AuthPage';
import { MobileOptimizedExerciseLibrary } from '@/components/MobileOptimizedExerciseLibrary';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';
import { InteractiveExerciseForm } from '@/components/InteractiveExerciseForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

const Library = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { createUserExercise, updateUserExercise } = useExercises();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!user) {
    return <AuthPage />;
  }

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleCreateExercise = async (exercise: Exercise) => {
    try {
      await createUserExercise(exercise);
      toast({
        title: "Exercise created!",
        description: `"${exercise.name}" has been added to your library.`,
      });
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast({
        title: "Creation failed",
        description: "Could not create the exercise. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExercise = async (exercise: Exercise) => {
    try {
      await updateUserExercise(exercise.id, exercise);
      toast({
        title: "Exercise updated!",
        description: `"${exercise.name}" has been updated.`,
      });
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast({
        title: "Update failed",
        description: "Could not update the exercise. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-sage-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="text-sage-600 hover:text-sage-800 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold text-sage-800">Exercise Library</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl px-4 py-2 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
            <ProfileButton />
          </div>
        </div>
      </div>

      {/* Exercise Library */}
      <div className="pt-4">
        <MobileOptimizedExerciseLibrary 
          onExerciseSelect={handleExerciseSelect}
        />
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedExercise(null);
        }}
        onAddToClass={() => {}}
        onSave={handleUpdateExercise}
      />

      {/* Interactive Exercise Form */}
      <InteractiveExerciseForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={handleCreateExercise}
      />

      <BottomNavigation />
    </div>
  );
};

export default Library;
