
import { toast } from '@/hooks/use-toast';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// Throttle mechanism to prevent toast spam
const toastThrottle = new Map<string, number>();
const THROTTLE_DURATION = 2000; // 2 seconds

export const showToast = (options: ToastOptions & { key?: string }) => {
  const key = options.key || options.title;
  const now = Date.now();
  
  // Check if this toast was recently shown
  if (toastThrottle.has(key)) {
    const lastShown = toastThrottle.get(key)!;
    if (now - lastShown < THROTTLE_DURATION) {
      console.log('🔇 Toast throttled:', key);
      return;
    }
  }
  
  // Show the toast and record the time
  toastThrottle.set(key, now);
  
  toast({
    title: options.title,
    description: options.description,
    variant: options.variant || 'default',
    duration: options.duration || 3000,
  });
};

// Specific toast functions for common use cases
export const showSuccessToast = (title: string, description?: string) => {
  showToast({
    title,
    description,
    variant: 'default',
    key: `success-${title}`,
  });
};

export const showErrorToast = (title: string, description?: string) => {
  showToast({
    title,
    description,
    variant: 'destructive',
    key: `error-${title}`,
  });
};

export const showExerciseAddedToast = (exerciseName: string) => {
  showToast({
    title: "Added to class",
    description: `"${exerciseName}" added to your class.`,
    key: 'exercise-added',
    duration: 2000,
  });
};

export const showClassSavedToast = (className: string) => {
  showToast({
    title: "Class saved!",
    description: `"${className}" has been saved successfully.`,
    key: 'class-saved',
  });
};
