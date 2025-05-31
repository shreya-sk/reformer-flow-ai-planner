
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { ClassHeader } from '@/components/plan-class/ClassHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { toast } from '@/hooks/use-toast';
import { AuthPage } from '@/components/AuthPage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { ClassBuilder } from '@/components/ClassBuilder';

const PlanClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveClassPlan, savedClasses } = useClassPlans();
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  const { exercises, updateUserExercise, customizeSystemExercise } = useExercises();
  const {
    currentClass,
    addExercise,
    removeExercise,
    updateClassName,
    updateClassDuration,
    updateClassNotes,
    updateClassImage,
    addCallout,
    clearClassPlan,
    reorderExercises
  } = usePersistedClassPlan();
  
  const [activeTab, setActiveTab] = useState('builder');
  const [isTeachingMode, setIsTeachingMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const shortlistedExercises = exercises.filter(ex => 
    preferences.favoriteExercises?.includes(ex.id)
  );

  if (!user) {
    return <AuthPage />;
  }
  
  if (isTeachingMode) {
    return (
      <ClassTeachingMode 
        classPlan={currentClass}
        onClose={() => setIsTeachingMode(false)}
      />
    );
  }

  const handleSaveClass = async () => {
    const realExercises = currentClass.exercises.filter(ex => ex.category !== 'callout');
    if (realExercises.length === 0) {
      toast({
        title: "Cannot save empty class",
        description: "Add some exercises to your class before saving.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const classToSave = {
        ...currentClass,
        name: currentClass.name || `Class ${Date.now()}`,
      };
      
      console.log('💾 Starting save process for:', classToSave.name);
      await saveClassPlan(classToSave);
      
      setSaveSuccess(true);
      toast({
        title: "Class saved!",
        description: "Redirecting to My Classes...",
      });
      
      // Show success state for 2 seconds before redirecting
      setTimeout(() => {
        clearClassPlan();
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setIsSaving(false);
      toast({
        title: "Save failed",
        description: "Could not save class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddExercise = () => {
    navigate('/library');
  };

  const handleAddCallout = (name: string, position: number) => {
    console.log('PlanClass handleAddCallout called with name:', name, 'position:', position);
    addCallout(name, position);
  };

  const handleUpdateCallout = (calloutId: string, newName: string) => {
    console.log('PlanClass handleUpdateCallout called:', calloutId, newName);
    const updatedExercises = currentClass.exercises.map(exercise => 
      exercise.id === calloutId && exercise.category === 'callout'
        ? { ...exercise, name: newName }
        : exercise
    );
    reorderExercises(updatedExercises);
  };

  const handleDeleteCallout = (calloutId: string) => {
    console.log('PlanClass handleDeleteCallout called:', calloutId);
    const updatedExercises = currentClass.exercises.filter(exercise => 
      !(exercise.id === calloutId && exercise.category === 'callout')
    );
    reorderExercises(updatedExercises);
  };

  const addToShortlist = (exercise: any) => {
    toggleFavoriteExercise(exercise.id);
  };

  const removeFromShortlist = (exerciseId: string) => {
    toggleFavoriteExercise(exerciseId);
  };

  const addShortlistedToClass = (exercise: any) => {
    console.log('Adding shortlisted exercise to class:', exercise);
    addExercise(exercise);
  };

  // Improved exercise update handler that persists changes correctly
  const handleUpdateExercise = async (updatedExercise: any) => {
    try {
      // Save to database based on exercise type
      if (updatedExercise.isSystemExercise) {
        await customizeSystemExercise(updatedExercise.id, {
          custom_name: updatedExercise.name,
          custom_duration: updatedExercise.duration,
          custom_springs: updatedExercise.springs,
          custom_cues: updatedExercise.cues,
          custom_notes: updatedExercise.notes,
          custom_difficulty: updatedExercise.difficulty,
          custom_setup: updatedExercise.setup,
          custom_reps_or_duration: updatedExercise.repsOrDuration,
          custom_tempo: updatedExercise.tempo,
          custom_target_areas: updatedExercise.targetAreas,
          custom_breathing_cues: updatedExercise.breathingCues,
          custom_teaching_focus: updatedExercise.teachingFocus,
          custom_modifications: updatedExercise.modifications,
        });
      } else {
        await updateUserExercise(updatedExercise.id, updatedExercise);
      }

      // Update local class state
      const updatedExercises = currentClass.exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      );
      reorderExercises(updatedExercises);

      toast({
        title: "Exercise updated",
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast({
        title: "Update failed",
        description: "Could not save exercise changes.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-50 via-white to-sage-100'} pb-20`}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-sage-200 p-3 sm:p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="text-sage-600 hover:text-sage-800 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold text-sage-800">Class Builder</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveClass}
              disabled={isSaving}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300 ${
                saveSuccess 
                  ? 'bg-green-500 text-white' 
                  : isSaving 
                    ? 'bg-sage-400 text-white' 
                    : 'bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white'
              }`}
            >
              {saveSuccess ? (
                <>✓ Saved!</>
              ) : isSaving ? (
                <>⟳ Saving...</>
              ) : (
                'Save Class'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-3 pt-0">
        <Tabs defaultValue="builder" value={activeTab} onValueChange={setActiveTab} className="rounded-xl overflow-hidden shadow-md bg-white/80 backdrop-blur-sm">
          <TabsList className="w-full grid grid-cols-2 bg-sage-50/70 p-1">
            <TabsTrigger value="builder" className="rounded-lg data-[state=active]:bg-sage-100 data-[state=active]:text-sage-800">
              Builder
            </TabsTrigger>
            <TabsTrigger value="shortlist" className="rounded-lg data-[state=active]:bg-sage-100 data-[state=active]:text-sage-800">
              Favorites ({shortlistedExercises.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="py-0">
            <ClassBuilder
              currentClass={currentClass}
              onRemoveExercise={removeExercise}
              onReorderExercises={reorderExercises}
              onUpdateExercise={handleUpdateExercise}
              onAddExercise={handleAddExercise}
              onAddCallout={handleAddCallout}
              onUpdateClassName={updateClassName}
              onSaveClass={handleSaveClass}
            />
          </TabsContent>
          
          <TabsContent value="shortlist" className="py-2">
            <div className="p-3">
              <h2 className="text-lg font-medium text-sage-800 mb-3">Favorite Exercises</h2>
              {shortlistedExercises.length === 0 ? (
                <div className="text-center py-6 bg-sage-50 rounded-xl">
                  <p className="text-sage-600">No favorite exercises yet.</p>
                  <p className="text-sm text-sage-500 mt-2">
                    Add exercises to your favorites from the exercise library.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shortlistedExercises.map(exercise => (
                    <div 
                      key={exercise.id} 
                      className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-sage-100"
                    >
                      <div>
                        <h3 className="font-medium text-sage-800">{exercise.name}</h3>
                        <p className="text-sm text-sage-600">
                          {exercise.duration} min • {exercise.category}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => addShortlistedToClass(exercise)}
                          className="px-3 py-1 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 text-sm"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => removeFromShortlist(exercise.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default PlanClass;
