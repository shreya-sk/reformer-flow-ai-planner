
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Save, Plus, Trash2, Clock, Target, Dumbbell, Settings, FileText, AlertTriangle, TrendingUp, TrendingDown, Image as ImageIcon } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory, DifficultyLevel } from '@/types/reformer';
import { useCustomExercises } from '@/hooks/useCustomExercises';
import { toast } from '@/hooks/use-toast';

const muscleGroupOptions: MuscleGroup[] = [
  'Core', 'Arms', 'Legs', 'Back', 'Chest', 'Shoulders', 'Glutes', 'Calves'
];

const categoryOptions: ExerciseCategory[] = [
  'warm-up', 'standing', 'supine', 'prone', 'sitting', 'side-lying', 'kneeling', 'cool-down'
];

const difficultyOptions: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

const equipmentOptions = [
  'Reformer', 'Carriage', 'Footbar', 'Straps', 'Headrest', 'Box', 'Platform'
];

const springOptions = [
  { value: 'light', label: 'Light', color: 'bg-green-500', icon: '●' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500', icon: '●●' },
  { value: 'heavy', label: 'Heavy', color: 'bg-red-500', icon: '●●●' },
  { value: 'light-medium', label: 'Light + Medium', color: 'bg-gradient-to-r from-green-500 to-yellow-500', icon: '●+●●' },
  { value: 'medium-heavy', label: 'Medium + Heavy', color: 'bg-gradient-to-r from-yellow-500 to-red-500', icon: '●●+●●●' },
  { value: 'all', label: 'All Springs', color: 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500', icon: '●●●●' }
];

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  springs: z.string().min(1, 'Spring setting is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  description: z.string().optional(),
});

interface ImprovedExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (exercise: Exercise) => void;
}

