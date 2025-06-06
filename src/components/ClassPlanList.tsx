import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Play, 
  Edit3, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  Dumbbell
} from 'lucide-react';
import { ClassPlan } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ClassPlanListProps {
  classes: ClassPlan[];
  onEditClass: (classPlan: ClassPlan) => void;
  onDeleteClass: (classId: string) => void;
}

// Default class plan images
const defaultImages = [
  '/lovable-uploads/156c5622-2826-4e16-8de0-e4c9aaa78cd3.png',
  '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
  '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
  '/lovable-uploads/8cb5e632-af4e-471a-a2c4-0371ce90cda2.png',
  '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
  '/lovable-uploads/52c9b506-ac25-4335-8a26-0c2b10d2c954.png',
  '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
  '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png',
  '/lovable-uploads/f986f49e-45f2-4dd4-8758-4be41a199bfd.png',
  '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png'
];

export const ClassPlanList = ({ classes, onEditClass, onDeleteClass }: ClassPlanListProps) => {
  const navigate = useNavigate();
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { preferences } = useUserPreferences();

  const getRandomImage = (classId: string) => {
    const index = classId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % defaultImages.length;
    return defaultImages[index];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMuscleGroupsCount = (classPlan: ClassPlan) => {
    const realExercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
    return Array.from(new Set(realExercises.flatMap(ex => ex.muscleGroups))).length;
  };

  const getRealExercisesCount = (classPlan: ClassPlan) => {
    return classPlan.exercises.filter(ex => ex.category !== 'callout').length;
  };

  const handlePlayClass = (classPlan: ClassPlan) => {
    console.log('🎯 ClassPlanList: handlePlayClass called');
    console.log('🎯 Class plan ID:', classPlan.id);
    console.log('🎯 Class plan name:', classPlan.name);
    console.log('🎯 Number of exercises:', classPlan.exercises.length);
    console.log('🎯 Real exercises (non-callout):', classPlan.exercises.filter(ex => ex.category !== 'callout').length);
    
    // Validate that class has exercises
    const realExercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
    
    if (realExercises.length === 0) {
      setError("This class has no exercises to teach. Please add some exercises first.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    console.log('🎯 Navigating to:', `/teaching/${classPlan.id}`);
    
    try {
      navigate(`/teaching/${classPlan.id}`);
    } catch (error) {
      console.error('🎯 Navigation error:', error);
      setError("Could not start teaching mode. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const toggleExpanded = (classId: string) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {classes.map((classPlan) => (
          <Card key={classPlan.id} className={`group hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} overflow-hidden rounded-2xl`}>
            {/* Class Image - Compact for mobile */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={classPlan.image || getRandomImage(classPlan.id)}
                alt={classPlan.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  onClick={() => handlePlayClass(classPlan)}
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full px-3 py-1 transform hover:scale-110"
                  title={`Teach "${classPlan.name}" (${classPlan.exercises.filter(ex => ex.category !== 'callout').length} exercises)`}
                >
                  <Play className="h-3 w-3 mr-1" />
                  <span className="text-xs">Teach</span>
                </Button>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-2 right-2">
                <Badge className={`text-xs ${preferences.darkMode ? 'bg-gray-900/80 text-white' : 'bg-white/90 text-gray-900'} backdrop-blur-sm rounded-full px-2 py-0.5`}>
                  <Clock className="h-2 w-2 mr-1" />
                  {classPlan.totalDuration}min
                </Badge>
              </div>

              {/* Exercise Count Badge */}
              <div className="absolute top-2 left-2">
                <Badge className="text-xs bg-sage-600/80 text-white backdrop-blur-sm rounded-full px-2 py-0.5">
                  {getRealExercisesCount(classPlan)} ex
                </Badge>
              </div>
            </div>

            <CardContent className="p-3">
              {/* Class Name */}
              <h3 className={`font-semibold text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'} line-clamp-2 mb-2 leading-tight`}>
                {classPlan.name}
              </h3>
              
              {/* Date */}
              <div className={`flex items-center gap-1 text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} mb-3`}>
                <Calendar className="h-2 w-2" />
                {formatDate(classPlan.createdAt)}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-1">
                <Button
                  onClick={() => onEditClass(classPlan)}
                  size="sm"
                  variant="outline"
                  className={`flex-1 text-xs h-7 ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 text-sage-600 hover:bg-sage-50'} rounded-lg transition-all duration-300`}
                >
                  <Edit3 className="h-2 w-2 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => onDeleteClass(classPlan.id)}
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 h-7 px-2"
                >
                  <Trash2 className="h-2 w-2" />
                </Button>
              </div>

              {/* Expandable Details */}
              <Collapsible open={expandedClass === classPlan.id}>
                <CollapsibleTrigger asChild>
                  <Button
                    onClick={() => toggleExpanded(classPlan.id)}
                    variant="ghost"
                    className="w-full text-xs mt-2 h-6 p-0"
                  >
                    <span className="flex items-center gap-1">
                      <Eye className="h-2 w-2" />
                      Details
                      {expandedClass === classPlan.id ? 
                        <ChevronUp className="h-2 w-2" /> : 
                        <ChevronDown className="h-2 w-2" />
                      }
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center justify-between ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                      <span>Muscle Groups:</span>
                      <span className="font-medium">{getMuscleGroupsCount(classPlan)}</span>
                    </div>
                    <div className={`flex items-center justify-between ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                      <span>Total Duration:</span>
                      <span className="font-medium">{classPlan.totalDuration} min</span>
                    </div>
                  </div>

                  {/* Exercise List Preview */}
                  <div className="max-h-20 overflow-y-auto space-y-1">
                    {classPlan.exercises.filter(ex => ex.category !== 'callout').slice(0, 3).map((exercise, index) => (
                      <div key={index} className={`p-1 rounded-md text-xs ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'} truncate`}>
                            {exercise.name}
                          </span>
                          <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                            {exercise.duration}min
                          </span>
                        </div>
                      </div>
                    ))}
                    {getRealExercisesCount(classPlan) > 3 && (
                      <div className={`text-xs text-center ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                        +{getRealExercisesCount(classPlan) - 3} more
                      </div>
                    )}
                  </div>

                  {/* Teaching Button */}
                  <Button
                    onClick={() => handlePlayClass(classPlan)}
                    disabled={getRealExercisesCount(classPlan) === 0}
                    className={`w-full text-xs h-7 rounded-lg transform hover:scale-105 transition-all duration-300 ${
                      getRealExercisesCount(classPlan) === 0
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white'
                    }`}
                    title={
                      getRealExercisesCount(classPlan) === 0
                        ? 'Add exercises to enable teaching mode'
                        : `Start teaching "${classPlan.name}"`
                    }
                  >
                    <Play className="h-2 w-2 mr-1" />
                    {getRealExercisesCount(classPlan) === 0 
                      ? 'No Exercises' 
                      : 'Start Teaching'
                    }
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
