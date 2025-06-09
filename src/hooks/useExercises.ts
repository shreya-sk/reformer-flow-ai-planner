import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, MuscleGroup, Equipment, TeachingFocus } from '@/types/reformer';
import { useAuth } from '@/contexts/AuthContext';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchExercises = async () => {
    try {
      setLoading(true);
      
      // Fetch system exercises (only active ones) - force refresh to get updated data
      const { data: systemData, error: systemError } = await supabase
        .from('system_exercises')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (systemError) throw systemError;

      console.log('📊 System exercises fetched:', systemData?.length || 0);

      const systemExercises = systemData?.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category as ExerciseCategory,
        position: 'supine' as const,
        primaryMuscle: 'core' as const,
        duration: exercise.duration,
        springs: exercise.springs as SpringSetting,
        difficulty: exercise.difficulty as DifficultyLevel,
        intensityLevel: 'medium' as const,
        muscleGroups: (exercise.muscle_groups || []) as MuscleGroup[],
        equipment: (exercise.equipment || []) as Equipment[],
        description: exercise.description || '',
        image: exercise.image_url || '',
        videoUrl: exercise.video_url || '',
        notes: exercise.notes || '',
        cues: exercise.cues || [],
        setup: exercise.setup || '',
        repsOrDuration: exercise.reps_or_duration || '',
        tempo: exercise.tempo || '',
        targetAreas: exercise.target_areas || [],
        breathingCues: exercise.breathing_cues || [],
        teachingFocus: (exercise.teaching_focus || []) as TeachingFocus[],
        modifications: exercise.modifications || [],
        progressions: exercise.progressions || [],
        regressions: exercise.regressions || [],
        transitions: [],
        contraindications: exercise.contraindications || [],
        isPregnancySafe: exercise.is_pregnancy_safe || false,
        isSystemExercise: true,
        isModified: false,
        createdAt: new Date(exercise.created_at),
        updatedAt: new Date(exercise.updated_at)
      })) || [];

      let userExercises: Exercise[] = [];
      let storeExercises: Exercise[] = [];
      
      // Fetch user exercises if authenticated
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('user_exercises')
          .select('*')
          .eq('user_id', user.id);

        if (userError) throw userError;

        console.log('📊 User exercises fetched:', userData?.length || 0);

        userExercises = userData?.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          category: exercise.category as ExerciseCategory,
          position: 'supine' as const,
          primaryMuscle: 'core' as const,
          duration: exercise.duration,
          springs: exercise.springs as SpringSetting,
          difficulty: exercise.difficulty as DifficultyLevel,
          intensityLevel: 'medium' as const,
          muscleGroups: (exercise.muscle_groups || []) as MuscleGroup[],
          equipment: (exercise.equipment || []) as Equipment[],
          description: exercise.description || '',
          image: exercise.image_url || '',
          videoUrl: exercise.video_url || '',
          notes: exercise.notes || '',
          cues: exercise.cues || [],
          setup: exercise.setup || '',
          repsOrDuration: exercise.reps_or_duration || '',
          tempo: exercise.tempo || '',
          targetAreas: exercise.target_areas || [],
          breathingCues: exercise.breathing_cues || [],
          teachingFocus: (exercise.teaching_focus || []) as TeachingFocus[],
          modifications: exercise.modifications || [],
          progressions: exercise.progressions || [],
          regressions: exercise.regressions || [],
          transitions: [],
          contraindications: exercise.contraindications || [],
          isPregnancySafe: exercise.is_pregnancy_safe || false,
          isCustom: true,
          isSystemExercise: false,
          createdAt: new Date(exercise.created_at),
          updatedAt: new Date(exercise.updated_at)
        })) || [];

        // Fetch store exercises that user has added to library
        const { data: libraryData, error: libraryError } = await supabase
          .from('user_exercise_library')
          .select(`
            store_exercise_id,
            exercise_store (*)
          `)
          .eq('user_id', user.id)
          .not('store_exercise_id', 'is', null);

        if (libraryError) throw libraryError;

        console.log('📊 Store exercises in library:', libraryData?.length || 0);

        storeExercises = libraryData?.map(item => {
          const storeExercise = item.exercise_store;
          return {
            id: storeExercise.id,
            name: storeExercise.name,
            category: storeExercise.category as ExerciseCategory,
            position: 'supine' as const,
            primaryMuscle: 'core' as const,
            duration: storeExercise.duration,
            springs: storeExercise.springs as SpringSetting,
            difficulty: storeExercise.difficulty as DifficultyLevel,
            intensityLevel: 'medium' as const,
            muscleGroups: (storeExercise.muscle_groups || []) as MuscleGroup[],
            equipment: (storeExercise.equipment || []) as Equipment[],
            description: storeExercise.description || '',
            image: storeExercise.image_url || '',
            videoUrl: storeExercise.video_url || '',
            notes: storeExercise.notes || '',
            cues: storeExercise.cues || [],
            setup: storeExercise.setup || '',
            repsOrDuration: storeExercise.reps_or_duration || '',
            tempo: storeExercise.tempo || '',
            targetAreas: storeExercise.target_areas || [],
            breathingCues: storeExercise.breathing_cues || [],
            teachingFocus: (storeExercise.teaching_focus || []) as TeachingFocus[],
            modifications: storeExercise.modifications || [],
            progressions: storeExercise.progressions || [],
            regressions: storeExercise.regressions || [],
            transitions: [],
            contraindications: storeExercise.contraindications || [],
            isPregnancySafe: storeExercise.is_pregnancy_safe || false,
            isCustom: false,
            isSystemExercise: true,
            isModified: false,
            createdAt: new Date(storeExercise.created_at),
            updatedAt: new Date(storeExercise.updated_at)
          };
        }) || [];
      }

      const allExercises = [...systemExercises, ...userExercises, ...storeExercises];
      console.log('📊 Total exercises loaded:', allExercises.length, {
        system: systemExercises.length,
        user: userExercises.length,
        store: storeExercises.length
      });
      
      // Log sample exercise data to verify rich content
      if (systemExercises.length > 0) {
        const sampleExercise = systemExercises[0];
        console.log('📋 Sample exercise data:', {
          name: sampleExercise.name,
          hasSetup: !!sampleExercise.setup,
          cuesCount: sampleExercise.cues.length,
          modificationsCount: sampleExercise.modifications.length,
          progressionsCount: sampleExercise.progressions.length,
          contraindicationsCount: sampleExercise.contraindications.length,
          breathingCuesCount: sampleExercise.breathingCues.length
        });
      }
      
      setExercises(allExercises as Exercise[]);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createUserExercise = async (exerciseData: Omit<Exercise, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercises')
        .insert({
          user_id: user.id,
          name: exerciseData.name,
          category: exerciseData.category,
          duration: exerciseData.duration,
          springs: exerciseData.springs,
          difficulty: exerciseData.difficulty,
          muscle_groups: exerciseData.muscleGroups,
          equipment: exerciseData.equipment,
          description: exerciseData.description,
          image_url: exerciseData.image,
          video_url: exerciseData.videoUrl,
          notes: exerciseData.notes,
          cues: exerciseData.cues,
          setup: exerciseData.setup,
          reps_or_duration: exerciseData.repsOrDuration,
          tempo: exerciseData.tempo,
          target_areas: exerciseData.targetAreas,
          breathing_cues: exerciseData.breathingCues,
          teaching_focus: exerciseData.teachingFocus,
          modifications: exerciseData.modifications,
          progressions: exerciseData.progressions,
          regressions: exerciseData.regressions,
          contraindications: exerciseData.contraindications,
          is_pregnancy_safe: exerciseData.isPregnancySafe
        })
        .select()
        .single();

      if (error) throw error;
      await fetchExercises();
      return data;
    } catch (err) {
      console.error('Error creating user exercise:', err);
      throw err;
    }
  };

  const updateUserExercise = async (id: string, exerciseData: Partial<Exercise>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercises')
        .update({
          name: exerciseData.name,
          category: exerciseData.category,
          duration: exerciseData.duration,
          springs: exerciseData.springs,
          difficulty: exerciseData.difficulty,
          muscle_groups: exerciseData.muscleGroups,
          equipment: exerciseData.equipment,
          description: exerciseData.description,
          image_url: exerciseData.image,
          video_url: exerciseData.videoUrl,
          notes: exerciseData.notes,
          cues: exerciseData.cues,
          setup: exerciseData.setup,
          reps_or_duration: exerciseData.repsOrDuration,
          tempo: exerciseData.tempo,
          target_areas: exerciseData.targetAreas,
          breathing_cues: exerciseData.breathingCues,
          teaching_focus: exerciseData.teachingFocus,
          modifications: exerciseData.modifications,
          progressions: exerciseData.progressions,
          regressions: exerciseData.regressions,
          contraindications: exerciseData.contraindications,
          is_pregnancy_safe: exerciseData.isPregnancySafe,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchExercises();
      return data;
    } catch (err) {
      console.error('Error updating user exercise:', err);
      throw err;
    }
  };

  const duplicateExercise = async (exercise: Exercise) => {
    const duplicatedData = {
      ...exercise,
      name: `${exercise.name} (Copy)`,
      isCustom: true
    };
    
    const { id, createdAt, updatedAt, isSystemExercise, isModified, ...insertData } = duplicatedData;
    
    return createUserExercise(insertData);
  };

  const deleteUserExercise = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchExercises();
    } catch (err) {
      console.error('Error deleting user exercise:', err);
      throw err;
    }
  };

  // Create a customized copy of a system exercise
  const customizeSystemExercise = async (exercise: Exercise, customizations: Partial<Exercise>) => {
    if (!user) return;

    // Create a new user exercise based on the system exercise with customizations
    const customizedExercise = {
      ...exercise,
      ...customizations,
      name: customizations.name || `${exercise.name} (Custom)`,
      isCustom: true,
      isSystemExercise: false
    };

    const { id, createdAt, updatedAt, isSystemExercise, isModified, ...insertData } = customizedExercise;
    
    return createUserExercise(insertData);
  };

  const resetSystemExerciseToOriginal = async (exerciseId: string) => {
    await fetchExercises();
  };

  useEffect(() => {
    fetchExercises();
  }, [user]);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
    createUserExercise,
    updateUserExercise,
    duplicateExercise,
    deleteUserExercise,
    customizeSystemExercise,
    resetSystemExerciseToOriginal
  };
};
