
import React from 'react';
import { MobileClassBuilder } from './MobileClassBuilder';
import { Exercise, ClassPlan } from '@/types/reformer';

interface ModernClassBuilderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
  onAddCallout?: (name: string, position: number) => void;
  onEditExercise?: (exercise: Exercise) => void;
}

export const ModernClassBuilder = (props: ModernClassBuilderProps) => {
  return <MobileClassBuilder {...props} />;
};
