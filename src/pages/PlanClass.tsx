import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassHeader } from '@/components/plan-class/ClassHeader';
import { TabbedPlanView } from '@/components/plan-class/TabbedPlanView';
import { BottomNavigation } from '@/components/BottomNavigation';
import { toast } from '@/hooks/use-toast';
import { AuthPage } from '@/components/AuthPage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { ClassBuilder } from '@/components/ClassBuilder';

const PlanClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveClassPlan, savedClasses } = useClassPlans();
  const { preferences } = useUserPreferences();
  const {
    currentClass,
    removeExercise,
    updateClassName,
    updateClassDuration,
    updateClassNotes,
    updateClassImage,
    addCallout,
    clearClassPlan,
    reorderExercises
  } = usePersistedClassPlan();
  
  const [activeTab, setActiveTab] = useState('builder');
  const [isTeachingMode, setIsTeachingMode] = useState(false);
  const [shortlistedExercises, setShortlistedExercises] = useState<any[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  if (!user) {
    return <AuthPage />;
  }
  
  if (isTeachingMode) {
    return (
      <ClassTeachingMode 
        classPlan={currentClass}
        onClose={() => setIsTeachingMode(false)}
      />
    );
  }

  const handleSaveClass = async () => {
    const realExercises = currentClass.exercises.filter(ex => ex.category !== 'callout');
    if (realExercises.length === 0) {
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
    
    clearClassPlan();
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleAddExercise = () => {
    navigate('/library');
  };

  // Create wrapper function that converts position to callout name and position
  const handleAddCallout = (position: number) => {
    addCallout(`Note ${Date.now()}`, position);
  };

  const handleUpdateCallout = (calloutId: string, newName: string) => {
    const updatedExercises = currentClass.exercises.map(exercise => 
      exercise.id === calloutId && exercise.category === 'callout'
        ? { ...exercise, name: newName }
        : exercise
    );
    reorderExercises(updatedExercises);
  };

  const handleDeleteCallout = (calloutId: string) => {
    const updatedExercises = currentClass.exercises.filter(exercise => 
      !(exercise.id === calloutId && exercise.category === 'callout')
    );
    reorderExercises(updatedExercises);
  };

  const addToShortlist = (exercise: any) => {
    setShortlistedExercises(prev => [...prev, exercise]);
  };

  const removeFromShortlist = (exerciseId: string) => {
    setShortlistedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const addShortlistedToClass = (exercise: any) => {
    const updatedExercises = [...currentClass.exercises, exercise];
    reorderExercises(updatedExercises);
    removeFromShortlist(exercise.id);
  };

  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-50 via-white to-sage-100'} pb-20`}>
      <ClassHeader
        currentClass={currentClass}
        onUpdateClassName={updateClassName}
        onSaveClass={handleSaveClass}
        onStartTeaching={() => setIsTeachingMode(true)}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
      />

      <div className="p-3">
        <Tabs defaultValue="builder" value={activeTab} onValueChange={setActiveTab} className="rounded-xl overflow-hidden shadow-md bg-white/80 backdrop-blur-sm">
          <TabsList className="w-full grid grid-cols-2 bg-sage-50/70 p-1">
            <TabsTrigger value="builder" className="rounded-lg data-[state=active]:bg-sage-100 data-[state=active]:text-sage-800">
              Builder
            </TabsTrigger>
            <TabsTrigger value="shortlist" className="rounded-lg data-[state=active]:bg-sage-100 data-[state=active]:text-sage-800">
              Shortlisted
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="py-2">
            <ClassBuilder
              currentClass={currentClass}
              onRemoveExercise={removeExercise}
              onReorderExercises={reorderExercises}
              onUpdateExercise={(exercise) => {
                const updatedExercises = currentClass.exercises.map(ex => 
                  ex.id === exercise.id ? exercise : ex
                );
                reorderExercises(updatedExercises);
              }}
              onAddExercise={handleAddExercise}
              onAddCallout={handleAddCallout}
              onUpdateCallout={handleUpdateCallout}
              onDeleteCallout={handleDeleteCallout}
              onAddToShortlist={addToShortlist}
              onUpdateClassName={updateClassName}
              onUpdateClassDuration={updateClassDuration}
              onUpdateClassNotes={updateClassNotes}
              onUpdateClassImage={updateClassImage}
              collapsedSections={collapsedSections}
              onToggleSectionCollapse={toggleSectionCollapse}
            />
          </TabsContent>
          
          <TabsContent value="shortlist" className="py-2">
            <div className="p-3">
              <h2 className="text-lg font-medium text-sage-800 mb-3">Shortlisted Exercises</h2>
              {shortlistedExercises.length === 0 ? (
                <div className="text-center py-6 bg-sage-50 rounded-xl">
                  <p className="text-sage-600">No exercises shortlisted yet.</p>
                  <p className="text-sm text-sage-500 mt-2">
                    Add exercises to your shortlist from the exercise library.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shortlistedExercises.map(exercise => (
                    <div 
                      key={exercise.id} 
                      className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-sage-100"
                    >
                      <div>
                        <h3 className="font-medium text-sage-800">{exercise.name}</h3>
                        <p className="text-sm text-sage-600">
                          {exercise.duration} min • {exercise.category}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => addShortlistedToClass(exercise)}
                          className="px-3 py-1 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 text-sm"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => removeFromShortlist(exercise.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default PlanClass;