
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const highlightExercises = [
  {
    id: 1,
    name: "Advanced Teaser",
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png",
    category: "Core",
    duration: 8,
    isNew: true
  },
  {
    id: 2,
    name: "Swan Dive Prep",
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png",
    category: "Back",
    duration: 6,
    isNew: true
  },
  {
    id: 3,
    name: "Leg Pull Front",
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png",
    category: "Arms",
    duration: 5,
    isNew: false
  }
];

export const StoreHighlights = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-sage-800">New Highlights</h2>
          <p className="text-sage-600 text-sm">Fresh exercises from our store</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/store')}
          className="text-burgundy-700 hover:text-burgundy-800 hover:bg-burgundy-50 rounded-full"
        >
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 gap-3">
        {highlightExercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className="bg-white/80 backdrop-blur-xl border-0 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/store')}
          >
            <CardContent className="p-0">
              <div className="flex items-center">
                {/* Exercise Image */}
                <div className="w-20 h-20 rounded-l-2xl overflow-hidden bg-sage-100 flex-shrink-0">
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Exercise Info */}
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sage-800 truncate">
                          {exercise.name}
                        </h3>
                        {exercise.isNew && (
                          <span className="bg-burgundy-600 text-white text-xs px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-sage-600">
                        {exercise.category} • {exercise.duration}min
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full text-sage-500 hover:text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle favorite
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full text-sage-500 hover:text-sage-700 hover:bg-sage-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle add to class
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
