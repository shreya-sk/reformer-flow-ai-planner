
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Heart, Clock, Plus, Trash2, MessageSquarePlus, Edit2, Check, ChevronDown, ChevronRight, GripVertical, Users, AlertTriangle } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { exerciseDatabase } from '@/data/exercises';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { SpringVisual } from '@/components/SpringVisual';

interface TabbedPlanViewProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateClassName: (name: string) => void;
  onUpdateClassDuration: (duration: number) => void;
  onAddExercise: () => void;
  onAddCallout: (name: string, insertIndex?: number) => void;
}

export const TabbedPlanView = ({ 
  currentClass, 
  onRemoveExercise, 
  onUpdateClassName,
  onUpdateClassDuration,
  onAddExercise,
  onAddCallout
}: TabbedPlanViewProps) => {
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  const { addExercise, reorderExercises } = usePersistedClassPlan();
  const [activeTab, setActiveTab] = useState('plan');
  const [showCalloutInput, setShowCalloutInput] = useState(false);
  const [newCalloutName, setNewCalloutName] = useState('');
  const [calloutInsertIndex, setCalloutInsertIndex] = useState<number | undefined>();
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [tempDuration, setTempDuration] = useState(currentClass.classDuration);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [collapsedCallouts, setCollapsedCallouts] = useState<Set<string>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Get favorited exercises from the database
  const favoritedExercises = exerciseDatabase.filter(exercise => 
    preferences.favoriteExercises?.includes(exercise.id)
  );

  const handleAddFromShortlist = (exercise: Exercise) => {
    console.log('Adding exercise from shortlist:', exercise.name);
    addExercise(exercise);
  };

  const handleAddCallout = (insertIndex?: number) => {
    setCalloutInsertIndex(insertIndex);
    setShowCalloutInput(true);
  };

  const handleSaveCallout = () => {
    if (newCalloutName.trim()) {
      onAddCallout(newCalloutName.trim(), calloutInsertIndex);
      setNewCalloutName('');
      setShowCalloutInput(false);
      setCalloutInsertIndex(undefined);
    }
  };

  const handleCancelCallout = () => {
    setNewCalloutName('');
    setShowCalloutInput(false);
    setCalloutInsertIndex(undefined);
  };

  const handleDurationEdit = () => {
    onUpdateClassDuration(tempDuration);
    setIsEditingDuration(false);
  };

  const toggleExerciseExpanded = (exerciseId: string) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(exerciseId)) {
      newExpanded.delete(exerciseId);
    } else {
      newExpanded.add(exerciseId);
    }
    setExpandedExercises(newExpanded);
  };

  const toggleCalloutCollapsed = (calloutId: string) => {
    const newCollapsed = new Set(collapsedCallouts);
    if (newCollapsed.has(calloutId)) {
      newCollapsed.delete(calloutId);
    } else {
      newCollapsed.add(calloutId);
    }
    setCollapsedCallouts(newCollapsed);
  };

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
    
    reorderExercises(exercises);
    setDraggedIndex(null);
  };

  // Group exercises by callouts for better organization
  const getGroupedExercises = () => {
    const groups: Array<{ type: 'callout' | 'exercise', exercise?: Exercise, callout?: { name: string, id: string, exercises: Exercise[] }, index: number }> = [];
    let currentCallout: { name: string, id: string, exercises: Exercise[] } | null = null;
    
    currentClass.exercises.forEach((exercise, index) => {
      if (exercise.category === 'callout') {
        // Save previous callout if exists
        if (currentCallout && currentCallout.exercises.length > 0) {
          groups.push({ type: 'callout', callout: currentCallout, index: groups.length });
        }
        // Start new callout
        currentCallout = { name: exercise.name, id: exercise.id, exercises: [] };
      } else {
        if (currentCallout) {
          currentCallout.exercises.push(exercise);
        } else {
          // Exercise without callout
          groups.push({ type: 'exercise', exercise, index });
        }
      }
    });
    
    // Add final callout if exists
    if (currentCallout && currentCallout.exercises.length > 0) {
      groups.push({ type: 'callout', callout: currentCallout, index: groups.length });
    }
    
    return groups;
  };

  const ExerciseListItem = ({ exercise, showAddButton = false, showRemoveButton = false, isInCallout = false }: { 
    exercise: Exercise; 
    showAddButton?: boolean;
    showRemoveButton?: boolean;
    isInCallout?: boolean;
  }) => {
    const isExpanded = expandedExercises.has(exercise.id);
    
    return (
      <div className={`rounded-lg border transition-colors ${
        preferences.darkMode 
          ? 'border-gray-600 bg-gray-800' 
          : 'border-sage-200 bg-white hover:bg-sage-50'
      } ${isInCallout ? 'ml-4 border-l-4 border-l-sage-300' : ''}`}>
        {/* Main exercise info */}
        <div className="flex items-center gap-3 p-3">
          {!isInCallout && showRemoveButton && (
            <div
              draggable
              onDragStart={(e) => {
                const exerciseIndex = currentClass.exercises.findIndex(ex => ex.id === exercise.id);
                handleDragStart(e, exerciseIndex);
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                const exerciseIndex = currentClass.exercises.findIndex(ex => ex.id === exercise.id);
                handleDrop(e, exerciseIndex);
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
            </div>
          )}

          {/* Exercise thumbnail */}
          <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
            preferences.darkMode 
              ? 'bg-gradient-to-br from-gray-600 to-gray-700' 
              : 'bg-gradient-to-br from-sage-100 to-sage-200'
          }`}>
            {exercise.image ? (
              <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
            ) : (
              <img 
                src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
                alt="Default exercise"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Exercise details */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExerciseExpanded(exercise.id)}>
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold text-sm ${
                preferences.darkMode ? 'text-white' : 'text-sage-800'
              }`}>
                {exercise.name}
              </h4>
              {exercise.isPregnancySafe && (
                <Users className="h-4 w-4 text-pink-500" />
              )}
              {isExpanded ? (
                <ChevronDown className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
              ) : (
                <ChevronRight className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Clock className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                <span className={`text-xs ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  {exercise.repsOrDuration || `${exercise.duration}min`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>Springs:</span>
                <SpringVisual springs={exercise.springs} />
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge className={`text-xs ${
                preferences.darkMode 
                  ? 'bg-gray-700 text-gray-300 border-gray-600' 
                  : 'bg-sage-100 text-sage-700 border-sage-200'
              }`}>
                {exercise.category}
              </Badge>
              {exercise.muscleGroups.slice(0, 2).map(group => (
                <Badge key={group} variant="secondary" className="text-xs">
                  {group}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {showAddButton && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddFromShortlist(exercise);
                }}
                size="sm"
                className="h-8 w-8 p-0 bg-sage-600 hover:bg-sage-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {showRemoveButton && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveExercise(exercise.id);
                }}
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 ${
                  preferences.darkMode 
                    ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                    : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                }`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteExercise(exercise.id);
              }}
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 ${
                preferences.favoriteExercises?.includes(exercise.id)
                  ? 'text-red-500 hover:text-red-600' 
                  : preferences.darkMode 
                    ? 'text-gray-400 hover:text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${
                preferences.favoriteExercises?.includes(exercise.id) ? 'fill-current' : ''
              }`} />
            </Button>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className={`px-6 pb-4 border-t ${
            preferences.darkMode ? 'border-gray-700 bg-gray-750' : 'border-sage-100 bg-sage-25'
          }`}>
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
              <div>
                <span className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  Difficulty:
                </span>
                <span className={`ml-2 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  {exercise.difficulty}
                </span>
              </div>
              <div>
                <span className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  Intensity:
                </span>
                <span className={`ml-2 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  {exercise.intensityLevel}
                </span>
              </div>
            </div>
            
            {exercise.description && (
              <div className="mt-3">
                <span className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  Description:
                </span>
                <p className={`mt-1 text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  {exercise.description}
                </p>
              </div>
            )}

            {exercise.cues && exercise.cues.length > 0 && (
              <div className="mt-3">
                <span className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  Teaching Cues:
                </span>
                <ul className={`mt-1 text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  {exercise.cues.map((cue, index) => (
                    <li key={index} className="ml-4 list-disc">{cue}</li>
                  ))}
                </ul>
              </div>
            )}

            {exercise.contraindications && exercise.contraindications.length > 0 && (
              <div className="mt-3">
                <span className={`font-medium text-amber-600 flex items-center gap-1`}>
                  <AlertTriangle className="h-4 w-4" />
                  Contraindications:
                </span>
                <ul className="mt-1 text-sm text-amber-700">
                  {exercise.contraindications.map((contra, index) => (
                    <li key={index} className="ml-4 list-disc">{contra}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const CalloutHeader = ({ callout, exerciseCount }: { callout: { name: string, id: string }, exerciseCount: number }) => {
    const isCollapsed = collapsedCallouts.has(callout.id);
    
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed cursor-pointer ${
          preferences.darkMode 
            ? 'border-gray-500 bg-gray-700 hover:bg-gray-650' 
            : 'border-sage-300 bg-sage-50 hover:bg-sage-100'
        }`}
        onClick={() => toggleCalloutCollapsed(callout.id)}
      >
        {isCollapsed ? (
          <ChevronRight className={`h-5 w-5 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
        ) : (
          <ChevronDown className={`h-5 w-5 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
        )}
        <MessageSquarePlus className={`h-5 w-5 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
        <h3 className={`font-semibold text-lg ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
          {callout.name}
        </h3>
        <Badge variant="secondary" className="ml-auto">
          {exerciseCount} exercises
        </Badge>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveExercise(callout.id);
          }}
          size="sm"
          variant="ghost"
          className={`h-6 w-6 p-0 ${
            preferences.darkMode 
              ? 'text-red-400 hover:text-red-300' 
              : 'text-red-500 hover:text-red-700'
          }`}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className={`h-full ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 to-white'}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b p-4`}>
          <TabsList className={`w-full ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'}`}>
            <TabsTrigger value="shortlist" className="flex-1 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Shortlist ({favoritedExercises.length})
            </TabsTrigger>
            <TabsTrigger value="plan" className="flex-1 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Class Plan ({currentClass.exercises.filter(ex => ex.category !== 'callout').length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="shortlist" className="flex-1 p-6 mt-0">
          <Card className={`h-full ${preferences.darkMode ? 'border-gray-600 bg-gray-800' : 'border-sage-200 bg-white'}`}>
            <CardHeader>
              <CardTitle className={`text-lg ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Favorite Exercises
              </CardTitle>
              <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                Your favorited exercises ready to add to classes
              </p>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
              {favoritedExercises.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className={`h-12 w-12 mx-auto mb-4 ${
                    preferences.darkMode ? 'text-gray-600' : 'text-sage-300'
                  }`} />
                  <h3 className={`text-lg font-medium mb-2 ${
                    preferences.darkMode ? 'text-gray-300' : 'text-sage-600'
                  }`}>
                    No favorites yet
                  </h3>
                  <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                    Browse the exercise library and favorite exercises to see them here
                  </p>
                  <Button 
                    onClick={onAddExercise}
                    className="mt-4 bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
                  >
                    Browse Exercises
                  </Button>
                </div>
              ) : (
                favoritedExercises.map((exercise) => (
                  <ExerciseListItem 
                    key={exercise.id} 
                    exercise={exercise} 
                    showAddButton={true}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="flex-1 p-6 mt-0">
          <Card className={`h-full ${preferences.darkMode ? 'border-gray-600 bg-gray-800' : 'border-sage-200 bg-white'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <input
                    type="text"
                    value={currentClass.name}
                    onChange={(e) => onUpdateClassName(e.target.value)}
                    className={`text-lg font-semibold bg-transparent border-none outline-none ${
                      preferences.darkMode ? 'text-white' : 'text-sage-800'
                    }`}
                    placeholder="Class name..."
                  />
                  <div className="flex items-center gap-4 mt-1">
                    <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                      {currentClass.exercises.filter(ex => ex.category !== 'callout').length} exercises • {currentClass.totalDuration} minutes
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                        Class Duration:
                      </span>
                      {isEditingDuration ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={tempDuration}
                            onChange={(e) => setTempDuration(parseInt(e.target.value) || 45)}
                            className="w-16 h-6 text-xs"
                            min="15"
                            max="120"
                          />
                          <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>min</span>
                          <Button onClick={handleDurationEdit} size="sm" variant="ghost" className="h-6 px-2">
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className={`text-sm font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                            {currentClass.classDuration}min
                          </span>
                          <Button
                            onClick={() => setIsEditingDuration(true)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleAddCallout()}
                    size="sm"
                    variant="outline"
                    className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
                  >
                    <MessageSquarePlus className="h-4 w-4 mr-1" />
                    Add Callout
                  </Button>
                  <Button 
                    onClick={onAddExercise}
                    size="sm"
                    className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
              {/* Callout Input */}
              {showCalloutInput && (
                <div className={`p-3 rounded-lg border ${
                  preferences.darkMode ? 'border-gray-600 bg-gray-700' : 'border-sage-200 bg-sage-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={newCalloutName}
                      onChange={(e) => setNewCalloutName(e.target.value)}
                      placeholder="Enter callout name (e.g., Warm-up, Standing)"
                      className={`flex-1 ${preferences.darkMode ? 'border-gray-600 bg-gray-800' : 'border-sage-300'}`}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveCallout()}
                    />
                    <Button onClick={handleSaveCallout} size="sm" disabled={!newCalloutName.trim()}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleCancelCallout} size="sm" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {currentClass.exercises.length === 0 ? (
                <div className="text-center py-12">
                  <Plus className={`h-12 w-12 mx-auto mb-4 ${
                    preferences.darkMode ? 'text-gray-600' : 'text-sage-300'
                  }`} />
                  <h3 className={`text-lg font-medium mb-2 ${
                    preferences.darkMode ? 'text-gray-300' : 'text-sage-600'
                  }`}>
                    Start building your class
                  </h3>
                  <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                    Add exercises from your favorites or browse the exercise library
                  </p>
                  <Button 
                    onClick={onAddExercise}
                    className="mt-4 bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
                  >
                    Browse Exercises
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {getGroupedExercises().map((group, groupIndex) => (
                    <div key={groupIndex}>
                      {group.type === 'callout' && group.callout ? (
                        <Collapsible open={!collapsedCallouts.has(group.callout.id)}>
                          <CollapsibleTrigger asChild>
                            <div>
                              <CalloutHeader 
                                callout={group.callout} 
                                exerciseCount={group.callout.exercises.length} 
                              />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-2 mt-2">
                              {group.callout.exercises.map((exercise) => (
                                <ExerciseListItem 
                                  key={exercise.id} 
                                  exercise={exercise} 
                                  showRemoveButton={true}
                                  isInCallout={true}
                                />
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : group.exercise ? (
                        <ExerciseListItem 
                          exercise={group.exercise} 
                          showRemoveButton={true}
                        />
                      ) : null}
                      
                      {/* Add Callout Button between items */}
                      <div className="flex justify-center py-2">
                        <Button
                          onClick={() => handleAddCallout(groupIndex + 1)}
                          size="sm"
                          variant="ghost"
                          className={`text-xs ${preferences.darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-sage-400 hover:text-sage-600'}`}
                        >
                          <MessageSquarePlus className="h-3 w-3 mr-1" />
                          Add Callout Here
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
