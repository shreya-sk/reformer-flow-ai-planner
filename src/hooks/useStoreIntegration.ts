
import { useExerciseStore } from './useExerciseStore';
import { useExercises } from './useExercises';
import { toast } from './use-toast';

export const useStoreIntegration = () => {
  const { addToUserLibrary } = useExerciseStore();
  const { refetch } = useExercises();

  const addStoreExerciseToLibrary = async (storeExercise: any) => {
    try {
      // Add to user library relationship table
      await addToUserLibrary(storeExercise.id);
      
      // Refresh exercises to include the new store exercise
      await refetch();
      
      toast({
        title: "Added to library",
        description: `"${storeExercise.name}" has been added to your exercise library.`,
      });
      
    } catch (error) {
      console.error('Error adding store exercise to library:', error);
      throw error;
    }
  };

  return {
    addStoreExerciseToLibrary
  };
};
