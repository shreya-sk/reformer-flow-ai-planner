
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, Info, Settings, Target, Shield, Eye } from 'lucide-react';

interface ExerciseFormStepsProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_ICONS = {
  1: Info,
  2: Settings,
  3: Target,
  4: Shield,
  5: Eye
};

const STEP_TITLES = {
  1: 'Basic Info',
  2: 'Physical Setup',
  3: 'Body Focus',
  4: 'Teaching Details',
  5: 'Review'
};

export const ExerciseFormSteps = ({ currentStep, totalSteps }: ExerciseFormStepsProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
      <Progress value={progressPercentage} className="bg-white/20" />
      
      <div className="flex items-center justify-between mt-4">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const StepIcon = STEP_ICONS[stepNumber as keyof typeof STEP_ICONS];
          
          return (
            <div
              key={stepNumber}
              className={`flex flex-col items-center ${
                stepNumber === currentStep ? 'text-white' : 
                stepNumber < currentStep ? 'text-white' : 'text-white/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                stepNumber === currentStep ? 'bg-white text-sage-600' :
                stepNumber < currentStep ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {stepNumber < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs text-center hidden sm:block">
                {STEP_TITLES[stepNumber as keyof typeof STEP_TITLES]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
