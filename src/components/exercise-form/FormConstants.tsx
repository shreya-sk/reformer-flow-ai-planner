import { PrimaryMuscle, ExercisePosition, DifficultyLevel, MuscleGroup, TeachingFocus } from '@/types/reformer';

export const STEPS = [
  { id: 1, title: 'Basic Info', icon: 'Info', description: 'Name, description, categories and position' },
  { id: 2, title: 'Physical Setup', icon: 'Settings', description: 'Springs, duration and difficulty' },
  { id: 3, title: 'Body Focus', icon: 'Target', description: 'Muscle groups, focus and safety' },
  { id: 4, title: 'Teaching Details', icon: 'Shield', description: 'Cues, progressions and modifications' },
  { id: 5, title: 'Review', icon: 'Eye', description: 'Final review' }
];

export const CATEGORIES: { value: PrimaryMuscle; label: string }[] = [
  { value: 'core', label: 'Core' },
  { value: 'arms', label: 'Arms' },
  { value: 'legs', label: 'Legs' },
  { value: 'back', label: 'Back' },
  { value: 'warm-up', label: 'Warm-up' },
  { value: 'cool-down', label: 'Cool-down' }
];

export const POSITIONS: { value: ExercisePosition; label: string }[] = [
  { value: 'supine', label: 'Supine (lying down)' },
  { value: 'prone', label: 'Prone (face down)' },
  { value: 'sitting', label: 'Sitting' },
  { value: 'side-lying', label: 'Side-lying' },
  { value: 'kneeling', label: 'Kneeling' },
  { value: 'standing', label: 'Standing' },
  { value: 'other', label: 'Other' }
];

export const SPRING_COLORS = [
  { id: 'red', color: 'bg-red-800', label: 'Red', available: 2 },
  { id: 'yellow', color: 'bg-amber-400', label: 'Yellow', available: 2 },
  { id: 'blue', color: 'bg-cyan-500', label: 'Blue', available: 2 },
  { id: 'green', color: 'bg-green-400', label: 'Green', available: 2 }
];

export const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700' }
];

export const MUSCLE_GROUPS: { value: MuscleGroup; label: string; category: string }[] = [
  // Core
  { value: 'core', label: 'Core', category: 'Core' },
  { value: 'lower-abs', label: 'Lower Abs', category: 'Core' },
  { value: 'upper-abs', label: 'Upper Abs', category: 'Core' },
  { value: 'obliques', label: 'Obliques', category: 'Core' },
  { value: 'transverse-abdominis', label: 'Deep Core', category: 'Core' },
  { value: 'pelvic-floor', label: 'Pelvic Floor', category: 'Core' },
  { value: 'diaphragm', label: 'Diaphragm', category: 'Core' },
  
  // Legs
  { value: 'legs', label: 'Legs', category: 'Legs' },
  { value: 'quadriceps', label: 'Quadriceps', category: 'Legs' },
  { value: 'hamstrings', label: 'Hamstrings', category: 'Legs' },
  { value: 'calves', label: 'Calves', category: 'Legs' },
  { value: 'hip-flexors', label: 'Hip Flexors', category: 'Legs' },
  { value: 'hip-adductors', label: 'Inner Thighs', category: 'Legs' },
  { value: 'hip-abductors', label: 'Outer Thighs', category: 'Legs' },
  { value: 'ankles', label: 'Ankles', category: 'Legs' },
  { value: 'feet', label: 'Feet', category: 'Legs' },
  
  // Glutes
  { value: 'glutes', label: 'Glutes', category: 'Glutes' },
  
  // Arms
  { value: 'arms', label: 'Arms', category: 'Arms' },
  { value: 'biceps', label: 'Biceps', category: 'Arms' },
  { value: 'triceps', label: 'Triceps', category: 'Arms' },
  { value: 'forearms', label: 'Forearms', category: 'Arms' },
  { value: 'wrists', label: 'Wrists', category: 'Arms' },
  
  // Back
  { value: 'back', label: 'Back', category: 'Back' },
  { value: 'lats', label: 'Lats', category: 'Back' },
  { value: 'rhomboids', label: 'Rhomboids', category: 'Back' },
  { value: 'erector-spinae', label: 'Erector Spinae', category: 'Back' },
  { value: 'traps', label: 'Trapezius', category: 'Back' },
  { value: 'thoracic-spine', label: 'Thoracic Spine', category: 'Back' },
  { value: 'lumbar-spine', label: 'Lumbar Spine', category: 'Back' },
  
  // Shoulders
  { value: 'shoulders', label: 'Shoulders', category: 'Shoulders' },
  { value: 'deltoids', label: 'Deltoids', category: 'Shoulders' },
  { value: 'rotator-cuff', label: 'Rotator Cuff', category: 'Shoulders' },
  
  // Chest
  { value: 'chest', label: 'Chest', category: 'Chest' },
  { value: 'serratus-anterior', label: 'Serratus', category: 'Chest' },
  { value: 'intercostals', label: 'Intercostals', category: 'Chest' },
  
  // Neck
  { value: 'neck', label: 'Neck', category: 'Neck' },
  { value: 'cervical-spine', label: 'Cervical Spine', category: 'Neck' },
  
  // Other
  { value: 'deep-stabilizers', label: 'Deep Stabilizers', category: 'Other' },
  { value: 'spinal-extensors', label: 'Spinal Extensors', category: 'Other' },
  { value: 'psoas', label: 'Psoas', category: 'Other' },
  { value: 'iliotibial-band', label: 'IT Band', category: 'Other' },
  { value: 'full-body', label: 'Full Body', category: 'Other' }
];

export const TEACHING_FOCUS_OPTIONS: { value: TeachingFocus; label: string }[] = [
  { value: 'alignment', label: 'Alignment' },
  { value: 'core-engagement', label: 'Core Engagement' },
  { value: 'breath', label: 'Breath' },
  { value: 'precision', label: 'Precision' },
  { value: 'control', label: 'Control' },
  { value: 'flow', label: 'Flow' },
  { value: 'stability', label: 'Stability' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'balance', label: 'Balance' },
  { value: 'strength', label: 'Strength' },
  { value: 'coordination', label: 'Coordination' }
];
