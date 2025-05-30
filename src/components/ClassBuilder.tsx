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
  ChevronDown,
  ChevronRight,
  Settings2,
  Image as ImageIcon,
  Edit3,
  Target,
  Palette
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
  const [showCalloutSelector, setShowCalloutSelector] = useState(false);
  const [calloutInsertPosition, setCalloutInsertPosition] = useState(0);
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

  const handleAddCustomCallout = (callout: CustomCallout, position: number) => {
    if (onAddCallout) {
      const calloutExercise: Exercise = {
        id: `callout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: callout.name,
        category: 'callout',
        difficulty: 'beginner',
        intensityLevel: 'low',
        duration: 0,
        muscleGroups: [],
        equipment: [],
        springs: 'none',
        isPregnancySafe: true,
        description: `${callout.name} section divider`,
        calloutColor: callout.color,
        cues: [],
        notes: '',
        image: '',
        videoUrl: '',
        setup: '',
        repsOrDuration: '',
        tempo: '',
        targetAreas: [],
        breathingCues: [],
        teachingFocus: [],
        modifications: [],
        progressions: [],
        regressions: [],
        transitions: [],
        contraindications: []
      };

      const newExercises = [...currentClass.exercises];
      newExercises.splice(position, 0, calloutExercise);
      onReorderExercises(newExercises);
    }
    setShowCalloutSelector(false);
  };

  const handleAddDefaultCallout = (position: number) => {
    if (onAddCallout) {
      const calloutExercise: Exercise = {
        id: `callout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `Note ${Date.now()}`,
        category: 'callout',
        difficulty: 'beginner',
        intensityLevel: 'low',
        duration: 0,
        muscleGroups: [],
        equipment: [],
        springs: 'none',
        isPregnancySafe: true,
        description: 'Section divider',
        calloutColor: 'amber',
        cues: [],
        notes: '',
        image: '',
        videoUrl: '',
        setup: '',
        repsOrDuration: '',
        tempo: '',
        targetAreas: [],
        breathingCues: [],
        teachingFocus: [],
        modifications: [],
        progressions: [],
        regressions: [],
        transitions: [],
        contraindications: []
      };

      const newExercises = [...currentClass.exercises];
      newExercises.splice(position, 0, calloutExercise);
      onReorderExercises(newExercises);
    }
    setShowCalloutSelector(false);
  };

  const openCalloutSelector = (position: number) => {
    setCalloutInsertPosition(position);
    setShowCalloutSelector(true);
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

  const ExerciseCard = ({ exercise, index }: { exercise: Exercise; index: number }) => {
    return (
      <>
        <DropZone index={index} />
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          className={`group mb-3 transition-all duration-300 ${
            !isDragging || draggedIndex !== index ? 'cursor-pointer' : 'cursor-grabbing'
          } ${
            draggedIndex === index ? 'opacity-50 scale-95' : ''
          }`}
          onClick={() => handleExerciseClick(exercise)}
        >
          <Card className="border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 overflow-hidden rounded-xl mx-2 sm:ml-6">
            <CardContent className="p-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div 
                  className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity pt-1"
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
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 p-3 h-full">
          {/* Class Settings Sidebar - Full width on mobile */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
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
          </div>

          {/* Class Timeline - Full width on mobile */}
          <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col min-h-0">
            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden flex-1 flex flex-col">
              <CardHeader className="border-b border-sage-100 bg-gradient-to-r from-sage-50 to-white p-3 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <CardTitle className="text-lg text-sage-800">Class Timeline</CardTitle>
                    
                    {/* Inline Class Stats - Stack on mobile */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                    className="border-sage-300 hover:bg-sage-100 text-sage-700 rounded-full w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
                
                {currentClass.exercises.length > 0 && (
                  <p className="text-xs text-sage-600 mt-2">
                    Drag to reorder exercises
                  </p>
                )}
              </CardHeader>
              
              <div className="flex-1 overflow-y-auto px-3 py-2">
                {currentClass.exercises.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="bg-sage-50 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-sage-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-sage-700 mb-2">Start Building Your Class</h3>
                    <p className="text-sage-500 text-sm max-w-sm mx-auto mb-4 px-4">
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
                        onClick={() => openCalloutSelector(0)}
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
                            <div className="relative mb-2 px-4">
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
                                        <span className="font-medium">{group.callout.name}</span>
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
                                        startEditingCallout(group.callout);
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
                            
                            {/* Exercises inside CollapsibleContent */}
                            <CollapsibleContent>
                              <div className={`ml-4 border-l-2 pl-4 ${getCalloutColorClasses(group.callout.calloutColor).leftBorder}`}>
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
                                    onClick={() => openCalloutSelector(group.startIndex + group.exercises.length)}
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
                                onClick={() => openCalloutSelector(group.startIndex + group.exercises.length)}
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
                    <DropZone index={currentClass.exercises.length} className="mt-4" />
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom Callout Selector Dialog */}
      <Dialog open={showCalloutSelector} onOpenChange={setShowCalloutSelector}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Add Section Divider
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Default callout option */}
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={() => handleAddDefaultCallout(calloutInsertPosition)}
            >
              <div className="border-l-4 border-amber-400 pl-3 py-2 bg-amber-50 rounded-r flex-1 text-left">
                <span className="font-medium text-amber-700">Default Note</span>
              </div>
            </Button>

            {/* Custom callouts */}
            {(preferences.customCallouts || []).map((callout) => {
              const colorClasses = getCalloutColorClasses(callout.color);
              return (
                <Button
                  key={callout.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleAddCustomCallout(callout, calloutInsertPosition)}
                >
                  <div className={`border-l-4 ${colorClasses.border} pl-3 py-2 ${colorClasses.bg} rounded-r flex-1 text-left`}>
                    <span className={`font-medium ${colorClasses.text}`}>{callout.name}</span>
                  </div>
                </Button>
              );
            })}

            {(preferences.customCallouts || []).length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No custom callouts yet. Create some in your profile settings.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExercise(null);
          }}
          onEditExercise={handleUpdateExerciseFromModal}
        />
      )}
    </>
  );
};
