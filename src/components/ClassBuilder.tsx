// src/components/ClassBuilder.tsx - Fixed version with consistent callout options
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, GripVertical, X, Clock, Save, Edit, ChevronDown, ChevronRight, Trash2, Palette } from 'lucide-react';
import { Exercise, ClassPlan, CustomCallout } from '@/types/reformer';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from '@/hooks/use-toast';

interface ClassBuilderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
  onAddCallout?: (name: string, position: number) => void;
}

// Default callout options that match the profile preferences
const defaultCalloutOptions = [
  { name: 'Warm Up', color: 'green' as const },
  { name: 'Main Workout', color: 'blue' as const },
  { name: 'Cool Down', color: 'purple' as const },
  { name: 'Break', color: 'amber' as const },
  { name: 'Transition', color: 'orange' as const },
  { name: 'Focus Section', color: 'red' as const },
];

// Color mapping for consistency
const getColorClasses = (color: string) => {
  const colorMap = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-100 text-green-800 border-green-200' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-100 text-red-800 border-red-200' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
    gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', badge: 'bg-gray-100 text-gray-800 border-gray-200' },
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.amber;
};

export const ClassBuilder = ({
  currentClass,
  onUpdateClassName,
  onRemoveExercise,
  onReorderExercises,
  onUpdateExercise,
  onSaveClass,
  onAddExercise,
  onAddCallout
}: ClassBuilderProps) => {
  const { preferences } = useUserPreferences();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  
  // Callout dialog state
  const [isCalloutDialogOpen, setIsCalloutDialogOpen] = useState(false);
  const [newCalloutName, setNewCalloutName] = useState('');
  const [newCalloutPosition, setNewCalloutPosition] = useState(0);
  const [selectedCalloutColor, setSelectedCalloutColor] = useState<string>('amber');

  // Get all available callout options (defaults + user custom)
  const allCalloutOptions = [
    ...defaultCalloutOptions,
    ...(preferences.customCallouts || []).map(callout => ({
      name: callout.name,
      color: callout.color,
      isCustom: true
    }))
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(currentClass.exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderExercises(items);
  };

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDetailModalOpen(true);
  };

  const handleUpdateExercise = async (updatedExercise: Exercise) => {
    onUpdateExercise(updatedExercise);
    setIsDetailModalOpen(false);
    setSelectedExercise(null);
  };

  const toggleSectionCollapse = (sectionName: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionName)) {
      newCollapsed.delete(sectionName);
    } else {
      newCollapsed.add(sectionName);
    }
    setCollapsedSections(newCollapsed);
  };

  const handleAddSection = (position: number) => {
    setNewCalloutPosition(position);
    setNewCalloutName('');
    setSelectedCalloutColor('amber');
    setIsCalloutDialogOpen(true);
  };

  const handleCreateSection = () => {
    if (newCalloutName.trim() && onAddCallout) {
      onAddCallout(newCalloutName.trim(), newCalloutPosition);
      setNewCalloutName('');
      setIsCalloutDialogOpen(false);
      toast({
        title: "Section added",
        description: `"${newCalloutName}" section has been added to your class.`,
      });
    }
  };

  const handleQuickSelectCallout = (calloutOption: typeof allCalloutOptions[0]) => {
    setNewCalloutName(calloutOption.name);
    setSelectedCalloutColor(calloutOption.color);
  };

  const groupExercisesBySection = () => {
    const sections: Array<{ 
      name: string; 
      exercises: Exercise[]; 
      color: string; 
      isCallout: boolean;
      colorClasses: ReturnType<typeof getColorClasses>;
    }> = [];
    let currentSection: Exercise[] = [];
    let currentSectionName = '';
    let currentSectionColor = 'gray';

    currentClass.exercises.forEach((exercise, index) => {
      if (exercise.category === 'callout') {
        // Save previous section if it has exercises
        if (currentSection.length > 0) {
          sections.push({
            name: currentSectionName || 'Exercises',
            exercises: currentSection,
            color: currentSectionColor,
            isCallout: false,
            colorClasses: getColorClasses(currentSectionColor)
          });
        }
        
        // Add the callout as a section
        const calloutColor = exercise.calloutColor || 'amber';
        sections.push({
          name: exercise.name,
          exercises: [exercise],
          color: calloutColor,
          isCallout: true,
          colorClasses: getColorClasses(calloutColor)
        });
        
        // Reset for next section
        currentSection = [];
        currentSectionName = exercise.name;
        currentSectionColor = calloutColor;
      } else {
        currentSection.push(exercise);
      }
    });

    // Add remaining exercises
    if (currentSection.length > 0) {
      sections.push({
        name: currentSectionName || 'Exercises',
        exercises: currentSection,
        color: currentSectionColor,
        isCallout: false,
        colorClasses: getColorClasses(currentSectionColor)
      });
    }

    return sections;
  };

  const sections = groupExercisesBySection();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Class Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={currentClass.name}
            onChange={(e) => onUpdateClassName(e.target.value)}
            className="text-xl font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
            placeholder="Class Name"
          />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{currentClass.totalDuration} min</span>
            <span>•</span>
            <span>{currentClass.exercises.filter(ex => ex.category !== 'callout').length} exercises</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
          <Button onClick={() => handleAddSection(0)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
          <Button onClick={onSaveClass} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Class
          </Button>
        </div>
      </div>

      {/* Exercise List */}
      {currentClass.exercises.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {sections.map((section, sectionIndex) => (
                  <div key={`section-${sectionIndex}`} className="space-y-2">
                    {section.isCallout ? (
                      // Render callout section
                      <Draggable
                        draggableId={section.exercises[0].id}
                        index={currentClass.exercises.findIndex(ex => ex.id === section.exercises[0].id)}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`rounded-lg border-2 border-dashed transition-colors ${
                              snapshot.isDragging 
                                ? `${section.colorClasses.border} ${section.colorClasses.bg}` 
                                : `${section.colorClasses.border} ${section.colorClasses.bg}/50`
                            }`}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab hover:text-gray-600" />
                                  </div>
                                  <button
                                    onClick={() => toggleSectionCollapse(section.name)}
                                    className={`flex items-center gap-2 text-lg font-semibold ${section.colorClasses.text}`}
                                  >
                                    {collapsedSections.has(section.name) ? (
                                      <ChevronRight className="h-5 w-5" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5" />
                                    )}
                                    {section.name}
                                  </button>
                                  <Badge className={section.colorClasses.badge}>
                                    Section
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleExerciseClick(section.exercises[0])}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 h-8 w-8 p-0">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Remove Section</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to remove the "{section.name}" section?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => onRemoveExercise(section.exercises[0].id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Remove
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ) : (
                      // Render regular exercise section
                      !collapsedSections.has(section.name) && (
                        <div className="space-y-2">
                          {section.exercises.map((exercise, exerciseIndex) => {
                            const globalIndex = currentClass.exercises.findIndex(ex => ex.id === exercise.id);
                            return (
                              <Draggable
                                key={exercise.id}
                                draggableId={exercise.id}
                                index={globalIndex}
                              >
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`transition-all duration-200 ${
                                      snapshot.isDragging 
                                        ? 'shadow-lg rotate-2 bg-sage-50' 
                                        : 'hover:shadow-md'
                                    }`}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-4">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="h-5 w-5 text-gray-400 cursor-grab hover:text-gray-600" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-gray-900 truncate">
                                              {exercise.name}
                                            </h3>
                                            <Badge variant="outline" className="text-xs">
                                              {exercise.category}
                                            </Badge>
                                            {exercise.isCustom && (
                                              <Badge className="text-xs bg-blue-100 text-blue-800">
                                                Custom
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {exercise.duration} min
                                            </span>
                                            <span>{exercise.springs}</span>
                                            <span className="capitalize">{exercise.difficulty}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleExerciseClick(exercise)}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 h-8 w-8 p-0">
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Remove Exercise</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Are you sure you want to remove "{exercise.name}" from your class?
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                  onClick={() => onRemoveExercise(exercise.id)}
                                                  className="bg-red-600 hover:bg-red-700"
                                                >
                                                  Remove
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            );
                          })}
                          
                          {/* Add section button after each section */}
                          <div className="flex justify-center py-2">
                            <Button
                              onClick={() => handleAddSection(
                                currentClass.exercises.findIndex(ex => ex.id === section.exercises[section.exercises.length - 1].id) + 1
                              )}
                              variant="outline"
                              size="sm"
                              className="text-sage-600 border-sage-200 hover:bg-sage-50"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Section
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-gray-500 mb-4">
            <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No exercises yet</p>
            <p className="text-sm">Add exercises to start building your class</p>
          </div>
          <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Exercise
          </Button>
        </div>
      )}

      {/* Callout Creation Dialog */}
      <Dialog open={isCalloutDialogOpen} onOpenChange={setIsCalloutDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Add Section
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Quick Select from Available Options */}
            <div>
              <label className="block text-sm font-medium mb-3">Quick Select</label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {allCalloutOptions.map((option, index) => {
                  const colorClasses = getColorClasses(option.color);
                  return (
                    <Button
                      key={`${option.name}-${index}`}
                      variant="outline"
                      onClick={() => handleQuickSelectCallout(option)}
                      className={`text-left justify-start h-auto p-3 ${
                        newCalloutName === option.name && selectedCalloutColor === option.color
                          ? `${colorClasses.bg} ${colorClasses.border}`
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-4 h-4 rounded-full ${colorClasses.bg} ${colorClasses.border} border-2`} />
                        <div className="flex-1">
                          <div className="font-medium">{option.name}</div>
                          {(option as any).isCustom && (
                            <div className="text-xs text-gray-500">Custom</div>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Custom Section Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Custom Section Name</label>
              <Input
                value={newCalloutName}
                onChange={(e) => setNewCalloutName(e.target.value)}
                placeholder="Enter custom section name..."
                className="w-full"
              />
            </div>
            
            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <Select value={selectedCalloutColor} onValueChange={setSelectedCalloutColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['amber', 'blue', 'green', 'purple', 'red', 'orange', 'gray'].map((color) => {
                    const colorClasses = getColorClasses(color);
                    return (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border-2 ${colorClasses.bg} ${colorClasses.border}`} />
                          <span className="capitalize">{color}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Preview */}
            {newCalloutName && (
              <div className="border rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className={`border-l-4 pl-3 py-2 rounded-r-lg ${getColorClasses(selectedCalloutColor).border} ${getColorClasses(selectedCalloutColor).bg}`}>
                  <span className={`font-medium ${getColorClasses(selectedCalloutColor).text}`}>
                    {newCalloutName}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCalloutDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSection} 
              disabled={!newCalloutName.trim()}
              className="bg-sage-600 hover:bg-sage-700"
            >
              Add Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedExercise(null);
        }}
        onAddToClass={() => {}} // Not used in this context
        onSave={handleUpdateExercise}
      />
    </div>
  );
};