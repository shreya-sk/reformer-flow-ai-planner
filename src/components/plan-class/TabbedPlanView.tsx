
import { useState } from 'react';
import { ClassPlanSettings } from './ClassPlanSettings';
import { ClassBuilder } from '@/components/ClassBuilder';
import { ClassPlan, Exercise } from '@/types/reformer';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';

interface TabbedPlanViewProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateClassName: (name: string) => void;
  onUpdateClassDuration: (duration: number) => void;
  onUpdateClassNotes: (notes: string) => void;
  onUpdateClassImage: (image: string) => void;
  onAddExercise: () => void;
  onAddCallout: (name: string, position: number) => void;
  onUpdateCallout: (calloutId: string, newName: string) => void;
  onDeleteCallout: (calloutId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onAddToShortlist?: (exercise: Exercise) => void;
  collapsedSections: Set<string>;
  onToggleSectionCollapse: (sectionId: string) => void;
  viewMode?: 'builder' | 'settings';
}

export const TabbedPlanView = ({
  currentClass,
  onRemoveExercise,
  onUpdateClassName,
  onUpdateClassDuration,
  onUpdateClassNotes,
  onUpdateClassImage,
  onAddExercise,
  onAddCallout,
  onUpdateCallout,
  onDeleteCallout,
  onReorderExercises,
  onAddToShortlist,
  collapsedSections,
  onToggleSectionCollapse,
  viewMode = 'builder'
}: TabbedPlanViewProps) => {
  // Get the persisted class plan functions
  const { updateExercise } = usePersistedClassPlan();

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    console.log('🔄 TabbedPlanView updateExercise:', updatedExercise.name);
    updateExercise(updatedExercise.id, updatedExercise);
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
      onUpdateExercise={handleUpdateExercise}
      onAddExercise={onAddExercise}
      onAddCallout={onAddCallout}
      onUpdateClassName={onUpdateClassName}
      onSaveClass={() => {}}
    />
  );
};
