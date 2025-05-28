
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { ClassBuilder } from '@/components/ClassBuilder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

const PlanClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveClassPlan, savedClasses } = useClassPlans();
  
  const [currentClass, setCurrentClass] = useState<ClassPlan>({
    id: '',
    name: 'New Class',
    exercises: [],
    totalDuration: 0,
    createdAt: new Date(),
    notes: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const addExerciseToClass = (exercise: Exercise) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...exercise, id: `${exercise.id}-${Date.now()}` }],
      totalDuration: prev.totalDuration + exercise.duration,
    }));
  };

  const removeExerciseFromClass = (exerciseId: string) => {
    const exercise = currentClass.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setCurrentClass(prev => ({
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
        totalDuration: prev.totalDuration - exercise.duration,
      }));
    }
  };

  const reorderExercises = (exercises: Exercise[]) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises,
    }));
  };

  const updateExerciseInClass = (updatedExercise: Exercise) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    }));
  };

  const handleSaveClass = async () => {
    if (currentClass.exercises.length === 0) {
      toast({
        title: "Cannot save empty class",
        description: "Add some exercises to your class before saving.",
        variant: "destructive",
      });
      return;
    }
    
    const classToSave = {
      ...currentClass,
      name: currentClass.name || `Class ${Date.now()}`,
    };
    
    await saveClassPlan(classToSave);
    
    toast({
      title: "Class saved!",
      description: "Redirecting to My Classes...",
    });
    
    // Navigate back to home after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-sage-200 px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-sage-600 hover:text-sage-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className="h-6 w-px bg-sage-300" />
            
            {isEditing ? (
              <Input
                value={currentClass.name}
                onChange={(e) => setCurrentClass(prev => ({ ...prev, name: e.target.value }))}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className="text-lg font-semibold w-48 border-sage-300 focus:border-sage-500"
                autoFocus
              />
            ) : (
              <h1 
                className="text-lg font-semibold text-sage-800 cursor-pointer hover:text-sage-900 transition-colors px-2 py-1 rounded hover:bg-sage-50"
                onClick={() => setIsEditing(true)}
              >
                {currentClass.name}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-sage-50 px-3 py-1 rounded-full">
                <span className="font-semibold text-sage-800">{formatDuration(currentClass.totalDuration)}</span>
              </div>
              <div className="bg-sage-50 px-3 py-1 rounded-full">
                <span className="font-semibold text-sage-800">{currentClass.exercises.length}</span>
                <span className="text-sage-600 ml-1">exercises</span>
              </div>
            </div>

            <Button 
              onClick={handleSaveClass}
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
              disabled={currentClass.exercises.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Class
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-85px)]">
        <ExerciseLibrary onAddExercise={addExerciseToClass} />
        
        <ClassBuilder 
          currentClass={currentClass}
          onRemoveExercise={removeExerciseFromClass}
          onReorderExercises={reorderExercises}
          onUpdateExercise={updateExerciseInClass}
          savedClasses={savedClasses}
          onAddExercise={addExerciseToClass}
        />
      </div>
    </div>
  );
};

export default PlanClass;
