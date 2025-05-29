
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trash2, 
  Clock, 
  GripVertical, 
  BookOpen, 
  Plus, 
  Heart, 
  Star,
  ChevronDown,
  ChevronRight,
  Settings2,
  Image as ImageIcon,
  Edit3,
  Calendar,
  Target
} from 'lucide-react';
import { ClassPlan, Exercise } from '@/types/reformer';
import { ExerciseSuggestions } from './ExerciseSuggestions';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { SpringVisual } from '@/components/SpringVisual';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ClassBuilderProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onAddExercise: () => void;
  onAddCallout?: (position: number) => void;
  onUpdateCallout?: (calloutId: string, newName: string) => void;
  onDeleteCallout?: (calloutId: string) => void;
  onAddToShortlist?: (exercise: Exercise) => void;
  onUpdateClassName: (name: string) => void;
  onUpdateClassDuration: (duration: number) => void;
  onUpdateClassNotes: (notes: string) => void;
  onUpdateClassImage: (image: string) => void;
  collapsedSections: Set<string>;
  onToggleSectionCollapse: (sectionId: string) => void;
  savedClasses?: ClassPlan[];
}

// Default images for class plans
const defaultImages = [
  '/lovable-uploads/156c5622-2826-4e16-8de0-e4c9aaa78cd3.png',
  '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
  '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
  '/lovable-uploads/8cb5e632-af4e-471a-a2c4-0371ce90cda2.png',
  '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
  '/lovable-uploads/52c9b506-ac25-4335-8a26-0c2b10d2c954.png'
];

