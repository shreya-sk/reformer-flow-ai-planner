
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { AuthPage } from '@/components/AuthPage';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { ClassBuilder } from '@/components/ClassBuilder';
import { Header } from '@/components/Header';
import { ClassPlanManager } from '@/components/ClassPlanManager';
import { Exercise, ClassPlan } from '@/types/reformer';

const Index = () => {
  const { user, loading } = useAuth();
  const { savedClasses, saveClassPlan, deleteClassPlan, updateClassPlan } = useClassPlans();
  
  const [currentClass, setCurrentClass] = useState<ClassPlan>({
    id: '',
    name: 'New Class',
    exercises: [],
    totalDuration: 0,
    createdAt: new Date(),
    notes: '',
  });

  const [showClassManager, setShowClassManager] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 flex items-center justify-center">
        <div className="text-sage-600">Loading...</div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  const addExerciseToClass = (exercise: Exercise) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...exercise, id: `${exercise.id}-${Date.now()}` }],
      totalDuration: prev.totalDuration + exercise.duration,
    }));
  };

  const removeExerciseFromClass = (exerciseId: string) => {
    const exercise = currentClass.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setCurrentClass(prev => ({
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
        totalDuration: prev.totalDuration - exercise.duration,
      }));
    }
  };

  const reorderExercises = (exercises: Exercise[]) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises,
    }));
  };

  const updateExerciseInClass = (updatedExercise: Exercise) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    }));
  };

  const handleSaveClass = async () => {
    if (currentClass.exercises.length === 0) return;
    
    const classToSave = {
      ...currentClass,
      name: currentClass.name || `Class ${savedClasses.length + 1}`,
    };
    
    await saveClassPlan(classToSave);
    
    // Reset current class after saving
    setCurrentClass({
      id: '',
      name: 'New Class',
      exercises: [],
      totalDuration: 0,
      createdAt: new Date(),
      notes: '',
    });
  };

  const loadClass = (classPlan: ClassPlan) => {
    setCurrentClass(classPlan);
    setShowClassManager(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      <Header 
        currentClass={currentClass}
        onSaveClass={handleSaveClass}
        onUpdateClassName={(name) => setCurrentClass(prev => ({ ...prev, name }))}
        onToggleClassManager={() => setShowClassManager(!showClassManager)}
        showClassManager={showClassManager}
      />
      
      <div className="flex h-[calc(100vh-85px)]">
        {showClassManager ? (
          <div className="w-96 bg-white border-r border-sage-200 overflow-y-auto">
            <div className="p-6">
              <ClassPlanManager
                currentClass={currentClass}
                savedClasses={savedClasses}
                onUpdateClassName={(name) => setCurrentClass(prev => ({ ...prev, name }))}
                onUpdateClassNotes={(notes) => setCurrentClass(prev => ({ ...prev, notes }))}
                onDeleteClass={deleteClassPlan}
                onLoadClass={loadClass}
              />
            </div>
          </div>
        ) : (
          <ExerciseLibrary onAddExercise={addExerciseToClass} />
        )}
        
        <ClassBuilder 
          currentClass={currentClass}
          onRemoveExercise={removeExerciseFromClass}
          onReorderExercises={reorderExercises}
          onUpdateExercise={updateExerciseInClass}
          savedClasses={savedClasses}
          onAddExercise={addExerciseToClass}
        />
      </div>
    </div>
  );
};

export default Index;