export const ImprovedExerciseForm = ({
  isOpen,
  onClose,
  onSave
}: ImprovedExerciseFormProps) => {
  const { saveCustomExercise } = useCustomExercises();
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['Reformer']);
  const [cues, setCues] = useState<string[]>([]);
  const [progressions, setProgressions] = useState<string[]>([]);
  const [regressions, setRegressions] = useState<string[]>([]);
  const [contraindications, setContraindications] = useState<string[]>([]);
  const [newCue, setNewCue] = useState('');
  const [newProgression, setNewProgression] = useState('');
  const [newRegression, setNewRegression] = useState('');
  const [newContraindication, setNewContraindication] = useState('');
  const [setup, setSetup] = useState('');
  const [notes, setNotes] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      duration: 5,
    }
  });

  const selectedSpring = watch('springs');
  const selectedCategory = watch('category');

  const handleMuscleGroupToggle = (muscleGroup: MuscleGroup) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(muscleGroup)
        ? prev.filter(g => g !== muscleGroup)
        : [...prev, muscleGroup]
    );
  };

  const handleEquipmentToggle = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const addItem = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>, resetSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (item.trim()) {
      setter(prev => [...prev, item.trim()]);
      resetSetter('');
    }
  };

  const removeItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: z.infer<typeof exerciseSchema>) => {
    if (selectedMuscleGroups.length === 0) {
      toast({
        title: "Missing muscle groups",
        description: "Please select at least one target muscle group.",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Omit<Exercise, 'id'> = {
      name: data.name,
      category: data.category as ExerciseCategory,
      duration: data.duration,
      springs: data.springs,
      difficulty: data.difficulty as DifficultyLevel,
      intensityLevel: 'medium',
      muscleGroups: selectedMuscleGroups,
      equipment: selectedEquipment,
      description: data.description || '',
      image: '',
      videoUrl: '',
      notes,
      cues,
      progressions,
      regressions,
      contraindications,
      setup,
      isPregnancySafe: false,
      createdAt: new Date(),
    };

    if (onSave) {
      onSave(newExercise as Exercise);
    } else {
      await saveCustomExercise(newExercise);
    }

    handleClose();
  };

  const handleClose = () => {
    reset();
    setSelectedMuscleGroups([]);
    setSelectedEquipment(['Reformer']);
    setCues([]);
    setProgressions([]);
    setRegressions([]);
    setContraindications([]);
    setSetup('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0 border-b border-sage-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-sage-800 flex items-center gap-2">
              <Plus className="h-5 w-5 text-sage-600" />
              Create New Exercise
            </DialogTitle>
            <Button onClick={handleClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(95vh-200px)] px-1">
            <div className="space-y-6 p-1">
              {/* Basic Information */}
              <Card className="border-sage-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-sage-700">
                    <Settings className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Exercise Name *
                      </Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="e.g., Single Leg Stretch"
                        className="mt-1"
                      />
                      {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="category" className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Category *
                      </Label>
                      <Select onValueChange={(value) => setValue('category', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map(category => (
                            <SelectItem key={category} value={category}>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-sage-500"></span>
                                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="duration" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Duration (minutes) *
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="60"
                        {...register('duration', { valueAsNumber: true })}
                        className="mt-1"
                      />
                      {errors.duration && <p className="text-sm text-red-600 mt-1">{errors.duration.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="difficulty" className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        Difficulty *
                      </Label>
                      <Select onValueChange={(value) => setValue('difficulty', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyOptions.map(difficulty => (
                            <SelectItem key={difficulty} value={difficulty}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  difficulty === 'beginner' ? 'bg-green-500' :
                                  difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.difficulty && <p className="text-sm text-red-600 mt-1">{errors.difficulty.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Spring Settings */}
              <Card className="border-sage-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-sage-700">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-red-500 rounded-full"></div>
                    Spring Configuration *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {springOptions.map(option => (
                      <div
                        key={option.value}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                          selectedSpring === option.value
                            ? 'border-sage-500 bg-sage-50 shadow-md'
                            : 'border-gray-200 hover:border-sage-300'
                        }`}
                        onClick={() => setValue('springs', option.value)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{option.icon}</span>
                          </div>
                          <span className="font-medium text-sage-800">{option.label}</span>
                        </div>
                        {selectedSpring === option.value && (
                          <div className="w-5 h-5 bg-sage-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.springs && <p className="text-sm text-red-600 mt-2">{errors.springs.message}</p>}
                </CardContent>
              </Card>

              {/* Target Muscle Groups */}
              <Card className="border-sage-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-sage-700">
                    <Target className="h-5 w-5" />
                    Target Muscle Groups *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {muscleGroupOptions.map(group => (
                      <Badge
                        key={group}
                        variant={selectedMuscleGroups.includes(group) ? "default" : "outline"}
                        className={`cursor-pointer transition-all p-3 justify-center ${
                          selectedMuscleGroups.includes(group)
                            ? 'bg-sage-600 hover:bg-sage-700 text-white'
                            : 'hover:bg-sage-100 border-sage-300'
                        }`}
                        onClick={() => handleMuscleGroupToggle(group)}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        {group}
                      </Badge>
                    ))}
                  </div>
                  {selectedMuscleGroups.length === 0 && (
                    <p className="text-sm text-sage-600 mt-2">Select at least one muscle group</p>
                  )}
                </CardContent>
              </Card>

              {/* Equipment */}
              <Card className="border-sage-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-sage-700">
                    <Settings className="h-5 w-5" />
                    Required Equipment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {equipmentOptions.map(equipment => (
                      <Badge
                        key={equipment}
                        variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          selectedEquipment.includes(equipment)
                            ? 'bg-sage-600 hover:bg-sage-700'
                            : 'hover:bg-sage-100'
                        }`}
                        onClick={() => handleEquipmentToggle(equipment)}
                      >
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description & Setup */}
              <Card className="border-sage-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-sage-700">
                    <FileText className="h-5 w-5" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="description">Exercise Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      rows={3}
                      placeholder="Describe the exercise movement and benefits..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="setup">Setup Instructions</Label>
                    <Textarea
                      id="setup"
                      value={setup}
                      onChange={(e) => setSetup(e.target.value)}
                      rows={2}
                      placeholder="How to set up the reformer for this exercise..."
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-sage-200 pt-4 mt-4">
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-sage-600 hover:bg-sage-700">
                <Save className="h-4 w-4 mr-2" />
                Create Exercise
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
