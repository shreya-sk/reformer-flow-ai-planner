
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Edit3, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  Image as ImageIcon
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
  const { preferences } = useUserPreferences();

  const getRandomImage = (classId: string) => {
    // Use class ID to consistently select the same image for each class
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

  if (teachingClass) {
    return (
      <ClassTeachingMode
        classPlan={teachingClass}
        onClose={() => setTeachingClass(null)}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classPlan) => (
        <Card key={classPlan.id} className={`group hover:shadow-lg transition-all duration-200 ${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} overflow-hidden`}>
          {/* Class Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={classPlan.image || getRandomImage(classPlan.id)}
              alt={classPlan.name}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                onClick={() => handlePlayClass(classPlan)}
                size="lg"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
              >
                <Play className="h-6 w-6 mr-2" />
                Start Teaching
              </Button>
            </div>

            {/* Duration Badge */}
            <div className="absolute top-3 right-3">
              <Badge className={`${preferences.darkMode ? 'bg-gray-900/80 text-white' : 'bg-white/90 text-gray-900'} backdrop-blur-sm`}>
                <Clock className="h-3 w-3 mr-1" />
                {classPlan.totalDuration}min
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className={`text-lg font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'} line-clamp-2`}>
              {classPlan.name}
            </CardTitle>
            <div className={`flex items-center gap-3 text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(classPlan.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {classPlan.exercises.filter(ex => ex.category !== 'callout').length} exercises
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-4">
              <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                {getMuscleGroupsCount(classPlan)} muscle groups
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEditClass(classPlan)}
                  size="sm"
                  variant="outline"
                  className={`${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 text-sage-600 hover:bg-sage-50'}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onDeleteClass(classPlan.id)}
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Play Button */}
            <Button
              onClick={() => handlePlayClass(classPlan)}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Class
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
