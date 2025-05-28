
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Undo, Redo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClassPlan } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ClassHeaderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onSaveClass: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const ClassHeader = ({
  currentClass,
  onUpdateClassName,
  onSaveClass,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showBackButton = false,
  onBack
}: ClassHeaderProps) => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <header className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b px-4 py-4 sticky top-0 z-40`}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={`${preferences.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'}`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {showBackButton ? 'Back to Plan' : 'Back to Home'}
          </Button>
          
          <div className={`h-6 w-px ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-300'}`} />
          
          <h1 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            {showBackButton ? 'Add Exercises' : 'Class Planner'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className={`${preferences.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'}`}
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className={`${preferences.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'}`}
          >
            <Redo className="h-4 w-4" />
          </Button>

          {!showBackButton && (
            <Button 
              onClick={onSaveClass}
              disabled={currentClass.exercises.length === 0}
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white ml-2"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Class
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
