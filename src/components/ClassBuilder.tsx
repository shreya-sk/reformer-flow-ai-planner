
import React from 'react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { MobileClassBuilder } from '@/components/MobileClassBuilder';

interface ClassBuilderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
  onAddCallout?: (name: string, position: number) => void;
}

export const ClassBuilder = (props: ClassBuilderProps) => {
  return <MobileClassBuilder {...props} />;
};
