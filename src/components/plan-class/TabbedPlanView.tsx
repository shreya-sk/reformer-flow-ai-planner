
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  Plus, 
  X, 
  GripVertical, 
  ChevronDown, 
  ChevronRight,
  Users,
  Baby,
  Settings,
  Lightbulb,
  FolderPlus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { SpringVisual } from '@/components/SpringVisual';
import { SmartExerciseSuggestions } from '@/components/SmartExerciseSuggestions';

interface TabbedPlanViewProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateClassName: (name: string) => void;
  onUpdateClassDuration: (duration: number) => void;
  onAddExercise: () => void;
  onAddCallout: (name: string) => void;
  onUpdateCallout?: (calloutId: string, newName: string) => void;
  onDeleteCallout?: (calloutId: string) => void;
  onMoveExerciseBetweenCallouts?: (exerciseId: string, fromCalloutId: string, toCalloutId: string) => void;
  onReorderExercises?: (exercises: Exercise[]) => void;
}

interface CalloutSection {
  id: string;
  name: string;
  exercises: Exercise[];
  isCollapsed: boolean;
}

export const TabbedPlanView = ({
  currentClass,
  onRemoveExercise,
  onUpdateClassName,
  onUpdateClassDuration,
  onAddExercise,
  onAddCallout,
  onUpdateCallout,
  onDeleteCallout,
  onMoveExerciseBetweenCallouts,
  onReorderExercises
}: TabbedPlanViewProps) => {
  const { preferences } = useUserPreferences();
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [newCalloutName, setNewCalloutName] = useState('');
  const [showAddCallout, setShowAddCallout] = useState(false);
  const [editingCallout, setEditingCallout] = useState<string | null>(null);
  const [editCalloutName, setEditCalloutName] = useState('');

  // Organize exercises into callout sections
  const [calloutSections, setCalloutSections] = useState<CalloutSection[]>(() => {
    const sections: CalloutSection[] = [];
    let currentSection: CalloutSection | null = null;
    
    currentClass.exercises.forEach(exercise => {
      if (exercise.category === 'callout') {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          id: exercise.id,
          name: exercise.name,
          exercises: [],
          isCollapsed: false
        };
      } else if (currentSection) {
        currentSection.exercises.push(exercise);
      } else {
        if (sections.length === 0) {
          sections.push({
            id: 'default',
            name: 'Exercises',
            exercises: [exercise],
            isCollapsed: false
          });
        } else {
          sections[sections.length - 1].exercises.push(exercise);
        }
      }
    });
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections.length > 0 ? sections : [{
      id: 'default',
      name: 'Exercises',
      exercises: [],
      isCollapsed: false
    }];
  });

  const handleAddExerciseWithReturn = (exercise: Exercise) => {
    // This will be called from SmartExerciseSuggestions
    const exerciseCopy: Exercise = {
      ...exercise,
      id: `${exercise.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      muscleGroups: [...exercise.muscleGroups],
      equipment: [...exercise.equipment],
      cues: exercise.cues ? [...exercise.cues] : [],
      progressions: exercise.progressions ? [...exercise.progressions] : [],
      regressions: exercise.regressions ? [...exercise.regressions] : [],
      contraindications: exercise.contraindications ? [...exercise.contraindications] : [],
      transitions: exercise.transitions ? [...exercise.transitions] : [],
      targetAreas: exercise.targetAreas ? [...exercise.targetAreas] : [],
      teachingFocus: exercise.teachingFocus ? [...exercise.teachingFocus] : [],
    };
    
    // Add to current class through the parent component
    if (onReorderExercises) {
      const newExercises = [...currentClass.exercises, exerciseCopy];
      onReorderExercises(newExercises);
    }
  };

  const toggleExpandExercise = (exerciseId: string) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(exerciseId)) {
      newExpanded.delete(exerciseId);
    } else {
      newExpanded.add(exerciseId);
    }
    setExpandedExercises(newExpanded);
  };

  const toggleCollapseSection = (sectionId: string) => {
    setCalloutSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, isCollapsed: !section.isCollapsed }
          : section
      )
    );
  };

  const handleAddCallout = () => {
    if (newCalloutName.trim()) {
      onAddCallout(newCalloutName.trim());
      setNewCalloutName('');
      setShowAddCallout(false);
      
      setCalloutSections(prev => [...prev, {
        id: `callout-${Date.now()}`,
        name: newCalloutName.trim(),
        exercises: [],
        isCollapsed: false
      }]);
    }
  };

  const startEditingCallout = (section: CalloutSection) => {
    setEditingCallout(section.id);
    setEditCalloutName(section.name);
  };

  const saveCalloutEdit = () => {
    if (editingCallout && editCalloutName.trim() && onUpdateCallout) {
      onUpdateCallout(editingCallout, editCalloutName.trim());
      setCalloutSections(prev => 
        prev.map(section => 
          section.id === editingCallout 
            ? { ...section, name: editCalloutName.trim() }
            : section
        )
      );
      setEditingCallout(null);
      setEditCalloutName('');
    }
  };

  const deleteCallout = (sectionId: string) => {
    if (window.confirm('Delete this callout? Exercises will be moved to the main section.')) {
      if (onDeleteCallout) {
        onDeleteCallout(sectionId);
      }
      setCalloutSections(prev => prev.filter(section => section.id !== sectionId));
    }
  };

  const moveExercise = (exerciseId: string, direction: 'up' | 'down', sectionId: string) => {
    setCalloutSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const exercises = [...section.exercises];
        const index = exercises.findIndex(ex => ex.id === exerciseId);
        if (index === -1) return section;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= exercises.length) return section;
        
        [exercises[index], exercises[newIndex]] = [exercises[newIndex], exercises[index]];
        
        return { ...section, exercises };
      }
      return section;
    }));
  };

  return (
    <div className={`flex-1 ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} overflow-hidden`}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Class Settings */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
            <CardHeader>
              <CardTitle className={`text-lg ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Class Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    Class Name
                  </label>
                  <Input
                    value={currentClass.name}
                    onChange={(e) => onUpdateClassName(e.target.value)}
                    className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-300'}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    Class Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={currentClass.classDuration || 45}
                    onChange={(e) => onUpdateClassDuration(parseInt(e.target.value) || 45)}
                    min="15"
                    max="120"
                    className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-300'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Exercise Suggestions */}
          <SmartExerciseSuggestions 
            currentClass={currentClass} 
            onAddExercise={handleAddExerciseWithReturn}
          />

          {/* Add Callout Section */}
          <div className="flex items-center gap-2">
            {showAddCallout ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={newCalloutName}
                  onChange={(e) => setNewCalloutName(e.target.value)}
                  placeholder="Enter callout name (e.g., Core Work, Leg Series)"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCallout()}
                />
                <Button onClick={handleAddCallout} size="sm" className="bg-sage-600 hover:bg-sage-700">
                  Add
                </Button>
                <Button onClick={() => setShowAddCallout(false)} size="sm" variant="outline">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAddCallout(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                Add Section
              </Button>
            )}
          </div>

          {/* Callout Sections */}
          {calloutSections.map((section) => (
            <Card key={section.id} className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => toggleCollapseSection(section.id)}
                  >
                    {section.isCollapsed ? (
                      <ChevronRight className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                    ) : (
                      <ChevronDown className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                    )}
                    {editingCallout === section.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editCalloutName}
                          onChange={(e) => setEditCalloutName(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && saveCalloutEdit()}
                          autoFocus
                        />
                        <Button onClick={saveCalloutEdit} size="sm" variant="outline">
                          Save
                        </Button>
                        <Button onClick={() => setEditingCallout(null)} size="sm" variant="ghost">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <CardTitle className={`text-lg ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                          {section.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {section.exercises.length} exercises
                        </Badge>
                      </>
                    )}
                  </div>
                  
                  {editingCallout !== section.id && section.id !== 'default' && (
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => startEditingCallout(section)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => deleteCallout(section.id)}
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
                  )}
                </div>
              </CardHeader>
              
              {!section.isCollapsed && (
                <CardContent className="space-y-3">
                  {section.exercises.length === 0 ? (
                    <div className={`text-center py-8 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                      <p className="text-sm">No exercises in this section</p>
                      <Button 
                        onClick={onAddExercise}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Exercise
                      </Button>
                    </div>
                  ) : (
                    section.exercises.map((exercise, exerciseIndex) => {
                      const isExpanded = expandedExercises.has(exercise.id);
                      
                      return (
                        <Card 
                          key={exercise.id}
                          className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'} shadow-sm`}
                        >
                          <CardContent className="p-4">
                            {/* Exercise Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div 
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                onClick={() => toggleExpandExercise(exercise.id)}
                              >
                                <GripVertical className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-500' : 'text-sage-400'}`} />
                                <h4 className={`font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                                  {exercise.name}
                                </h4>
                                {exercise.isPregnancySafe && (
                                  <Baby className="h-4 w-4 text-pink-500" />
                                )}
                                {isExpanded ? (
                                  <ChevronDown className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                                ) : (
                                  <ChevronRight className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Button
                                    onClick={() => moveExercise(exercise.id, 'up', section.id)}
                                    disabled={exerciseIndex === 0}
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={() => moveExercise(exercise.id, 'down', section.id)}
                                    disabled={exerciseIndex === section.exercises.length - 1}
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {exercise.duration}min
                                </Badge>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveExercise(exercise.id);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className={`h-6 w-6 p-0 ${
                                    preferences.darkMode 
                                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                                      : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                                  }`}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Quick Info */}
                            <div className="flex items-center gap-2 text-xs">
                              <Badge className={`${preferences.darkMode ? 'bg-gray-600 text-gray-300' : 'bg-sage-100 text-sage-700'}`}>
                                {exercise.difficulty}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className={preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}>Springs:</span>
                                <SpringVisual springs={exercise.springs} />
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="mt-4 space-y-3 border-t pt-3">
                                {/* Exercise Image */}
                                {exercise.image && (
                                  <div className="w-full h-32 rounded-lg overflow-hidden">
                                    <img 
                                      src={exercise.image} 
                                      alt={exercise.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {/* Setup */}
                                  {exercise.setup && (
                                    <div>
                                      <h5 className={`text-xs font-semibold mb-1 flex items-center gap-1 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                                        <Settings className="h-3 w-3" />
                                        Setup
                                      </h5>
                                      <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                                        {exercise.setup}
                                      </p>
                                    </div>
                                  )}

                                  {/* Teaching Cues */}
                                  {exercise.cues && exercise.cues.length > 0 && (
                                    <div>
                                      <h5 className={`text-xs font-semibold mb-1 flex items-center gap-1 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                                        <Lightbulb className="h-3 w-3" />
                                        Cues
                                      </h5>
                                      <ul className="space-y-1">
                                        {exercise.cues.slice(0, 2).map((cue, index) => (
                                          <li key={index} className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                                            • {cue}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Additional Info */}
                                <div className="flex flex-wrap gap-2">
                                  {exercise.muscleGroups.map(group => (
                                    <Badge 
                                      key={group} 
                                      variant="secondary" 
                                      className={`text-xs ${
                                        preferences.darkMode 
                                          ? 'bg-gray-600 text-gray-300' 
                                          : 'bg-sage-100 text-sage-700'
                                      }`}
                                    >
                                      {group}
                                    </Badge>
                                  ))}
                                  {exercise.isPregnancySafe && (
                                    <Badge className="text-xs bg-pink-100 text-pink-700">
                                      <Baby className="h-3 w-3 mr-1" />
                                      Pregnancy Safe
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                  
                  {/* Add Exercise Button */}
                  <Button 
                    onClick={onAddExercise}
                    variant="outline"
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise to {section.name}
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Add Exercise Button (General) */}
          {calloutSections.length === 0 && (
            <Button 
              onClick={onAddExercise}
              variant="outline"
              size="lg"
              className="w-full border-dashed h-16"
            >
              <Plus className="h-6 w-6 mr-2" />
              Add Your First Exercise
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
