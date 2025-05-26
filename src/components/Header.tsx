
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Clock, Users } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

interface HeaderProps {
  currentClass: ClassPlan;
  onSaveClass: () => void;
  onUpdateClassName: (name: string) => void;
}

export const Header = ({ currentClass, onSaveClass, onUpdateClassName }: HeaderProps) => {
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
    <header className="bg-white border-b border-sage-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-sage-800">Reformer Flow</h1>
        <div className="h-6 w-px bg-sage-300" />
        {isEditing ? (
          <Input
            value={currentClass.name}
            onChange={(e) => onUpdateClassName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="text-lg font-medium w-48"
            autoFocus
          />
        ) : (
          <h2 
            className="text-lg font-medium text-sage-700 cursor-pointer hover:text-sage-900 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            {currentClass.name}
          </h2>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-sage-600">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formatDuration(currentClass.totalDuration)}</span>
        </div>

        <div className="flex items-center space-x-2 text-sage-600">
          <Users className="h-4 w-4" />
          <span className="font-medium">{currentClass.exercises.length} exercises</span>
        </div>

        <Button 
          onClick={handleSave}
          className="bg-sage-600 hover:bg-sage-700 text-white"
          disabled={currentClass.exercises.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Class
        </Button>
      </div>
    </header>
  );
};
