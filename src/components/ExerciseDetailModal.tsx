
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Save, Plus, Trash2, Clock, Target, Dumbbell, Settings, FileText, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory, DifficultyLevel } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedExercise: Exercise) => void;
}

const muscleGroupOptions: MuscleGroup[] = [
  'Core', 'Arms', 'Legs', 'Back', 'Chest', 'Shoulders', 'Glutes', 'Calves'
];

const categoryOptions: ExerciseCategory[] = [
  'warm-up', 'standing', 'supine', 'prone', 'sitting', 'side-lying', 'kneeling', 'cool-down'
];

const difficultyOptions: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

const springOptions = [
  { value: 'light', label: 'Light', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'heavy', label: 'Heavy', color: 'bg-red-500' },
  { value: 'light-medium', label: 'Light + Medium', color: 'bg-gradient-to-r from-green-500 to-yellow-500' },
  { value: 'medium-heavy', label: 'Medium + Heavy', color: 'bg-gradient-to-r from-yellow-500 to-red-500' },
  { value: 'all', label: 'All Springs', color: 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500' }
];

export const ExerciseDetailModal = ({
  exercise,
  isOpen,
  onClose,
  onUpdate
}: ExerciseDetailModalProps) => {
  const [editedExercise, setEditedExercise] = useState<Exercise>(exercise);
  const [activeTab, setActiveTab] = useState('details');
  const [newProgression, setNewProgression] = useState('');
  const [newRegression, setNewRegression] = useState('');
  const [newCue, setNewCue] = useState('');
  const [newContraindication, setNewContraindication] = useState('');

  useEffect(() => {
    setEditedExercise(exercise);
  }, [exercise]);

  const handleSave = () => {
    onUpdate(editedExercise);
    onClose();
  };

  const handleFieldChange = (field: keyof Exercise, value: any) => {
    setEditedExercise(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMuscleGroupToggle = (muscleGroup: MuscleGroup) => {
    setEditedExercise(prev => {
      const currentGroups = prev.muscleGroups || [];
      const isSelected = currentGroups.includes(muscleGroup);
      
      const newGroups = isSelected
        ? currentGroups.filter(group => group !== muscleGroup)
        : [...currentGroups, muscleGroup];
      
      return {
        ...prev,
        muscleGroups: newGroups
      };
    });
  };

  const addProgression = () => {
    if (newProgression.trim()) {
      setEditedExercise(prev => ({
        ...prev,
        progressions: [...(prev.progressions || []), newProgression.trim()]
      }));
      setNewProgression('');
    }
  };

  const removeProgression = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      progressions: prev.progressions?.filter((_, i) => i !== index) || []
    }));
  };

  const addRegression = () => {
    if (newRegression.trim()) {
      setEditedExercise(prev => ({
        ...prev,
        regressions: [...(prev.regressions || []), newRegression.trim()]
      }));
      setNewRegression('');
    }
  };

  const removeRegression = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      regressions: prev.regressions?.filter((_, i) => i !== index) || []
    }));
  };

  const addCue = () => {
    if (newCue.trim()) {
      setEditedExercise(prev => ({
        ...prev,
        cues: [...(prev.cues || []), newCue.trim()]
      }));
      setNewCue('');
    }
  };

  const removeCue = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      cues: prev.cues?.filter((_, i) => i !== index) || []
    }));
  };

  const addContraindication = () => {
    if (newContraindication.trim()) {
      setEditedExercise(prev => ({
        ...prev,
        contraindications: [...(prev.contraindications || []), newContraindication.trim()]
      }));
      setNewContraindication('');
    }
  };

  const removeContraindication = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      contraindications: prev.contraindications?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-sage-800">
              Edit Exercise
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} size="sm" className="bg-sage-600 hover:bg-sage-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Instructions
            </TabsTrigger>
            <TabsTrigger value="modifications" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Modifications
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Safety
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Exercise Name</Label>
                    <Input
                      id="name"
                      value={editedExercise.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={editedExercise.category} onValueChange={(value) => handleFieldChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={editedExercise.duration || ''}
                      onChange={(e) => handleFieldChange('duration', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={editedExercise.difficulty} onValueChange={(value) => handleFieldChange('difficulty', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyOptions.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Spring Setting</Label>
                    <div className="mt-2 space-y-2">
                      {springOptions.map(option => (
                        <div 
                          key={option.value}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            editedExercise.springs === option.value 
                              ? 'border-sage-500 bg-sage-50' 
                              : 'border-gray-200 hover:border-sage-300'
                          }`}
                          onClick={() => handleFieldChange('springs', option.value)}
                        >
                          <span className="font-medium">{option.label}</span>
                          <div className={`w-6 h-6 rounded-full ${option.color}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Target Muscle Groups</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {muscleGroupOptions.map(group => (
                    <Badge
                      key={group}
                      variant={editedExercise.muscleGroups?.includes(group) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        editedExercise.muscleGroups?.includes(group)
                          ? 'bg-sage-600 hover:bg-sage-700'
                          : 'hover:bg-sage-100'
                      }`}
                      onClick={() => handleMuscleGroupToggle(group)}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedExercise.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-6">
              <div>
                <Label>Teaching Cues</Label>
                <div className="mt-2 space-y-2">
                  {editedExercise.cues?.map((cue, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-sage-50 rounded-lg">
                      <span className="flex-1">{cue}</span>
                      <Button
                        onClick={() => removeCue(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newCue}
                      onChange={(e) => setNewCue(e.target.value)}
                      placeholder="Add a teaching cue..."
                      onKeyPress={(e) => e.key === 'Enter' && addCue()}
                    />
                    <Button onClick={addCue} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="setup">Setup Instructions</Label>
                <Textarea
                  id="setup"
                  value={editedExercise.setup || ''}
                  onChange={(e) => handleFieldChange('setup', e.target.value)}
                  rows={3}
                  className="mt-1"
                  placeholder="Describe how to set up this exercise..."
                />
              </div>
            </TabsContent>

            <TabsContent value="modifications" className="space-y-6">
              <div>
                <Label className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Progressions
                </Label>
                <div className="mt-2 space-y-2">
                  {editedExercise.progressions?.map((progression, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <span className="flex-1">{progression}</span>
                      <Button
                        onClick={() => removeProgression(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newProgression}
                      onChange={(e) => setNewProgression(e.target.value)}
                      placeholder="Add a progression..."
                      onKeyPress={(e) => e.key === 'Enter' && addProgression()}
                    />
                    <Button onClick={addProgression} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  Regressions
                </Label>
                <div className="mt-2 space-y-2">
                  {editedExercise.regressions?.map((regression, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <span className="flex-1">{regression}</span>
                      <Button
                        onClick={() => removeRegression(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newRegression}
                      onChange={(e) => setNewRegression(e.target.value)}
                      placeholder="Add a regression..."
                      onKeyPress={(e) => e.key === 'Enter' && addRegression()}
                    />
                    <Button onClick={addRegression} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="space-y-6">
              <div>
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Contraindications & Safety Notes
                </Label>
                <div className="mt-2 space-y-2">
                  {editedExercise.contraindications?.map((contraindication, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                      <span className="flex-1">{contraindication}</span>
                      <Button
                        onClick={() => removeContraindication(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newContraindication}
                      onChange={(e) => setNewContraindication(e.target.value)}
                      placeholder="Add a safety note or contraindication..."
                      onKeyPress={(e) => e.key === 'Enter' && addContraindication()}
                    />
                    <Button onClick={addContraindication} size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
