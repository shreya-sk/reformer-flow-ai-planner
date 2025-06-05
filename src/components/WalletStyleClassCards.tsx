
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, MoreHorizontal, Copy, Edit, Trash2 } from 'lucide-react';
import { useMobileDragDrop } from '@/hooks/useMobileDragDrop';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WalletStyleClassCardsProps {
  classPlans: any[];
  onTeachPlan: (plan: any) => void;
  onDuplicatePlan: (plan: any) => void;
  onHidePlan: (planId: string) => void;
}

export const WalletStyleClassCards = ({ 
  classPlans, 
  onTeachPlan, 
  onDuplicatePlan, 
  onHidePlan 
}: WalletStyleClassCardsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  // Use reformer images
  const reformerImages = [
    '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
    '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
    '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png',
    '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
    '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
    '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png'
  ];

  const getRandomImage = (classId: string) => {
    const index = classId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % reformerImages.length;
    return reformerImages[index];
  };

  const handleCardTap = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEditPlan = (plan: any) => {
    navigate('/plan', { state: { loadPlan: plan } });
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this class plan?')) {
      onHidePlan(planId);
    }
  };

  const getCardStyle = (index: number) => {
    const isExpanded = expandedIndex === index;
    const stackOffset = 80; // Increased for better visibility of class names
    
    // Maintain original wallet hierarchy - don't reorder cards
    const baseTransform = `translateY(${-index * stackOffset}px) scale(${1 - index * 0.02})`;
    const baseZIndex = 50 - index;
    
    return {
      transform: baseTransform,
      zIndex: baseZIndex,
      opacity: 1 - index * 0.08,
    };
  };

  if (classPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 relative">
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-sage-100/20 backdrop-blur-sm"></div>
        
        <div className="relative z-10">
          <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-3xl shadow-xl mx-4">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-sage-100 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-sage-600" />
              </div>
              <h3 className="text-lg font-semibold text-sage-800 mb-2">No Class Plans Yet</h3>
              <p className="text-sage-600 text-sm mb-6">Create your first class plan to get started</p>
              <Button
                onClick={() => navigate('/plan')}
                className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-6"
              >
                Create Class Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Container height calculation
  const containerHeight = Math.max(400, 300 + (classPlans.length - 1) * 80);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 relative">
      {/* Backdrop blur effect */}
      <div className="absolute inset-0 bg-sage-100/20 backdrop-blur-sm"></div>
      
      <div className="relative z-10 px-4 pb-32" style={{ height: `${containerHeight}px` }}>
        {classPlans.map((plan, index) => (
          <Card 
            key={plan.id}
            className="absolute w-full bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl transition-all duration-300 ease-out cursor-pointer overflow-hidden"
            style={{
              top: `${index * 20}px`,
              ...getCardStyle(index),
              maxWidth: 'calc(100% - 2rem)',
              height: expandedIndex === index ? '380px' : '280px',
            }}
            onClick={() => handleCardTap(index)}
          >
            <CardContent className="p-0 relative h-full">
              {/* Class Name Header - Always Visible at Top */}
              <div className="relative z-20 bg-white/95 backdrop-blur-md border-b border-sage-200/30 px-6 py-5 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-sage-900 leading-tight truncate">
                      {plan.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sage-600 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{plan.duration || 45}min</span>
                      </div>
                      <span>{plan.exercises?.filter(ex => ex.category !== 'callout').length || 0} exercises</span>
                    </div>
                  </div>
                  
                  {/* Options Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-sage-600 hover:bg-sage-100 rounded-full w-8 h-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-xl z-[60]">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPlan(plan);
                        }}
                        className="text-sage-700 hover:bg-sage-100 rounded-xl m-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicatePlan(plan);
                        }}
                        className="text-sage-700 hover:bg-sage-100 rounded-xl m-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate & Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                        className="text-red-600 hover:bg-red-100 rounded-xl m-1"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Background Image with Overlay */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <img 
                  src={plan.image || getRandomImage(plan.id)}
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sage-900/70 via-sage-600/30 to-transparent"></div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                {/* Plan Type Badge */}
                <div className="mb-4">
                  <Badge className="bg-sage-100/90 text-sage-800 border-0 rounded-full px-3 py-1 text-sm backdrop-blur-sm">
                    Reformer Class
                  </Badge>
                </div>

                {/* Expanded Content - Exercise List with actual names */}
                {expandedIndex === index && (
                  <div className="mb-4 max-h-36 overflow-y-auto bg-white/95 backdrop-blur-sm rounded-2xl p-4">
                    <h4 className="font-medium text-sage-800 mb-3 text-sm">Exercises in this class:</h4>
                    <div className="space-y-2">
                      {plan.exercises?.filter(ex => ex.category !== 'callout').slice(0, 5).map((exercise: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm text-sage-700 py-1">
                          <span className="truncate flex-1 font-medium">
                            {exercise.name && exercise.name !== 'Exercise' ? exercise.name : `Exercise ${idx + 1}`}
                          </span>
                          <span className="ml-2 text-sage-600 text-xs">
                            {exercise.duration || 3}min
                          </span>
                        </div>
                      ))}
                      {(plan.exercises?.filter((ex: any) => ex.category !== 'callout').length || 0) > 5 && (
                        <div className="text-xs text-sage-600 text-center pt-2 border-t border-sage-200">
                          +{(plan.exercises?.filter((ex: any) => ex.category !== 'callout').length || 0) - 5} more exercises
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Play Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTeachPlan(plan);
                    }}
                    className="w-14 h-14 rounded-full bg-white/95 hover:bg-white text-sage-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 p-0"
                  >
                    <Play className="h-6 w-6 ml-0.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
