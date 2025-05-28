
import { useState } from 'react';
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
import { ClassTeachingMode } from './ClassTeachingMode';
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
  const [teachingClass, setTeachingClass] = useState<ClassPlan | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
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

  const handlePlayClass = (classPlan: ClassPlan) => {
    console.log('Starting teaching mode for class:', classPlan.name);
    setTeachingClass(classPlan);
  };

  const toggleExpanded = (classId: string) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  // If teaching mode is active, show the teaching component
  if (teachingClass) {
    return (
      <ClassTeachingMode
        classPlan={teachingClass}
        onClose={() => setTeachingClass(null)}
      />
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classPlan) => (
        <Card key={classPlan.id} className={`group hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} overflow-hidden rounded-2xl`}>
          {/* Class Image - More Compact */}
          <div className="relative h-24 overflow-hidden">
            <img
              src={classPlan.image || getRandomImage(classPlan.id)}
              alt={classPlan.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            {/* Organic Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={() => handlePlayClass(classPlan)}
                size="sm"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full px-4 py-1 transform hover:scale-110"
              >
                <Play className="h-3 w-3 mr-1" />
                Teach
              </Button>
            </div>

            {/* Duration Badge - More Organic */}
            <div className="absolute top-2 right-2">
              <Badge className={`text-xs ${preferences.darkMode ? 'bg-gray-900/80 text-white' : 'bg-white/90 text-gray-900'} backdrop-blur-sm rounded-full px-2 py-0.5`}>
                <Clock className="h-2 w-2 mr-1" />
                {classPlan.totalDuration}min
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-1">
            <CardTitle className={`text-sm font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'} line-clamp-2`}>
              {classPlan.name}
            </CardTitle>
            <div className={`flex items-center gap-2 text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
              <span className="flex items-center gap-1">
                <Calendar className="h-2 w-2" />
                {formatDate(classPlan.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-2 w-2" />
                {classPlan.exercises.filter(ex => ex.category !== 'callout').length} ex
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-2">
            <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} flex items-center gap-1`}>
              <Dumbbell className="h-2 w-2" />
              {getMuscleGroupsCount(classPlan)} muscle groups
            </div>
            
            {/* Organic Action Buttons */}
            <div className="flex gap-1">
              <Button
                onClick={() => onEditClass(classPlan)}
                size="sm"
                variant="outline"
                className={`flex-1 text-xs ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 text-sage-600 hover:bg-sage-50'} rounded-full transition-all duration-300 transform hover:scale-105 py-1`}
              >
                <Edit3 className="h-2 w-2 mr-1" />
                Edit
              </Button>
              <Button
                onClick={() => onDeleteClass(classPlan.id)}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 transform hover:scale-105 py-1 px-2"
              >
                <Trash2 className="h-2 w-2" />
              </Button>
            </div>

            {/* View Exercises Toggle - More Organic */}
            <Collapsible open={expandedClass === classPlan.id}>
              <CollapsibleTrigger asChild>
                <Button
                  onClick={() => toggleExpanded(classPlan.id)}
                  variant="outline"
                  className={`w-full text-xs ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 text-sage-600 hover:bg-sage-50'} rounded-full transition-all duration-300 py-1`}
                >
                  <Eye className="h-2 w-2 mr-1" />
                  View Exercises
                  {expandedClass === classPlan.id ? 
                    <ChevronUp className="h-2 w-2 ml-1" /> : 
                    <ChevronDown className="h-2 w-2 ml-1" />
                  }
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {classPlan.exercises.filter(ex => ex.category !== 'callout').map((exercise, index) => (
                    <div key={index} className={`p-2 rounded-xl text-xs ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} transition-all duration-300 hover:shadow-sm`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                          {exercise.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Dumbbell className="h-2 w-2" />
                          <span className={preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}>
                            {exercise.duration}min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Start Teaching Button in Expanded View */}
                <Button
                  onClick={() => handlePlayClass(classPlan)}
                  className="w-full bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white text-xs rounded-full py-1 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Play className="h-2 w-2 mr-1" />
                  Start Teaching
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
