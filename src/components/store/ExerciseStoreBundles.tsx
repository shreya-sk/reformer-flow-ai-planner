
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Download, Check } from 'lucide-react';

interface ExerciseBundle {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  exercise_count: number;
  is_featured: boolean;
  download_count: number;
}

interface ExerciseStoreBundlesProps {
  bundles: ExerciseBundle[];
  onAddBundle: (bundleId: string) => Promise<void>;
  userLibrary: string[];
}

export const ExerciseStoreBundles = ({
  bundles,
  onAddBundle,
  userLibrary
}: ExerciseStoreBundlesProps) => {
  const featuredBundles = bundles.filter(bundle => bundle.is_featured);

  if (featuredBundles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-sage-600" />
        <h2 className="text-lg font-semibold text-sage-800">Featured Exercise Bundles</h2>
      </div>
      
      <div className="space-y-3">
        {featuredBundles.map((bundle) => {
          const isInLibrary = false; // TODO: Check if bundle exercises are in user library
          
          return (
            <Card key={bundle.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-sage-600" />
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
                    <div className="flex items-center gap-4 text-xs text-sage-500">
                      <span>{bundle.exercise_count} exercises</span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {bundle.download_count}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => onAddBundle(bundle.id)}
                    disabled={isInLibrary}
                    className={isInLibrary ? 'bg-green-600' : 'bg-sage-600 hover:bg-sage-700'}
                  >
                    {isInLibrary ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      'Add Bundle'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
