
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
import { Plus, GripVertical, X, Clock, Save, Edit, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
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
  
  const [isCalloutDialogOpen, setIsCalloutDialogOpen] = useState(false);
  const [newCalloutName, setNewCalloutName] = useState('');
  const [newCalloutPosition, setNewCalloutPosition] = useState(0);
  const [selectedCalloutColor, setSelectedCalloutColor] = useState('amber');

  // Default callouts
  const defaultCallouts = [
    { name: 'Warm Up', color: 'green' },
    { name: 'Main Workout', color: 'blue' },
    { name: 'Cool Down', color: 'purple' },
    { name: 'Break', color: 'gray' },
    { name: 'Transition', color: 'orange' }
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

  const groupExercisesBySection = () => {
    const sections: Array<{ name: string; exercises: Exercise[]; color: string; isCallout: boolean }> = [];
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
            isCallout: false
          });
        }
        
        // Add the callout as a section
        sections.push({
          name: exercise.name,
          exercises: [exercise],
          color: exercise.calloutColor || 'amber',
          isCallout: true
        });
        
        // Reset for next section
        currentSection = [];
        currentSectionName = exercise.name;
        currentSectionColor = exercise.calloutColor || 'gray';
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
        isCallout: false
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
            className="text-xl font-semibold border-none shadow-none p-0 h-auto"
            placeholder="Class Name"
          />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{currentClass.totalDuration} min</span>
            <span>•</span>
            <span>{currentClass.exercises.length} exercises</span>
          </div>
        </div>
        
        <div className="flex gap-2">
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
                                ? `border-${section.color}-400 bg-${section.color}-50` 
                                : `border-${section.color}-200 bg-${section.color}-25`
                            }`}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                                  </div>
                                  <button
                                    onClick={() => toggleSectionCollapse(section.name)}
                                    className="flex items-center gap-2 text-lg font-semibold text-gray-800"
                                  >
                                    {collapsedSections.has(section.name) ? (
                                      <ChevronRight className="h-5 w-5" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5" />
                                    )}
                                    {section.name}
                                  </button>
                                  <Badge 
                                    className={`bg-${section.color}-100 text-${section.color}-800 border-${section.color}-200`}
                                  >
                                    Section
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleExerciseClick(section.exercises[0])}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
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
                                          <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
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
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
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
                              onClick={() => handleAddSection(currentClass.exercises.findIndex(ex => ex.id === section.exercises[section.exercises.length - 1].id) + 1)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Name</label>
              <Input
                value={newCalloutName}
                onChange={(e) => setNewCalloutName(e.target.value)}
                placeholder="Enter section name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <Select value={selectedCalloutColor} onValueChange={setSelectedCalloutColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amber">Amber</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Select Buttons */}
            <div>
              <label className="block text-sm font-medium mb-2">Quick Select</label>
              <div className="grid grid-cols-2 gap-2">
                {defaultCallouts.map((callout) => (
                  <Button
                    key={callout.name}
                    variant="outline"
                    onClick={() => {
                      setNewCalloutName(callout.name);
                      setSelectedCalloutColor(callout.color);
                    }}
                    className="text-left justify-start"
                  >
                    <div className={`w-3 h-3 rounded-full bg-${callout.color}-500 mr-2`} />
                    {callout.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Callouts */}
            {preferences.customCallouts && preferences.customCallouts.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Your Custom Sections</label>
                <div className="grid grid-cols-1 gap-2">
                  {preferences.customCallouts.map((callout) => (
                    <Button
                      key={callout.id}
                      variant="outline"
                      onClick={() => {
                        setNewCalloutName(callout.name);
                        setSelectedCalloutColor(callout.color);
                      }}
                      className="text-left justify-start"
                    >
                      <div className={`w-3 h-3 rounded-full bg-${callout.color}-500 mr-2`} />
                      {callout.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCalloutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSection} disabled={!newCalloutName.trim()}>
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
