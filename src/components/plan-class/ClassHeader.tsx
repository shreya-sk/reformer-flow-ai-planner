
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Undo, Redo } from 'lucide-react';
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
}

export const ClassHeader = ({ 
  currentClass, 
  onUpdateClassName, 
  onSaveClass, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo 
}: ClassHeaderProps) => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const [isEditing, setIsEditing] = useState(false);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <header className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b px-4 py-4 sticky top-0 z-40`}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className={`${preferences.darkMode ? 'text-gray-300 hover:text-white' : 'text-sage-600 hover:text-sage-800'}`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className={`h-6 w-px ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-300'}`} />
          
          {isEditing ? (
            <Input
              value={currentClass.name}
              onChange={(e) => onUpdateClassName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className={`text-lg font-semibold w-48 ${preferences.darkMode ? 'border-gray-600 focus:border-gray-500 bg-gray-700 text-white' : 'border-sage-300 focus:border-sage-500'}`}
              autoFocus
            />
          ) : (
            <h1 
              className={`text-lg font-semibold ${preferences.darkMode ? 'text-white hover:text-gray-200' : 'text-sage-800'} cursor-pointer hover:text-sage-900 transition-colors px-2 py-1 rounded ${preferences.darkMode ? 'hover:bg-gray-700' : 'hover:bg-sage-50'}`}
              onClick={() => setIsEditing(true)}
            >
              {currentClass.name}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Undo/Redo buttons */}
          <div className="flex gap-1">
            <Button
              onClick={onUndo}
              disabled={!canUndo}
              size="sm"
              variant="outline"
              className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              onClick={onRedo}
              disabled={!canRedo}
              size="sm"
              variant="outline"
              className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} px-3 py-1 rounded-full`}>
              <span className={`font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{formatDuration(currentClass.totalDuration)}</span>
            </div>
            <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} px-3 py-1 rounded-full`}>
              <span className={`font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{currentClass.exercises.length}</span>
              <span className={`${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} ml-1`}>exercises</span>
            </div>
          </div>

          <Button 
            onClick={onSaveClass}
            className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
            disabled={currentClass.exercises.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Class
          </Button>
        </div>
      </div>
    </header>
  );
};
