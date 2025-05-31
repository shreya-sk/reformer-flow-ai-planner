
// Utility functions for managing class plan images
export const getClassPlanImages = (): string[] => {
  // Default image pool - admin can add more images to /public/class-images/
  const defaultImages = [
    '/lovable-uploads/156c5622-2826-4e16-8de0-e4c9aaa78cd3.png',
    '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
    '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
    '/lovable-uploads/8cb5e632-af4e-471a-a2c4-0371ce90cda2.png',
    '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
    '/lovable-uploads/52c9b506-ac25-4335-8a26-0c2b10d2c954.png',
    '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
    '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png',
    '/lovable-uploads/f986f49e-45f2-4dd4-8758-4be41a199bfd.png',
    '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png'
  ];

  // In the future, this could dynamically scan /public/class-images/ folder
  // For now, returning the default pool
  return defaultImages;
};

export const getRandomClassImage = (): string => {
  const images = getClassPlanImages();
  return images[Math.floor(Math.random() * images.length)];
};

export const getExerciseVideoUrl = (exerciseId: string): string | null => {
  // Future implementation: return video URLs for exercises
  // For now, return null as videos are not implemented yet
  return null;
};
