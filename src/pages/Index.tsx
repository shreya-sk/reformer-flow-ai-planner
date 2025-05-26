
import { useState } from 'react';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { ClassBuilder } from '@/components/ClassBuilder';
import { Header } from '@/components/Header';
import { Exercise, ClassPlan } from '@/types/reformer';

const Index = () => {
  const [currentClass, setCurrentClass] = useState<ClassPlan>({
    id: '',
    name: 'New Class',
    exercises: [],
    totalDuration: 0,
    createdAt: new Date(),
  });

  const [savedClasses, setSavedClasses] = useState<ClassPlan[]>([]);

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
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      <Header 
        currentClass={currentClass}
        onSaveClass={saveClass}
        onUpdateClassName={(name) => setCurrentClass(prev => ({ ...prev, name }))}
      />
      
      <div className="flex h-[calc(100vh-80px)]">
        <ExerciseLibrary onAddExercise={addExerciseToClass} />
        <ClassBuilder 
          currentClass={currentClass}
          onRemoveExercise={removeExerciseFromClass}
          savedClasses={savedClasses}
        />
      </div>
    </div>
  );
};

export default Index;
