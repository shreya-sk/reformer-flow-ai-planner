
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Dumbbell, BookOpen, Timer, Sparkles } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();

  const slides = [
    {
      title: "Welcome to Reformerly",
      subtitle: "Your Personal Pilates Assistant",
      description: "Plan, teach, and track your Reformer classes with ease. Let's get you started on your journey to becoming a more organized instructor.",
      icon: <Sparkles className="h-16 w-16 text-sage-600" />,
      gradient: "from-sage-400 to-sage-600"
    },
    {
      title: "Build Amazing Classes",
      subtitle: "Exercise Library at Your Fingertips",
      description: "Access hundreds of Reformer exercises, create custom routines, and build comprehensive class plans that your students will love.",
      icon: <Dumbbell className="h-16 w-16 text-blue-600" />,
      gradient: "from-blue-400 to-blue-600"
    },
    {
      title: "Teach with Confidence",
      subtitle: "Live Teaching Mode",
      description: "Use our teaching mode during classes with built-in timers, exercise sequences, and easy navigation to keep your sessions flowing smoothly.",
      icon: <Timer className="h-16 w-16 text-green-600" />,
      gradient: "from-green-400 to-green-600"
    },
    {
      title: "Track Your Progress",
      subtitle: "Grow as an Instructor",
      description: "Monitor your teaching statistics, see which exercises work best, and continuously improve your class planning skills.",
      icon: <BookOpen className="h-16 w-16 text-purple-600" />,
      gradient: "from-purple-400 to-purple-600"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Mark onboarding as complete
      localStorage.setItem('onboarding-completed', 'true');
      onComplete();
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onComplete();
  };

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-sage-25 via-white to-sage-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sage-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-sage-600">
              {currentSlide + 1} of {slides.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipOnboarding}
              className="text-sage-500 hover:text-sage-700"
            >
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${currentSlideData.gradient} p-8 text-center text-white`}>
              <div className="mb-4 flex justify-center">
                {currentSlideData.icon}
              </div>
              <h1 className="text-2xl font-bold mb-2">{currentSlideData.title}</h1>
              <p className="text-lg opacity-90">{currentSlideData.subtitle}</p>
            </div>

            {/* Content */}
            <div className="p-8 text-center space-y-6">
              <p className="text-sage-700 leading-relaxed text-lg">
                {currentSlideData.description}
              </p>

              {/* Welcome Message on First Slide */}
              {currentSlide === 0 && (
                <div className="bg-sage-50 rounded-2xl p-4">
                  <p className="text-sage-600 text-sm">
                    Hi {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'}! 👋
                  </p>
                  <p className="text-sage-600 text-sm">
                    Let's take a quick tour of your new favorite teaching tool.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={nextSlide}
                  className={`w-full bg-gradient-to-r ${currentSlideData.gradient} hover:opacity-90 text-white py-3 rounded-2xl text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200`}
                >
                  {currentSlide === slides.length - 1 ? (
                    "Get Started"
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 pt-4">
                  {slides.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide 
                          ? 'bg-sage-600 w-6' 
                          : 'bg-sage-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
