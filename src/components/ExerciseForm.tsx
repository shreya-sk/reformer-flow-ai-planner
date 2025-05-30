import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ExerciseCategory, SpringSetting, DifficultyLevel, IntensityLevel, MuscleGroup, Equipment, Exercise } from '@/types/reformer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exercise: Exercise) => void;
}

export const ExerciseForm = ({ isOpen, onClose, onSubmit }: ExerciseFormProps) => {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const toggleEquipment = (item: Equipment) => {
    setSelectedEquipment(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    const exerciseData: Exercise = {
      ...data,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      transitions: data.transitions || [],
      id: Date.now().toString(),
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
      contraindications: []
    };
    onSubmit(exerciseData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Exercise</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Workout Name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select className="col-span-3">
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supine">Supine</SelectItem>
                <SelectItem value="prone">Prone</SelectItem>
                <SelectItem value="sitting">Sitting</SelectItem>
                <SelectItem value="side-lying">Side-lying</SelectItem>
                <SelectItem value="kneeling">Kneeling</SelectItem>
                <SelectItem value="standing">Standing</SelectItem>
                <SelectItem value="warm-up">Warm-up</SelectItem>
                <SelectItem value="cool-down">Cool-down</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <Input type="number" id="duration" defaultValue={1} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="springs" className="text-right">
              Springs
            </Label>
            <Select className="col-span-3">
              <SelectTrigger id="springs">
                <SelectValue placeholder="Select a spring setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Difficulty
            </Label>
            <Select className="col-span-3">
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <FormLabel className="text-right">Muscle Groups</FormLabel>
            <div className="col-span-3 flex flex-col">
              <ScrollArea className="rounded-md border p-2">
                <div className="flex flex-wrap gap-1">
                  {([
                    'core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body',
                    'quadriceps', 'hamstrings', 'calves', 'lower-abs', 'upper-abs',
                    'obliques', 'transverse-abdominis', 'traps', 'deltoids', 'biceps',
                    'triceps', 'lats', 'chest', 'rhomboids', 'erector-spinae',
                    'hip-flexors', 'adductors', 'abductors', 'pelvic-floor',
                    'deep-stabilizers', 'spinal-extensors', 'neck', 'forearms',
                    'wrists', 'ankles', 'feet', 'hip-abductors', 'hip-adductors',
                    'rotator-cuff', 'serratus-anterior', 'psoas', 'iliotibial-band',
                    'thoracic-spine', 'lumbar-spine', 'cervical-spine', 'diaphragm',
                    'intercostals'
                  ] as MuscleGroup[]).map((group) => (
                    <div key={group} className="space-x-2">
                      <Checkbox
                        id={`muscle-${group}`}
                        checked={selectedMuscleGroups.includes(group)}
                        onCheckedChange={() => toggleMuscleGroup(group)}
                      />
                      <Label
                        htmlFor={`muscle-${group}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {group}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <FormMessage />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <FormLabel className="text-right">Equipment</FormLabel>
            <div className="col-span-3 flex flex-col">
              <ScrollArea className="rounded-md border p-2">
                <div className="flex flex-wrap gap-1">
                  {([
                    'reformer', 'mat', 'magic-circle', 'weights', 'resistance-band',
                    'foam-roller', 'pilates-ball', 'bosu-ball', 'chair', 'cadillac',
                    'straps', 'theraband', 'soft-ball', 'short-box', 'long-box',
                    'jump-board', 'platform-extender', 'tower', 'pole', 'none', 'other'
                  ] as Equipment[]).map((item) => (
                    <div key={item} className="space-x-2">
                      <Checkbox
                        id={`equipment-${item}`}
                        checked={selectedEquipment.includes(item)}
                        onCheckedChange={() => toggleEquipment(item)}
                      />
                      <Label
                        htmlFor={`equipment-${item}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <FormMessage />
            </div>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </DialogContent>
    </Dialog>
  )
}
