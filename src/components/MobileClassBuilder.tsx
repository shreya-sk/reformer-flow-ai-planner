import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Clock, Edit, ChevronDown, ChevronRight, Trash2, ArrowUp, ArrowDown, X } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { ModernExerciseModal } from '@/components/ModernExerciseModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MobileClassBuilderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
  onAddCallout?: (name: string, position: number) => void;
}

export const MobileClassBuilder = ({
  currentClass,
  onUpdateClassName,
  onRemoveExercise,
  onReorderExercises,
  onUpdateExercise,
  onSaveClass,
  onAddExercise,
  onAddCallout
}: MobileClassBuilderProps) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isCalloutDialogOpen, setIsCalloutDialogOpen] = useState(false);
  const [newCalloutName, setNewCalloutName] = useState('');
  const [newCalloutPosition, setNewCalloutPosition] = useState(0);

  // Calculate real exercise count for save validation
  const realExercises = currentClass.exercises.filter(ex => ex.category !== 'callout');
  const canSave = realExercises.length > 0;

  // Move exercise up or down
  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const exercises = [...currentClass.exercises];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= exercises.length) return;
    
    [exercises[index], exercises[newIndex]] = [exercises[newIndex], exercises[index]];
    onReorderExercises(exercises);
  };

  // Toggle card expansion
  const toggleCardExpansion = (exerciseId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(exerciseId)) {
      newExpanded.delete(exerciseId);
    } else {
      newExpanded.add(exerciseId);
    }
    setExpandedCards(newExpanded);
  };

  // Handle exercise edit
  const handleExerciseEdit = (exercise: Exercise) => {
    console.log('📝 Opening exercise for editing:', exercise.name);
    setSelectedExercise(exercise);
    setIsDetailModalOpen(true);
  };

  // Handle exercise update
  const handleUpdateExercise = async (updatedExercise: Exercise) => {
    console.log('💾 Saving exercise updates:', updatedExercise.name);
    onUpdateExercise(updatedExercise);
    setIsDetailModalOpen(false);
    setSelectedExercise(null);
    
    // Removed toast - using console log for feedback
    console.log(`✅ Exercise "${updatedExercise.name}" updated successfully`);
  };

  // Handle adding a new callout section
  const handleAddSection = (position: number) => {
    setNewCalloutPosition(position);
    setNewCalloutName('');
    setIsCalloutDialogOpen(true);
  };

  // Handle creating a new callout section
  const handleCreateSection = () => {
    if (newCalloutName.trim() && onAddCallout) {
      onAddCallout(newCalloutName.trim(), newCalloutPosition);
      setNewCalloutName('');
      setIsCalloutDialogOpen(false);
      console.log(`✅ Section "${newCalloutName}" created successfully`);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-3 p-3">
      {/* Compact Class Header */}
      <Card className="shadow-sm border-sage-200">
        <CardContent className="p-4">
          <Input
            value={currentClass.name}
            onChange={(e) => onUpdateClassName(e.target.value)}
            className="text-lg font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0 mb-3 bg-transparent"
            placeholder="Class Name"
          />
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{currentClass.totalDuration} min</span>
              </div>
              <div className="bg-sage-100 text-sage-700 px-2 py-1 rounded-full text-xs">
                {realExercises.length} exercises
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={onAddExercise} size="sm" className="bg-sage-600 hover:bg-sage-700 flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
            <Button onClick={() => handleAddSection(0)} variant="outline" size="sm" className="px-3">
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onSaveClass} 
              size="sm" 
              variant="outline"
              disabled={!canSave}
              className={`px-4 ${!canSave ? 'opacity-50 cursor-not-allowed' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
            >
              Save
            </Button>
          </div>
          
          {!canSave && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Add at least one exercise to save your class
            </p>
          )}
        </CardContent>
      </Card>

      {/* Exercise List */}
      {currentClass.exercises.length > 0 ? (
        <div className="space-y-2">
          {currentClass.exercises.map((exercise, index) => (
            <div key={exercise.id}>
              {exercise.category === 'callout' ? (
                // Callout Section
                <Card className="border-2 border-dashed border-amber-200 bg-amber-50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-amber-600" />
                        <span className="font-medium text-amber-800">{exercise.name}</span>
                        <Badge className="bg-amber-100 text-amber-800 text-xs">Section</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExerciseEdit(exercise)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-red-600 h-7 w-7 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Section</AlertDialogTitle>
                              <AlertDialogDescription>
                                Remove "{exercise.name}" section?
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
              ) : (
                // Exercise Card
                <Card className="shadow-sm border-sage-100">
                  <Collapsible>
                    <CardContent className="p-3">
                      {/* Basic Exercise Info */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 mr-3">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 text-sm leading-tight">
                              {exercise.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {exercise.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {exercise.duration} min
                            </span>
                            <span>{exercise.springs}</span>
                            <span className="capitalize">{exercise.difficulty}</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          {/* Move Up/Down */}
                          <div className="flex flex-col">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveExercise(index, 'up')}
                              disabled={index === 0}
                              className="h-5 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveExercise(index, 'down')}
                              disabled={index === currentClass.exercises.length - 1}
                              className="h-5 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {/* Expand/Collapse */}
                          <CollapsibleTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleCardExpansion(exercise.id)}
                              className="h-7 w-7 p-0"
                            >
                              {expandedCards.has(exercise.id) ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          
                          {/* Edit */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExerciseEdit(exercise)}
                            className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          
                          {/* Remove */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="text-red-600 h-7 w-7 p-0">
                                <X className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Exercise</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Remove "{exercise.name}" from your class?
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
                      
                      {/* Expanded Details */}
                      <CollapsibleContent className="space-y-2">
                        {exercise.description && (
                          <p className="text-xs text-gray-600 leading-relaxed">{exercise.description}</p>
                        )}
                        {exercise.cues && exercise.cues.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Cues:</p>
                            <p className="text-xs text-gray-600">{exercise.cues.join(', ')}</p>
                          </div>
                        )}
                        {exercise.notes && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Notes:</p>
                            <p className="text-xs text-gray-600">{exercise.notes}</p>
                          </div>
                        )}
                      </CollapsibleContent>
                    </CardContent>
                  </Collapsible>
                </Card>
              )}
              
              {/* Add Section Button */}
              {index < currentClass.exercises.length - 1 && (
                <div className="flex justify-center py-1">
                  <Button
                    onClick={() => handleAddSection(index + 1)}
                    variant="outline"
                    size="sm"
                    className="text-sage-600 border-sage-200 hover:bg-sage-50 h-6 px-2 text-xs"
                  >
                    <Plus className="h-2 w-2 mr-1" />
                    Section
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="p-6 text-center">
            <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">No exercises yet</p>
            <p className="text-xs text-gray-500 mb-3">Add exercises to start building your class</p>
            <Button onClick={onAddExercise} size="sm" className="bg-sage-600 hover:bg-sage-700">
              <Plus className="h-3 w-3 mr-1" />
              Add Exercise
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Callout Creation Dialog */}
      <Dialog open={isCalloutDialogOpen} onOpenChange={setIsCalloutDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Name</label>
              <Input
                value={newCalloutName}
                onChange={(e) => setNewCalloutName(e.target.value)}
                placeholder="e.g., Warm Up, Main Workout..."
                className="w-full"
              />
            </div>
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

      {/* Exercise Detail Modal - Updated to use ModernExerciseModal */}
      {selectedExercise && (
        <ModernExerciseModal
          exercise={selectedExercise}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedExercise(null);
          }}
          onEdit={() => {
            // Already in edit mode
          }}
        />
      )}
    </div>
  );
};
