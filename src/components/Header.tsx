
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Clock, Users, FolderOpen, Sparkles } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

interface HeaderProps {
  currentClass: ClassPlan;
  onSaveClass: () => void;
  onUpdateClassName: (name: string) => void;
  onToggleClassManager: () => void;
  showClassManager: boolean;
}

export const Header = ({ 
  currentClass, 
  onSaveClass, 
  onUpdateClassName, 
  onToggleClassManager,
  showClassManager 
}: HeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (currentClass.exercises.length === 0) {
      toast({
        title: "Cannot save empty class",
        description: "Add some exercises to your class before saving.",
        variant: "destructive",
      });
      return;
    }
    
    onSaveClass();
    toast({
      title: "Class saved successfully!",
      description: `"${currentClass.name}" has been added to your library.`,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <header className="bg-white border-b border-sage-200 px-8 py-5 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sage-700 to-sage-900 bg-clip-text text-transparent">
            Reformer Flow
          </h1>
        </div>
        
        <div className="h-8 w-px bg-sage-300" />
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <Input
              value={currentClass.name}
              onChange={(e) => onUpdateClassName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="text-xl font-semibold w-64 border-sage-300 focus:border-sage-500"
              autoFocus
            />
          ) : (
            <h2 
              className="text-xl font-semibold text-sage-800 cursor-pointer hover:text-sage-900 transition-colors px-2 py-1 rounded hover:bg-sage-50"
              onClick={() => setIsEditing(true)}
            >
              {currentClass.name}
            </h2>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-sage-50 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-sage-600" />
            <span className="font-semibold text-sage-800">{formatDuration(currentClass.totalDuration)}</span>
            <span className="text-sage-500 text-sm">total</span>
          </div>

          <div className="flex items-center space-x-2 bg-sage-50 px-4 py-2 rounded-lg">
            <Users className="h-4 w-4 text-sage-600" />
            <span className="font-semibold text-sage-800">{currentClass.exercises.length}</span>
            <span className="text-sage-500 text-sm">exercises</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            onClick={onToggleClassManager}
            variant={showClassManager ? "default" : "outline"}
            className={showClassManager 
              ? "bg-sage-600 hover:bg-sage-700 text-white shadow-sm" 
              : "border-sage-300 text-sage-700 hover:bg-sage-50"
            }
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            My Classes
          </Button>

          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
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
