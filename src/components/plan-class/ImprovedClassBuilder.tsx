
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Save, Clock } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SectionHeader } from './SectionHeader';
import { ExerciseCard } from './ExerciseCard';
import { createSectionExercise, countRealExercises, calculateTotalDuration } from '@/utils/exerciseUtils';

interface ImprovedClassBuilderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
  onEditExercise: (exercise: Exercise) => void;
}

export const ImprovedClassBuilder = ({
  currentClass,
  onUpdateClassName,
  onRemoveExercise,
  onReorderExercises,
  onUpdateExercise,
  onSaveClass,
  onAddExercise,
  onEditExercise
}: ImprovedClassBuilderProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [sectionPosition, setSectionPosition] = useState(0);

  const realExerciseCount = countRealExercises(currentClass.exercises);
  const totalDuration = calculateTotalDuration(currentClass.exercises);

  // Group exercises by sections
  const exerciseGroups = [];
  let currentGroup = { section: null, exercises: [] };

  for (const exercise of currentClass.exercises) {
    if (exercise.category === 'callout') {
      if (currentGroup.exercises.length > 0) {
        exerciseGroups.push(currentGroup);
      }
      exerciseGroups.push({ section: exercise, exercises: [] });
      currentGroup = { section: null, exercises: [] };
    } else {
      currentGroup.exercises.push(exercise);
    }
  }

  if (currentGroup.exercises.length > 0) {
    exerciseGroups.push(currentGroup);
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const exercises = [...currentClass.exercises];
    const [reorderedItem] = exercises.splice(result.source.index, 1);
    exercises.splice(result.destination.index, 0, reorderedItem);

    onReorderExercises(exercises);
  };

  const handleAddSection = (position: number) => {
    setSectionPosition(position);
    setNewSectionName('');
    setShowSectionDialog(true);
  };

  const handleCreateSection = () => {
    if (newSectionName.trim()) {
      const newSection = createSectionExercise(newSectionName.trim());
      const exercises = [...currentClass.exercises];
      exercises.splice(sectionPosition, 0, newSection);
      onReorderExercises(exercises);
      setShowSectionDialog(false);
    }
  };

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const updateSection = (sectionId: string, updatedSection: Exercise) => {
    const exercises = currentClass.exercises.map(ex => 
      ex.id === sectionId ? updatedSection : ex
    );
    onReorderExercises(exercises);
  };

  const deleteSection = (sectionId: string) => {
    const exercises = currentClass.exercises.filter(ex => ex.id !== sectionId);
    onReorderExercises(exercises);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Class Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="space-y-3">
            <Input
              value={currentClass.name}
              onChange={(e) => onUpdateClassName(e.target.value)}
              className="text-xl font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
              placeholder="Class Name"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalDuration} min</span>
                </div>
                <span>{realExerciseCount} exercises</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={onAddExercise} 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Exercise
                </Button>
                <Button 
                  onClick={onSaveClass} 
                  size="sm"
                  disabled={realExerciseCount === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Add First Section Button */}
      {currentClass.exercises.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Start Building Your Class</h3>
                <p className="text-sm text-gray-500">Add sections to organize your exercises</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => handleAddSection(0)}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
                <Button 
                  onClick={onAddExercise}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Groups */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="exercises">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {exerciseGroups.map((group, groupIndex) => {
                if (group.section) {
                  // Section Header
                  const isExpanded = expandedSections.has(group.section.id);
                  const sectionExerciseCount = countRealExercises(group.exercises);
                  const sectionDuration = calculateTotalDuration(group.exercises);
                  
                  return (
                    <div key={group.section.id}>
                      <SectionHeader
                        section={group.section}
                        isExpanded={isExpanded}
                        exerciseCount={sectionExerciseCount}
                        totalDuration={sectionDuration}
                        onToggleExpand={() => toggleSectionExpansion(group.section.id)}
                        onUpdateSection={(updated) => updateSection(group.section.id, updated)}
                        onDeleteSection={() => deleteSection(group.section.id)}
                        onAddExercise={onAddExercise}
                      />
                      
                      {/* Add section button after this section */}
                      <div className="flex justify-center py-2">
                        <Button
                          onClick={() => handleAddSection(groupIndex + 1)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Section
                        </Button>
                      </div>
                    </div>
                  );
                } else {
                  // Exercise Group
                  return (
                    <div key={`group-${groupIndex}`} className="space-y-1">
                      {group.exercises.map((exercise, exerciseIndex) => {
                        const globalIndex = currentClass.exercises.indexOf(exercise);
                        return (
                          <Draggable 
                            key={exercise.id} 
                            draggableId={exercise.id} 
                            index={globalIndex}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}
                              >
                                <ExerciseCard
                                  exercise={exercise}
                                  index={exerciseIndex}
                                  onEdit={() => onEditExercise(exercise)}
                                  onRemove={() => onRemoveExercise(exercise.id)}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    </div>
                  );
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Section Creation Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Name</label>
              <Input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="e.g., Warm Up, Main Workout, Cool Down"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateSection();
                }}
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSectionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSection} 
              disabled={!newSectionName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
