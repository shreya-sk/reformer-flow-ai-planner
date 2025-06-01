
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Dumbbell, Users, Target, Sparkles } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Your Reformer Journey",
    description: "Transform your teaching with our comprehensive class planning platform designed specifically for Reformer instructors.",
    icon: Sparkles,
    gradient: "from-sage-200 via-sage-300 to-sage-400",
    textGradient: "from-sage-700 to-sage-800"
  },
  {
    id: 2,
    title: "Build Perfect Classes",
    description: "Access hundreds of exercises, create custom sequences, and organize your classes with our intuitive drag-and-drop builder.",
    icon: Dumbbell,
    gradient: "from-sage-300 via-sage-400 to-sage-500",
    textGradient: "from-sage-800 to-sage-900"
  },
  {
    id: 3,
    title: "Teach with Confidence", 
    description: "Use our teaching mode to guide your classes with timers, cues, and seamless transitions between exercises.",
    icon: Users,
    gradient: "from-sage-400 via-sage-500 to-sage-600",
    textGradient: "from-white to-sage-100"
  },
  {
    id: 4,
    title: "Track Your Progress",
    description: "Monitor your teaching journey with detailed statistics and insights to help you grow as an instructor.",
    icon: Target,
    gradient: "from-sage-500 via-sage-600 to-sage-700",
    textGradient: "from-white to-sage-100"
  }
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl overflow-hidden">
        <div className={`bg-gradient-to-br ${currentStepData.gradient} relative`}>
          {/* Floating background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/15 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-8 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>
          
          {/* Curved shape overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-white rounded-t-[3rem]"></div>
          
          <CardContent className="p-8 pb-16 text-center relative">
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index <= currentStep 
                        ? 'w-8 bg-white shadow-lg' 
                        : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl flex items-center justify-center">
                <IconComponent className="h-10 w-10 text-sage-600" />
              </div>
            </div>

            {/* Content */}
            <h2 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${currentStepData.textGradient} bg-clip-text text-transparent`}>
              {currentStepData.title}
            </h2>
            <p className={`text-lg leading-relaxed ${
              currentStep >= 2 ? 'text-white/90' : 'text-sage-700'
            }`}>
              {currentStepData.description}
            </p>
          </CardContent>
        </div>

        {/* Navigation buttons */}
        <div className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              variant="ghost"
              disabled={currentStep === 0}
              className="text-sage-600 hover:bg-sage-100 rounded-2xl disabled:opacity-30 bg-white/80 backdrop-blur-sm border border-sage-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-sage-600 font-medium">
              {currentStep + 1} of {onboardingSteps.length}
            </div>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
