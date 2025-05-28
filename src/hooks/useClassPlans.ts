import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClassPlan, Exercise } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

export const useClassPlans = () => {
  const [savedClasses, setSavedClasses] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchClassPlans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching class plans:', error);
        toast({
          title: "Error loading classes",
          description: "Failed to load your saved classes.",
          variant: "destructive",
        });
      } else {
        // Transform Supabase data to match our ClassPlan interface
        const transformedData: ClassPlan[] = data.map(item => {
          // Ensure exercises is an array and properly typed
          const exercises = Array.isArray(item.exercises) ? (item.exercises as unknown) as Exercise[] : [];
          
          return {
            id: item.id,
            name: item.class_name,
            exercises,
            totalDuration: exercises.reduce((sum: number, ex: Exercise) => sum + (ex.duration || 0), 0),
            classDuration: 45, // Default class duration for existing saved classes
            createdAt: new Date(item.created_at),
            notes: '',
          };
        });
        
        setSavedClasses(transformedData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveClassPlan = async (classPlan: ClassPlan) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save classes.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert exercises to JSON-compatible format
      const exercisesJson = JSON.parse(JSON.stringify(classPlan.exercises));
      
      const { data, error } = await supabase
        .from('class_plans')
        .insert({
          class_name: classPlan.name,
          exercises: exercisesJson,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving class plan:', error);
        toast({
          title: "Error saving class",
          description: "Failed to save your class plan.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Class saved successfully!",
          description: `"${classPlan.name}" has been added to your library.",
        });
        
        // Add the new class to our local state
        const newClass: ClassPlan = {
          id: data.id,
          name: data.class_name,
          exercises: Array.isArray(data.exercises) ? (data.exercises as unknown) as Exercise[] : [],
          totalDuration: classPlan.totalDuration,
          classDuration: classPlan.classDuration, // Include the classDuration from the saved plan
          createdAt: new Date(data.created_at),
          notes: '',
        };
        
        setSavedClasses(prev => [newClass, ...prev]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteClassPlan = async (classId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('class_plans')
        .delete()
        .eq('id', classId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting class plan:', error);
        toast({
          title: "Error deleting class",
          description: "Failed to delete the class plan.",
          variant: "destructive",
        });
      } else {
        setSavedClasses(prev => prev.filter(c => c.id !== classId));
        toast({
          title: "Class deleted",
          description: "Class plan has been removed from your library.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateClassPlan = async (updatedClass: ClassPlan) => {
    if (!user) return;

    try {
      // Convert exercises to JSON-compatible format
      const exercisesJson = JSON.parse(JSON.stringify(updatedClass.exercises));
      
      const { error } = await supabase
        .from('class_plans')
        .update({
          class_name: updatedClass.name,
          exercises: exercisesJson
        })
        .eq('id', updatedClass.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating class plan:', error);
        toast({
          title: "Error updating class",
          description: "Failed to update the class plan.",
          variant: "destructive",
        });
        return false;
      } else {
        setSavedClasses(prev => prev.map(c => 
          c.id === updatedClass.id ? updatedClass : c
        ));
        toast({
          title: "Class updated",
          description: "Class plan has been updated successfully.",
        });
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchClassPlans();
    } else {
      setSavedClasses([]);
    }
  }, [user]);

  return {
    savedClasses,
    loading,
    saveClassPlan,
    deleteClassPlan,
    updateClassPlan,
    fetchClassPlans
  };
};
