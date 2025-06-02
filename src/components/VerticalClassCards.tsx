
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, MoreHorizontal, Copy, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VerticalClassCardsProps {
  classPlans: any[];
  onTeachPlan: (plan: any) => void;
  onDuplicatePlan: (plan: any) => void;
  onHidePlan: (planId: string) => void;
}

export const VerticalClassCards = ({ 
  classPlans, 
  onTeachPlan, 
  onDuplicatePlan, 
  onHidePlan 
}: VerticalClassCardsProps) => {
  const navigate = useNavigate();

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

  if (classPlans.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="p-3 bg-sage-100 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6 text-sage-600" />
          </div>
          <h3 className="text-base font-semibold text-sage-800 mb-2">No Class Plans Yet</h3>
          <p className="text-sage-600 text-sm mb-4">Create your first class plan to get started</p>
          <Button
            onClick={() => navigate('/plan')}
            className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-xl px-4 py-2 text-sm"
          >
            Create Class Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {classPlans.map((plan) => (
        <Card 
          key={plan.id}
          className="bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          onClick={() => onTeachPlan(plan)}
        >
          <CardContent className="p-0">
            <div className="flex">
              {/* Image */}
              <div className="w-20 h-20 relative overflow-hidden rounded-l-2xl flex-shrink-0">
                <img 
                  src={plan.image || getRandomImage(plan.id)}
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
              </div>

              {/* Content */}
              <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 truncate leading-tight">
                      {plan.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{plan.totalDuration || 0}min</span>
                      <span>•</span>
                      <span>{plan.exercises?.filter(ex => ex.category !== 'callout').length || 0} exercises</span>
                    </div>
                  </div>
                  
                  {/* Options Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-6 h-6 flex-shrink-0"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-xl">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicatePlan(plan);
                        }}
                        className="text-sage-700 hover:bg-sage-100 rounded-lg m-1"
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Duplicate & Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onHidePlan(plan.id);
                        }}
                        className="text-red-600 hover:bg-red-100 rounded-lg m-1"
                      >
                        <EyeOff className="h-3 w-3 mr-2" />
                        Hide Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className="bg-sage-100 text-sage-800 border-0 rounded-full px-2 py-0.5 text-xs">
                    Reformer
                  </Badge>
                  
                  {/* Play Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTeachPlan(plan);
                    }}
                    className="w-8 h-8 rounded-full bg-sage-600 hover:bg-sage-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 p-0"
                  >
                    <Play className="h-3 w-3 ml-0.5" />
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
