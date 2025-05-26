
import { useState } from 'react';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { ClassBuilder } from '@/components/ClassBuilder';
import { Header } from '@/components/Header';
import { ClassPlanManager } from '@/components/ClassPlanManager';
import { Exercise, ClassPlan } from '@/types/reformer';

const Index = () => {
  const [currentClass, setCurrentClass] = useState<ClassPlan>({
    id: '',
    name: 'New Class',
    exercises: [],
    totalDuration: 0,
    createdAt: new Date(),
    notes: '',
  });

  const [savedClasses, setSavedClasses] = useState<ClassPlan[]>([]);
  const [showClassManager, setShowClassManager] = useState(false);

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

  const saveClass = () => {
    if (currentClass.exercises.length === 0) return;
    
    const savedClass = {
      ...currentClass,
      id: `class-${Date.now()}`,
      name: currentClass.name || `Class ${savedClasses.length + 1}`,
    };
    
    setSavedClasses(prev => [...prev, savedClass]);
    setCurrentClass({
      id: '',
      name: 'New Class',
      exercises: [],
      totalDuration: 0,
      createdAt: new Date(),
      notes: '',
    });
  };

  const deleteClass = (classId: string) => {
    setSavedClasses(prev => prev.filter(c => c.id !== classId));
  };

  const loadClass = (classPlan: ClassPlan) => {
    setCurrentClass(classPlan);
    setShowClassManager(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      <Header 
        currentClass={currentClass}
        onSaveClass={saveClass}
        onUpdateClassName={(name) => setCurrentClass(prev => ({ ...prev, name }))}
        onToggleClassManager={() => setShowClassManager(!showClassManager)}
        showClassManager={showClassManager}
      />
      
      <div className="flex h-[calc(100vh-80px)]">
        {showClassManager ? (
          <div className="w-96 bg-white border-r border-sage-200 p-4 overflow-y-auto">
            <ClassPlanManager
              currentClass={currentClass}
              savedClasses={savedClasses}
              onUpdateClassName={(name) => setCurrentClass(prev => ({ ...prev, name }))}
              onUpdateClassNotes={(notes) => setCurrentClass(prev => ({ ...prev, notes }))}
              onDeleteClass={deleteClass}
              onLoadClass={loadClass}
            />
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
