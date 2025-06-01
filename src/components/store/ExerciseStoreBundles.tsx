
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Package, Download, Check, ChevronDown, ChevronRight, Clock, Users, Dumbbell, Target } from 'lucide-react';

interface ExerciseBundle {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  exercise_count: number;
  is_featured: boolean;
  download_count: number;
}

interface StoreExercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: number;
  springs: string;
  muscle_groups: string[];
  description: string;
  image_url: string;
  bundle_id: string | null;
  is_featured: boolean;
}

interface ExerciseStoreBundlesProps {
  bundles: ExerciseBundle[];
  exercises: StoreExercise[];
  onAddBundle: (bundleId: string) => Promise<void>;
  onAddExercise: (exerciseId: string) => Promise<void>;
  userLibrary: string[];
}

export const ExerciseStoreBundles = ({
  bundles,
  exercises,
  onAddBundle,
  onAddExercise,
  userLibrary
}: ExerciseStoreBundlesProps) => {
  const [expandedBundles, setExpandedBundles] = useState<string[]>([]);
  const [addingBundles, setAddingBundles] = useState<string[]>([]);
  const [addingExercises, setAddingExercises] = useState<string[]>([]);

  const featuredBundles = bundles.filter(bundle => bundle.is_featured);

  if (featuredBundles.length === 0) {
    return null;
  }

  const toggleBundle = (bundleId: string) => {
    setExpandedBundles(prev => 
      prev.includes(bundleId) 
        ? prev.filter(id => id !== bundleId)
        : [...prev, bundleId]
    );
  };

  const handleAddBundle = async (bundleId: string) => {
    if (addingBundles.includes(bundleId)) return;
    
    setAddingBundles(prev => [...prev, bundleId]);
    try {
      await onAddBundle(bundleId);
    } finally {
      setTimeout(() => {
        setAddingBundles(prev => prev.filter(id => id !== bundleId));
      }, 2000);
    }
  };

  const handleAddExercise = async (exerciseId: string) => {
    if (addingExercises.includes(exerciseId)) return;
    
    setAddingExercises(prev => [...prev, exerciseId]);
    try {
      await onAddExercise(exerciseId);
    } finally {
      setTimeout(() => {
        setAddingExercises(prev => prev.filter(id => id !== exerciseId));
      }, 2000);
    }
  };

  const getBundleExercises = (bundleId: string) => {
    return exercises.filter(exercise => exercise.bundle_id === bundleId);
  };

  const isBundleInLibrary = (bundleId: string) => {
    const bundleExercises = getBundleExercises(bundleId);
    return bundleExercises.length > 0 && bundleExercises.every(ex => userLibrary.includes(ex.id));
  };

  const getMuscleGroupsForBundle = (bundleId: string) => {
    const bundleExercises = getBundleExercises(bundleId);
    const allMuscleGroups = bundleExercises.flatMap(ex => ex.muscle_groups);
    const uniqueMuscleGroups = [...new Set(allMuscleGroups)];
    return uniqueMuscleGroups.slice(0, 3);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-sage-600" />
        <h2 className="text-lg font-semibold text-sage-800">Featured Exercise Bundles</h2>
      </div>
      
      <div className="space-y-3">
        {featuredBundles.map((bundle) => {
          const isExpanded = expandedBundles.includes(bundle.id);
          const bundleExercises = getBundleExercises(bundle.id);
          const isInLibrary = isBundleInLibrary(bundle.id);
          const isAdding = addingBundles.includes(bundle.id);
          const muscleGroups = getMuscleGroupsForBundle(bundle.id);
          
          return (
            <Card key={bundle.id} className="overflow-hidden bg-gradient-to-r from-sage-50 to-white border-sage-200">
              <Collapsible>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center shadow-md">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sage-800 truncate">{bundle.name}</h3>
                        {bundle.is_featured && (
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-sage-600 line-clamp-2 mb-2">
                        {bundle.description}
                      </p>
                      
                      {/* Bundle Stats */}
                      <div className="flex items-center gap-4 text-xs text-sage-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Dumbbell className="h-3 w-3" />
                          {bundle.exercise_count} exercises
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {bundle.download_count}
                        </span>
                        {muscleGroups.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {muscleGroups.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddBundle(bundle.id)}
                        disabled={isInLibrary || isAdding}
                        className={`transition-all duration-300 ${
                          isInLibrary ? 'bg-green-600 hover:bg-green-600' : 
                          isAdding ? 'bg-sage-600 scale-105' : 'bg-sage-600 hover:bg-sage-700'
                        }`}
                      >
                        {isInLibrary ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Added
                          </>
                        ) : isAdding ? (
                          <>
                            <Check className="h-4 w-4 mr-1 animate-bounce" />
                            Adding...
                          </>
                        ) : (
                          'Add Bundle'
                        )}
                      </Button>
                      
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBundle(bundle.id)}
                          className="text-sage-600"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="mt-4 pt-4 border-t border-sage-200">
                      <h4 className="text-sm font-medium text-sage-800 mb-3">Exercises in this bundle:</h4>
                      <div className="grid gap-2">
                        {bundleExercises.map((exercise) => {
                          const isExerciseInLibrary = userLibrary.includes(exercise.id);
                          const isAddingExercise = addingExercises.includes(exercise.id);
                          
                          return (
                            <div key={exercise.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-sage-100">
                              <div className="flex items-center gap-3 flex-1">
                                {exercise.image_url && (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-sage-100 flex-shrink-0">
                                    <img 
                                      src={exercise.image_url} 
                                      alt={exercise.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-sage-800 text-sm truncate">{exercise.name}</h5>
                                  <div className="flex items-center gap-3 text-xs text-sage-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {exercise.duration}min
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {exercise.difficulty}
                                    </span>
                                    <span className="capitalize">{exercise.springs}</span>
                                  </div>
                                  {exercise.muscle_groups.length > 0 && (
                                    <div className="text-xs text-sage-600 mt-1">
                                      Targets: {exercise.muscle_groups.slice(0, 2).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddExercise(exercise.id)}
                                disabled={isExerciseInLibrary || isAddingExercise}
                                className={`ml-2 ${
                                  isExerciseInLibrary ? 'bg-green-50 border-green-200 text-green-700' :
                                  isAddingExercise ? 'scale-105 bg-sage-50' : ''
                                }`}
                              >
                                {isExerciseInLibrary ? (
                                  <Check className="h-3 w-3" />
                                ) : isAddingExercise ? (
                                  <Check className="h-3 w-3 animate-bounce" />
                                ) : (
                                  'Add'
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
