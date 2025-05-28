
import { useState } from 'react';
import { ClassPlanSettings } from './ClassPlanSettings';
import { ClassBuilder } from '@/components/ClassBuilder';
import { ClassPlan, Exercise } from '@/types/reformer';

interface TabbedPlanViewProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateClassName: (name: string) => void;
  onUpdateClassDuration: (duration: number) => void;
  onAddExercise: () => void;
  onAddCallout: (position: number) => void;
  onUpdateCallout: (calloutId: string, newName: string) => void;
  onDeleteCallout: (calloutId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onAddToShortlist?: (exercise: Exercise) => void;
  viewMode?: 'builder' | 'settings';
}

export const TabbedPlanView = ({
  currentClass,
  onRemoveExercise,
  onUpdateClassName,
  onUpdateClassDuration,
  onAddExercise,
  onAddCallout,
  onUpdateCallout,
  onDeleteCallout,
  onReorderExercises,
  onAddToShortlist,
  viewMode = 'builder'
}: TabbedPlanViewProps) => {
  const updateExercise = (updatedExercise: Exercise) => {
    const updatedExercises = currentClass.exercises.map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    );
    onReorderExercises(updatedExercises);
  };

  if (viewMode === 'settings') {
    return (
      <ClassPlanSettings
        currentClass={currentClass}
        onUpdateClassName={onUpdateClassName}
        onUpdateClassDuration={onUpdateClassDuration}
      />
    );
  }

  return (
    <ClassBuilder
      currentClass={currentClass}
      onRemoveExercise={onRemoveExercise}
      onReorderExercises={onReorderExercises}
      onUpdateExercise={updateExercise}
      onAddExercise={onAddExercise}
      onAddCallout={onAddCallout}
      onUpdateCallout={onUpdateCallout}
      onDeleteCallout={onDeleteCallout}
      onAddToShortlist={onAddToShortlist}
    />
  );
};
