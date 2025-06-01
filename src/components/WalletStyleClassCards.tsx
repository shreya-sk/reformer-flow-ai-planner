
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, MoreHorizontal, Copy, EyeOff } from 'lucide-react';
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

  const getCardStyle = (index: number) => {
    const isExpanded = expandedIndex === index;
    const isStacked = expandedIndex !== null && index > expandedIndex;
    const distanceFromTop = expandedIndex !== null ? index - expandedIndex : index;
    
    if (isExpanded) {
      return {
        transform: 'translateY(0px) scale(1)',
        zIndex: 100,
        opacity: 1,
      };
    }
    
    if (isStacked) {
      return {
        transform: `translateY(${-150 - (distanceFromTop * 12)}px) scale(0.94)`,
        zIndex: 50 - distanceFromTop,
        opacity: 0.8,
      };
    }
    
    // Show more of each card behind - increased spacing and visibility
    return {
      transform: `translateY(${-index * 35}px) scale(${1 - index * 0.015})`,
      zIndex: 50 - index,
      opacity: 1 - index * 0.08,
    };
  };

  if (classPlans.length === 0) {
    return (
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
    );
  }

  // Improved container height calculation to prevent spillage
  const containerHeight = Math.max(280, 180 + (classPlans.length - 1) * 35);

  return (
    <div className="relative px-4 pb-32" style={{ height: `${containerHeight}px` }}>
      {classPlans.map((plan, index) => (
        <Card 
          key={plan.id}
          className="absolute w-full bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl transition-all duration-500 ease-out cursor-pointer overflow-hidden"
          style={{
            top: `${index * 12}px`,
            ...getCardStyle(index),
            maxWidth: 'calc(100% - 2rem)',
          }}
          onClick={() => handleCardTap(index)}
        >
          <CardContent className="p-0 relative h-48">
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <img 
                src={plan.image || getRandomImage(plan.id)}
                alt={plan.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-900/60 via-sage-600/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              {/* Top - Plan Type Badge */}
              <div className="flex justify-between items-start">
                <Badge className="bg-sage-100/90 text-sage-800 border-0 rounded-full px-3 py-1 text-sm backdrop-blur-sm">
                  Reformer
                </Badge>
                
                {/* Options Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-sage-100 hover:bg-white/20 rounded-full w-8 h-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-xl">
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
                        onHidePlan(plan.id);
                      }}
                      className="text-red-600 hover:bg-red-100 rounded-xl m-1"
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Plan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Bottom - Plan Info */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  {plan.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{plan.totalDuration || 0}min</span>
                    </div>
                    <span>{plan.exercises?.filter(ex => ex.category !== 'callout').length || 0} exercises</span>
                  </div>
                  
                  {/* Play Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTeachPlan(plan);
                    }}
                    className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-sage-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 p-0"
                  >
                    <Play className="h-5 w-5 ml-0.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
