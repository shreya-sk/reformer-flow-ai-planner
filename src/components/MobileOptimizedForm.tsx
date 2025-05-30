import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { ExerciseCategory, SpringSetting, DifficultyLevel, IntensityLevel, MuscleGroup, Equipment, TeachingFocus, Exercise } from '@/types/reformer';

interface MobileOptimizedFormProps {
  onSubmit: (exercise: Exercise) => void;
  onClose: () => void;
  initialValues?: Exercise;
}

const exerciseSchema = z.object({
  name: z.string().min(2, {
    message: "Exercise name must be at least 2 characters.",
  }),
  category: z.enum([
    'supine', 'prone', 'sitting', 'side-lying', 'kneeling', 'standing', 'warm-up', 'cool-down', 'callout', 'other'
  ]),
  duration: z.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }),
  springs: z.enum(['light', 'medium', 'heavy', 'mixed', 'none']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  intensityLevel: z.enum(['low', 'medium', 'high']),
  muscleGroups: z.array(z.enum([
    'core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body', 'quadriceps', 'hamstrings', 'calves', 'lower-abs', 'upper-abs', 'obliques', 'transverse-abdominis', 'traps', 'deltoids', 'biceps', 'triceps', 'lats', 'chest', 'rhomboids', 'erector-spinae', 'hip-flexors', 'adductors', 'abductors', 'pelvic-floor', 'deep-stabilizers', 'spinal-extensors', 'neck', 'forearms', 'wrists', 'ankles', 'feet', 'hip-abductors', 'hip-adductors', 'rotator-cuff', 'serratus-anterior', 'psoas', 'iliotibial-band', 'thoracic-spine', 'lumbar-spine', 'cervical-spine', 'diaphragm', 'intercostals'
  ])).optional(),
  equipment: z.array(z.enum([
    'reformer', 'mat', 'magic-circle', 'weights', 'resistance-band', 'foam-roller', 'pilates-ball', 'bosu-ball', 'chair', 'cadillac', 'straps', 'theraband', 'soft-ball', 'short-box', 'long-box', 'jump-board', 'platform-extender', 'tower', 'pole', 'none', 'other'
  ])).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
  notes: z.string().optional(),
  cues: z.array(z.string()).optional(),
  setup: z.string().optional(),
  repsOrDuration: z.string().optional(),
  tempo: z.string().optional(),
  targetAreas: z.array(z.string()).optional(),
  breathingCues: z.array(z.string()).optional(),
  teachingFocus: z.array(z.enum([
    'alignment', 'core-engagement', 'breath', 'precision', 'control', 'flow', 'stability', 'mobility', 'balance', 'strength', 'coordination'
  ])).optional(),
  modifications: z.array(z.string()).optional(),
  progressions: z.array(z.string()).optional(),
  regressions: z.array(z.string()).optional(),
  transitions: z.array(z.string()).optional(),
  contraindications: z.array(z.string()).optional(),
  isPregnancySafe: z.boolean().optional(),
});

export const MobileOptimizedForm = ({ onSubmit, onClose, initialValues }: MobileOptimizedFormProps) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: initialValues?.name || "",
      category: initialValues?.category || "supine",
      duration: initialValues?.duration || 1,
      springs: initialValues?.springs || "medium",
      difficulty: initialValues?.difficulty || "beginner",
      intensityLevel: initialValues?.intensityLevel || "medium",
      muscleGroups: initialValues?.muscleGroups || [],
      equipment: initialValues?.equipment || [],
      description: initialValues?.description || '',
      image: initialValues?.image || '',
      videoUrl: initialValues?.videoUrl || '',
      notes: initialValues?.notes || '',
      cues: initialValues?.cues || [],
      setup: initialValues?.setup || '',
      repsOrDuration: initialValues?.repsOrDuration || '',
      tempo: initialValues?.tempo || '',
      targetAreas: initialValues?.targetAreas || [],
      breathingCues: initialValues?.breathingCues || [],
      teachingFocus: initialValues?.teachingFocus || [],
      modifications: initialValues?.modifications || [],
      progressions: initialValues?.progressions || [],
      regressions: initialValues?.regressions || [],
      transitions: initialValues?.transitions || [],
      contraindications: initialValues?.contraindications || [],
      isPregnancySafe: initialValues?.isPregnancySafe || false,
    },
  })

  const handleSubmit = (values: any) => {
    const exerciseData: Exercise = {
      name: values.name,
      category: values.category,
      duration: values.duration,
      springs: values.springs,
      difficulty: values.difficulty,
      intensityLevel: values.intensityLevel,
      muscleGroups: values.muscleGroups || [],
      equipment: values.equipment || [],
      description: values.description || '',
      image: values.image || '',
      videoUrl: values.videoUrl || '',
      notes: values.notes || '',
      cues: values.cues || [],
      setup: values.setup || '',
      repsOrDuration: values.repsOrDuration || '',
      tempo: values.tempo || '',
      targetAreas: values.targetAreas || [],
      breathingCues: values.breathingCues || [],
      teachingFocus: values.teachingFocus || [],
      modifications: values.modifications || [],
      progressions: values.progressions || [],
      regressions: values.regressions || [],
      transitions: values.transitions || [],
      contraindications: values.contraindications || [],
      isPregnancySafe: values.isPregnancySafe || false,
      isCustom: true,
      id: Date.now().toString()
    };

    onSubmit(exerciseData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input placeholder="Bicep Curls" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="springs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spring Setting</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a spring setting" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intensityLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intensity Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPregnancySafe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Pregnancy Safe</FormLabel>
                <FormDescription>
                  Indicate if this exercise is safe for pregnant individuals.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isAdding} className="w-full">
          {isAdding ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