export const ClassBuilder = ({ 
  currentClass, 
  onRemoveExercise, 
  onReorderExercises, 
  onUpdateExercise,
  onAddExercise,
  onAddCallout,
  onUpdateCallout,
  onDeleteCallout,
  onAddToShortlist,
  onUpdateClassName,
  onUpdateClassDuration,
  onUpdateClassNotes,
  onUpdateClassImage,
  collapsedSections,
  onToggleSectionCollapse
}: ClassBuilderProps) => {
  const { preferences } = useUserPreferences();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [editingCallout, setEditingCallout] = useState<string | null>(null);
  const [editCalloutValue, setEditCalloutValue] = useState('');

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const exercises = [...currentClass.exercises];
    const draggedExercise = exercises[draggedIndex];
    exercises.splice(draggedIndex, 1);
    exercises.splice(dropIndex, 0, draggedExercise);
    
    onReorderExercises(exercises);
    setDraggedIndex(null);
  };

  const getMuscleGroupCoverage = () => {
    const allGroups = currentClass.exercises.flatMap(ex => ex.muscleGroups);
    return Array.from(new Set(allGroups));
  };

  const handleExerciseClick = (exercise: Exercise) => {
    if (exercise.category === 'callout') return;
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleRemoveExercise = (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveExercise(exerciseId);
  };

  const handleAddCallout = (position: number) => {
    if (onAddCallout) {
      onAddCallout(position);
    }
  };

  const handleShortlistExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToShortlist) {
      onAddToShortlist(exercise);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onUpdateClassImage(imageUrl);
    setShowImageSelector(false);
  };

  const startEditingCallout = (callout: Exercise) => {
    setEditingCallout(callout.id);
    setEditCalloutValue(callout.name);
  };

  const saveCalloutEdit = () => {
    if (editingCallout && onUpdateCallout) {
      onUpdateCallout(editingCallout, editCalloutValue);
      setEditingCallout(null);
      setEditCalloutValue('');
    }
  };

  const cancelCalloutEdit = () => {
    setEditingCallout(null);
    setEditCalloutValue('');
  };

  // Group exercises by sections (callouts)
  const groupedExercises = () => {
    const groups: { callout: Exercise | null; exercises: Exercise[] }[] = [];
    let currentGroup: Exercise[] = [];
    
    currentClass.exercises.forEach((exercise) => {
      if (exercise.category === 'callout') {
        if (currentGroup.length > 0) {
          groups.push({ callout: null, exercises: currentGroup });
          currentGroup = [];
        }
        groups.push({ callout: exercise, exercises: [] });
      } else {
        currentGroup.push(exercise);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({ callout: null, exercises: currentGroup });
    }
    
    return groups;
  };

  const ExerciseCard = ({ exercise, index }: { exercise: Exercise; index: number }) => {
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        className={`group mb-3 transition-all duration-300 cursor-pointer ${
          draggedIndex === index ? 'opacity-50 scale-95' : ''
        } ${hoveredExercise === exercise.id ? 'scale-[1.02]' : ''}`}
        onClick={() => handleExerciseClick(exercise)}
        onMouseEnter={() => setHoveredExercise(exercise.id)}
        onMouseLeave={() => setHoveredExercise(null)}
      >
        <Card className="border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 overflow-hidden rounded-xl ml-6">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-5 w-5 text-sage-500" />
              </div>

              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-sm font-bold text-sage-600">{index + 1}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sage-800 text-sm">
                    {exercise.name}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onAddToShortlist && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleShortlistExercise(exercise, e)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-6 w-6 p-0"
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleRemoveExercise(exercise.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-sage-500" />
                    <span className="text-xs text-sage-600 font-medium">{exercise.duration}min</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-sage-500">Springs:</span>
                    <SpringVisual springs={exercise.springs} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-sage-300 text-sage-700 rounded-full">
                    {exercise.category}
                  </Badge>
                  <div className="flex gap-1">
                    {exercise.muscleGroups.slice(0, 2).map(group => (
                      <Badge key={group} variant="secondary" className="text-xs bg-sage-100 text-sage-700 rounded-full">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
          {/* Class Settings Sidebar */}
          <div className="space-y-4">
            {/* Class Info Card */}
            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-sage-100 bg-gradient-to-r from-sage-50 to-white p-3">
                <CardTitle className="text-base text-sage-800 font-medium flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Class Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Class Name */}
                <div>
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">
                    Class Name
                  </Label>
                  <Input
                    value={currentClass.name}
                    onChange={(e) => onUpdateClassName(e.target.value)}
                    placeholder="Enter class name..."
                    className="border-sage-300 focus:border-sage-500"
                  />
                </div>

                {/* Class Duration */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-sage-700">
                      Duration
                    </Label>
                    <span className="text-sm font-medium text-sage-800">{currentClass.classDuration || 45} min</span>
                  </div>
                  <Slider
                    value={[currentClass.classDuration || 45]}
                    onValueChange={(values) => onUpdateClassDuration(values[0])}
                    min={15}
                    max={90}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-sage-600 mt-1">
                    <span>15 min</span>
                    <span>45 min</span>
                    <span>90 min</span>
                  </div>
                </div>

                {/* Class Image */}
                <div>
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">
                    Class Image
                  </Label>
                  <div className="flex items-center gap-3">
                    {currentClass.image ? (
                      <img 
                        src={currentClass.image} 
                        alt="Class thumbnail" 
                        className="w-12 h-12 object-cover rounded-lg border border-sage-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-sage-50 rounded-lg border border-sage-200 flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-sage-400" />
                      </div>
                    )}
                    
                    <Dialog open={showImageSelector} onOpenChange={setShowImageSelector}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-sage-300 text-sage-600">
                          Select
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Select Class Image</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-2">
                          {defaultImages.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => handleImageSelect(image)}
                              className="aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-sage-500 transition-colors"
                            >
                              <img 
                                src={image} 
                                alt={`Option ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Class Notes */}
                <div>
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">
                    Notes
                  </Label>
                  <Textarea
                    value={currentClass.notes || ''}
                    onChange={(e) => onUpdateClassNotes(e.target.value)}
                    placeholder="Add class notes..."
                    rows={3}
                    className="border-sage-300 focus:border-sage-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Muscle Groups */}
            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-sage-800 font-medium">Muscle Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {getMuscleGroupCoverage().length === 0 ? (
                    <span className="text-sm text-sage-500">No exercises added</span>
                  ) : (
                    getMuscleGroupCoverage().map(group => (
                      <Badge key={group} className="text-xs bg-sage-100 text-sage-700 border-sage-300 rounded-full">
                        {group}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class Timeline */}
          <div className="md:col-span-3 space-y-3">
            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-sage-100 bg-gradient-to-r from-sage-50 to-white p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg text-sage-800">Class Timeline</CardTitle>
                    
                    {/* Inline Class Stats */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-sage-100 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3 text-sage-600" />
                        <span className="text-xs font-medium text-sage-700">{currentClass.totalDuration}min</span>
                      </div>
                      
                      <div className="flex items-center gap-1 bg-sage-100 px-2 py-1 rounded-full">
                        <BookOpen className="h-3 w-3 text-sage-600" />
                        <span className="text-xs font-medium text-sage-700">
                          {currentClass.exercises.filter(ex => ex.category !== 'callout').length}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 bg-sage-100 px-2 py-1 rounded-full">
                        <Target className="h-3 w-3 text-sage-600" />
                        <span className="text-xs font-medium text-sage-700">
                          {getMuscleGroupCoverage().length} groups
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={onAddExercise}
                    variant="outline"
                    size="sm" 
                    className="border-sage-300 hover:bg-sage-100 text-sage-700 rounded-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
                
                {currentClass.exercises.length > 0 && (
                  <p className="text-xs text-sage-600 mt-1">
                    Drag to reorder exercises
                  </p>
                )}
              </CardHeader>
              
              <ScrollArea className="h-[calc(100vh-300px)] px-3 py-2">
                {currentClass.exercises.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-sage-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-7 w-7 text-sage-400" />
                    </div>
                    <h3 className="text-lg font-medium text-sage-700 mb-2">Start Building Your Class</h3>
                    <p className="text-sage-500 text-sm max-w-sm mx-auto mb-4">
                      Add exercises from the library to create your perfect Reformer flow.
                    </p>
                    <Button onClick={onAddExercise} className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-full px-6 py-2 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Exercise
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Add initial callout button */}
                    {onAddCallout && (
                      <div className="flex justify-center py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddCallout(0)}
                          className="rounded-full bg-sage-50 border-sage-300 hover:bg-sage-100 text-sage-700 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Section
                        </Button>
                      </div>
                    )}
                    
                    <ExerciseSuggestions 
                      currentClass={currentClass} 
                      onAddExercise={onAddExercise}
                    />
                    
                    {/* Grouped exercises with collapsible sections */}
                    {groupedExercises().map((group, groupIndex) => (
                      <div key={groupIndex}>
                        {group.callout && (
                          <Collapsible
                            open={!collapsedSections.has(group.callout.id)}
                            onOpenChange={() => onToggleSectionCollapse(group.callout.id)}
                          >
                            <div className="relative mb-2 px-4">
                              <div className="border-l-4 border-amber-400 pl-3 py-2 bg-amber-50 rounded-r-lg">
                                <div className="flex items-center justify-between">
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto text-amber-700 hover:text-amber-800">
                                      {collapsedSections.has(group.callout.id) ? (
                                        <ChevronRight className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                      {editingCallout === group.callout.id ? (
                                        <Input
                                          value={editCalloutValue}
                                          onChange={(e) => setEditCalloutValue(e.target.value)}
                                          onBlur={saveCalloutEdit}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveCalloutEdit();
                                            if (e.key === 'Escape') cancelCalloutEdit();
                                          }}
                                          className="h-6 text-sm border-amber-300"
                                          autoFocus
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      ) : (
                                        <span className="font-medium">{group.callout.name}</span>
                                      )}
                                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 ml-2">
                                        {group.exercises?.length || 0}
                                      </Badge>
                                    </Button>
                                  </CollapsibleTrigger>
                                  
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditingCallout(group.callout);
                                      }}
                                      className="h-6 w-6 p-0 text-amber-600 hover:text-amber-700"
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onDeleteCallout) onDeleteCallout(group.callout.id);
                                      }}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <CollapsibleContent>
                              {group.exercises?.map((exercise, exerciseIndex) => (
                                <ExerciseCard 
                                  key={exercise.id} 
                                  exercise={exercise} 
                                  index={currentClass.exercises.indexOf(exercise)} 
                                />
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                        
                        {!group.callout && group.exercises.map((exercise, exerciseIndex) => (
                          <ExerciseCard 
                            key={exercise.id} 
                            exercise={exercise} 
                            index={currentClass.exercises.indexOf(exercise)} 
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExercise(null);
          }}
          onUpdate={onUpdateExercise}
        />
      )}
    </>
  );
};
