
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trash2, 
  Clock, 
  GripVertical, 
  BookOpen, 
  Plus, 
  Heart, 
  ChevronDown,
  ChevronRight,
  Edit3,
  Target
} from 'lucide-react';
import { ClassPlan, Exercise, CustomCallout } from '@/types/reformer';
import { ExerciseSuggestions } from './ExerciseSuggestions';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { SpringVisual } from '@/components/SpringVisual';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';

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

const getCalloutColorClasses = (color: CustomCallout['color'] = 'amber') => {
  const colorMap = {
    amber: { border: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', leftBorder: 'border-amber-200' },
    blue: { border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', leftBorder: 'border-blue-200' },
    green: { border: 'border-green-400', bg: 'bg-green-50', text: 'text-green-700', leftBorder: 'border-green-200' },
    purple: { border: 'border-purple-400', bg: 'bg-purple-50', text: 'text-purple-700', leftBorder: 'border-purple-200' },
    red: { border: 'border-red-400', bg: 'bg-red-50', text: 'text-red-700', leftBorder: 'border-red-200' },
  };
  return colorMap[color] || colorMap.amber;
};

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
  const { updateUserExercise, customizeSystemExercise } = useExercises();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [editingCallout, setEditingCallout] = useState<string | null>(null);
  const [editCalloutValue, setEditCalloutValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      setIsDragging(false);
      return;
    }

    const exercises = [...currentClass.exercises];
    const draggedExercise = exercises[draggedIndex];
    exercises.splice(draggedIndex, 1);
    exercises.splice(dropIndex, 0, draggedExercise);
    
    onReorderExercises(exercises);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const getMuscleGroupCoverage = () => {
    const allGroups = currentClass.exercises
      .filter(ex => ex.category !== 'callout')
      .flatMap(ex => ex.muscleGroups);
    return Array.from(new Set(allGroups));
  };

  const handleExerciseClick = (exercise: Exercise) => {
    if (exercise.category === 'callout' || isDragging) return;
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleRemoveExercise = (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveExercise(exerciseId);
  };

  const handleUpdateExerciseFromModal = async (updatedExercise: Exercise) => {
    try {
      // Save to database first
      if (updatedExercise.isSystemExercise) {
        await customizeSystemExercise(updatedExercise.id, {
          custom_name: updatedExercise.name,
          custom_duration: updatedExercise.duration,
          custom_springs: updatedExercise.springs,
          custom_cues: updatedExercise.cues,
          custom_notes: updatedExercise.notes,
          custom_difficulty: updatedExercise.difficulty,
          custom_setup: updatedExercise.setup,
          custom_reps_or_duration: updatedExercise.repsOrDuration,
          custom_tempo: updatedExercise.tempo,
          custom_target_areas: updatedExercise.targetAreas,
          custom_breathing_cues: updatedExercise.breathingCues,
          custom_teaching_focus: updatedExercise.teachingFocus,
          custom_modifications: updatedExercise.modifications,
        });
      } else {
        await updateUserExercise(updatedExercise.id, updatedExercise);
      }

      // Then update local state
      onUpdateExercise(updatedExercise);
      setSelectedExercise(updatedExercise);
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const handleAddCallout = (position: number) => {
    console.log('ClassBuilder handleAddCallout called with position:', position);
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

  // Improved grouping function
  const groupedExercises = () => {
    const groups: { callout: Exercise | null; exercises: Exercise[]; startIndex: number }[] = [];
    let currentGroup: Exercise[] = [];
    let startIndex = 0;
    
    currentClass.exercises.forEach((exercise, index) => {
      if (exercise.category === 'callout') {
        // If we have accumulated exercises, add them as an ungrouped section
        if (currentGroup.length > 0) {
          groups.push({ callout: null, exercises: currentGroup, startIndex });
          currentGroup = [];
        }
        
        // Start a new callout section
        const calloutExercises: Exercise[] = [];
        let nextIndex = index + 1;
        
        // Collect exercises until next callout or end of list
        while (nextIndex < currentClass.exercises.length && currentClass.exercises[nextIndex].category !== 'callout') {
          calloutExercises.push(currentClass.exercises[nextIndex]);
          nextIndex++;
        }
        
        groups.push({ callout: exercise, exercises: calloutExercises, startIndex: index + 1 });
        startIndex = nextIndex;
        
        // Skip the exercises we just processed
        for (let i = index + 1; i < nextIndex; i++) {
          // These are handled in the callout group
        }
      } else if (!groups.some(g => g.exercises.includes(exercise))) {
        // Only add if not already in a callout group
        currentGroup.push(exercise);
      }
    });
    
    // Add any remaining ungrouped exercises
    if (currentGroup.length > 0) {
      groups.push({ callout: null, exercises: currentGroup, startIndex });
    }
    
    return groups;
  };

  const DropZone = ({ index, className = "" }: { index: number; className?: string }) => (
    <div
      onDragOver={(e) => handleDragOver(e, index)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, index)}
      className={`transition-all duration-200 ${className} ${
        dragOverIndex === index ? 'bg-sage-100 border-2 border-dashed border-sage-400 rounded-lg py-2' : ''
      }`}
    >
      {dragOverIndex === index && (
        <div className="text-center text-sage-600 text-sm py-1">
          Drop here
        </div>
      )}
    </div>
  );

  // Helper component for Exercise Cards with improved mobile touch targets
  const ExerciseCard = ({ exercise, index }: { exercise: Exercise; index: number }) => {
    return (
      <>
        <DropZone index={index} />
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          className={`group mb-3 transition-all duration-300 active:scale-95 ${
            !isDragging || draggedIndex !== index ? 'cursor-pointer' : 'cursor-grabbing'
          } ${
            draggedIndex === index ? 'opacity-50 scale-95' : ''
          }`}
          onClick={() => handleExerciseClick(exercise)}
        >
          <Card className="border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 overflow-hidden rounded-xl mx-1 sm:mx-2 lg:ml-6">
            <CardContent className="p-2 sm:p-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div 
                  className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity pt-1 touch-manipulation"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-sage-500" />
                </div>

                <div className="flex-shrink-0 pt-0.5">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-xs sm:text-sm font-bold text-sage-600">{index + 1}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                    <h3 className="font-medium text-sage-800 text-sm sm:text-base leading-tight">
                      {exercise.name}
                    </h3>
                    <div className="flex gap-1 mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onAddToShortlist && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleShortlistExercise(exercise, e)}
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 sm:h-6 sm:w-6 p-0 touch-manipulation"
                        >
                          <Heart className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleRemoveExercise(exercise.id, e)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-6 sm:w-6 p-0 touch-manipulation"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-sage-500" />
                      <span className="text-sage-600 font-medium">{exercise.duration}min</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-sage-500">Springs:</span>
                      <SpringVisual springs={exercise.springs} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <Badge variant="outline" className="text-xs border-sage-300 text-sage-700 rounded-full">
                      {exercise.category}
                    </Badge>
                    {exercise.muscleGroups.slice(0, 2).map(group => (
                      <Badge key={group} variant="secondary" className="text-xs bg-sage-100 text-sage-700 rounded-full">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex-1 overflow-hidden">
        {/* Compact Class Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-sage-200 p-3 sm:p-4">
          <div className="flex items-center gap-4">
            {/* Class Image - Circle on left */}
            <Dialog open={showImageSelector} onOpenChange={setShowImageSelector}>
              <DialogTrigger asChild>
                <button className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-sage-300 hover:border-sage-400 transition-colors">
                  {currentClass.image ? (
                    <img 
                      src={currentClass.image} 
                      alt="Class" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-sage-100 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-sage-400" />
                    </div>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Class Image</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

            {/* Class Name - Editable */}
            <div className="flex-1">
              <Input
                value={currentClass.name}
                onChange={(e) => onUpdateClassName(e.target.value)}
                placeholder="Class Name"
                className="text-lg font-medium border-none shadow-none p-0 focus-visible:ring-0 bg-transparent text-sage-800"
              />
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sage-500" />
                  <Input
                    type="number"
                    value={currentClass.classDuration || 45}
                    onChange={(e) => onUpdateClassDuration(parseInt(e.target.value) || 45)}
                    className="w-16 h-6 text-sm border-sage-300"
                    min="15"
                    max="90"
                    step="5"
                  />
                  <span className="text-sm text-sage-600">min</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-sage-600">
                  <span>{currentClass.exercises.filter(ex => ex.category !== 'callout').length} exercises</span>
                  <span>{getMuscleGroupCoverage().length} muscle groups</span>
                </div>
              </div>
            </div>

            {/* Add Exercise Button - Single sage button */}
            <Button 
              onClick={onAddExercise}
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-full px-4 py-2 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </div>
        </div>

        {/* Class Timeline */}
        <div className="p-3">
          <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
            <div className="p-3">
              {currentClass.exercises.length === 0 ? (
                <div className="text-center py-8">
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
                  
                  <ExerciseSuggestions 
                    currentClass={currentClass} 
                    onAddExercise={onAddExercise}
                  />
                  
                  {/* Exercise list with improved mobile layout */}
                  {groupedExercises().map((group, groupIndex) => (
                    <div key={groupIndex}>
                      {group.callout ? (
                        <Collapsible
                          open={!collapsedSections.has(group.callout.id)}
                          onOpenChange={() => onToggleSectionCollapse(group.callout.id)}
                        >
                          {/* Callout header */}
                          <div className="relative mb-2 px-2 sm:px-4">
                            <div className={`border-l-4 pl-3 py-2 rounded-r-lg ${getCalloutColorClasses(group.callout.calloutColor).border} ${getCalloutColorClasses(group.callout.calloutColor).bg}`}>
                              <div className="flex items-center justify-between">
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" className={`flex items-center gap-2 p-0 h-auto hover:bg-transparent ${getCalloutColorClasses(group.callout.calloutColor).text}`}>
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
                                      <span className="font-medium text-xs sm:text-sm">{group.callout.name}</span>
                                    )}
                                    <Badge variant="secondary" className={`text-xs ml-2 ${getCalloutColorClasses(group.callout.calloutColor).bg} ${getCalloutColorClasses(group.callout.calloutColor).text}`}>
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
                                      startEditingCallout(group.callout!);
                                    }}
                                    className={`h-6 w-6 p-0 ${getCalloutColorClasses(group.callout.calloutColor).text}`}
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onDeleteCallout) onDeleteCallout(group.callout!.id);
                                    }}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Exercises inside CollapsibleContent */}
                          <CollapsibleContent>
                            <div className={`ml-2 sm:ml-4 border-l-2 pl-2 sm:pl-4 ${getCalloutColorClasses(group.callout.calloutColor).leftBorder}`}>
                              {group.exercises?.map((exercise) => {
                                const actualIndex = currentClass.exercises.findIndex(ex => ex.id === exercise.id);
                                return (
                                  <ExerciseCard 
                                    key={exercise.id} 
                                    exercise={exercise} 
                                    index={actualIndex}
                                  />
                                );
                              })}
                              
                              {/* Add section button at end of callout */}
                              <div className="flex justify-center py-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddCallout(group.startIndex + group.exercises.length)}
                                  className="rounded-full bg-sage-50 border-sage-300 hover:bg-sage-100 text-sage-700 text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Section
                                </Button>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        // Ungrouped exercises
                        <>
                          {group.exercises.map((exercise) => {
                            const actualIndex = currentClass.exercises.findIndex(ex => ex.id === exercise.id);
                            return (
                              <ExerciseCard 
                                key={exercise.id} 
                                exercise={exercise} 
                                index={actualIndex} 
                              />
                            );
                          })}
                          
                          {/* Add section button after ungrouped exercises */}
                          <div className="flex justify-center py-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddCallout(group.startIndex + group.exercises.length)}
                              className="rounded-full bg-sage-50 border-sage-300 hover:bg-sage-100 text-sage-700 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Section
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Final drop zone */}
                  <DropZone index={currentClass.exercises.length} className="min-h-4" />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedExercise(null);
        }}
        onSave={handleUpdateExerciseFromModal}
      />
    </>
  );
};
