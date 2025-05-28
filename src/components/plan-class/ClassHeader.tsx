
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Undo, Redo, Play, ChevronDown } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';

interface ClassHeaderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onSaveClass: () => void;
  onStartTeaching?: () => void;
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
  onStartTeaching,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showBackButton = false,
  onBack
}: ClassHeaderProps) => {
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [className, setClassName] = useState(currentClass?.name || 'New Class');
  
  useEffect(() => {
    if (currentClass?.name) {
      setClassName(currentClass.name);
    }
  }, [currentClass?.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const handleNameBlur = () => {
    onUpdateClassName(className);
    setEditingName(false);
  };

  return (
    <div className="relative">
      {/* Background with waves */}
      <div className="absolute inset-0 bg-gradient-to-r from-sage-500 via-sage-600 to-sage-500 z-0"></div>
      
      <div className="absolute inset-0 z-0">
        <svg className="absolute bottom-0 w-full h-6" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,60 C240,30 480,50 720,40 C960,30 1200,50 1440,40 L1440,60 L0,60 Z" fill="rgba(255,255,255,0.1)" />
        </svg>
        <svg className="absolute bottom-0 w-full h-4" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,60 C360,40 600,50 840,45 C1080,40 1320,50 1440,45 L1440,60 L0,60 Z" fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>
      
      {/* Header content */}
      <div className="relative px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          {(showBackButton || onBack) ? (
            <Button 
              onClick={onBack || (() => navigate('/'))} 
              variant="ghost" 
              className="pl-0 pr-2 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="font-medium text-sm">Back</span>
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="pl-0 pr-2 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="font-medium text-sm">Home</span>
            </Button>
          )}
          
          {editingName ? (
            <Input
              autoFocus
              value={className}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={e => e.key === 'Enter' && handleNameBlur()}
              className="h-8 text-sm bg-white/20 border-white/30 text-white placeholder-white/70 focus-visible:ring-white/30"
              maxLength={30}
            />
          ) : (
            <div 
              className="cursor-pointer px-2 py-1 rounded hover:bg-white/10 transition-colors"
              onClick={() => setEditingName(true)}
            >
              <h1 className="text-xl font-medium text-white truncate max-w-[150px] md:max-w-xs">
                {className}
              </h1>
              <p className="text-xs text-white/80">
                {currentClass?.exercises.filter(ex => ex.category !== 'callout').length || 0} exercises • {currentClass?.totalDuration || 0} min
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {onStartTeaching && (
            <Button
              onClick={onStartTeaching}
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
            >
              <Play className="h-4 w-4 mr-1" />
              Teach
            </Button>
          )}
          
          <Button
            onClick={onSaveClass}
            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
