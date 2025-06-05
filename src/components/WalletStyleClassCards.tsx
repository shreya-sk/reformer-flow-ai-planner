
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, MoreHorizontal, Copy, Edit, Trash2, X } from 'lucide-react';
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
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
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

  const handleCardTap = (plan: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlan(plan);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const handleEditPlan = (plan: any) => {
    navigate('/plan', { state: { loadPlan: plan } });
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this class plan?')) {
      onHidePlan(planId);
    }
  };

  if (classPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 relative">
        <div className="absolute inset-0 bg-sage-100/10 backdrop-blur-sm"></div>
        
        <div className="relative z-10">
          <Card className="bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl mx-4">
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

  return (
    <>
      <div 
        className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 relative px-4 pb-32"
        onClick={handleCloseModal}
      >
        <div className="absolute inset-0 bg-sage-100/10 backdrop-blur-sm"></div>
        
        <div className="relative z-10 pt-4 space-y-4">
          {classPlans.map((plan, index) => {
            const stackOffset = index * 8;
            const scale = 1 - (index * 0.02);
            const opacity = 1 - (index * 0.15);
            
            return (
              <Card 
                key={plan.id}
                className="relative bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-lg transition-all duration-300 cursor-pointer hover:shadow-xl"
                style={{
                  transform: `translateY(-${stackOffset}px) scale(${scale})`,
                  zIndex: 50 - index,
                  opacity: opacity,
                }}
                onClick={(e) => handleCardTap(plan, e)}
              >
                <CardContent className="p-0 relative h-60 overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={plan.image || getRandomImage(plan.id)}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    {/* Top Section */}
                    <div className="flex items-start justify-between">
                      <Badge className="bg-white/90 text-sage-800 border-0 rounded-full px-3 py-1 text-sm font-medium">
                        Reformer Class
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 rounded-full w-8 h-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white/98 backdrop-blur-sm border-0 rounded-2xl shadow-xl z-[200]">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPlan(plan);
                            }}
                            className="text-sage-700 hover:bg-sage-100/80 rounded-xl m-1"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicatePlan(plan);
                            }}
                            className="text-sage-700 hover:bg-sage-100/80 rounded-xl m-1"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate & Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlan(plan.id);
                            }}
                            className="text-red-600 hover:bg-red-100/80 rounded-xl m-1"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Bottom Section */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        {plan.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-white/90 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{plan.duration || 45}min</span>
                          </div>
                          <span className="font-medium">
                            {plan.exercises?.filter((ex: any) => ex.category !== 'callout').length || 0} exercises
                          </span>
                        </div>
                        
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTeachPlan(plan);
                          }}
                          className="w-12 h-12 rounded-full bg-white/95 hover:bg-white text-sage-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 p-0"
                        >
                          <Play className="h-5 w-5 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <Card 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-0">
              {/* Header */}
              <div className="relative">
                <img 
                  src={selectedPlan.image || getRandomImage(selectedPlan.id)}
                  alt={selectedPlan.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <Button
                  onClick={handleCloseModal}
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full w-8 h-8"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="absolute bottom-4 left-6 right-6">
                  <Badge className="bg-white/90 text-sage-800 border-0 rounded-full px-3 py-1 text-sm font-medium mb-3">
                    Reformer Class
                  </Badge>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {selectedPlan.name}
                  </h2>
                  <div className="flex items-center gap-4 text-white/90 text-sm mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{selectedPlan.duration || 45}min</span>
                    </div>
                    <span className="font-medium">
                      {selectedPlan.exercises?.filter((ex: any) => ex.category !== 'callout').length || 0} exercises
                    </span>
                  </div>
                </div>
              </div>

              {/* Exercise List */}
              <div className="p-6 max-h-80 overflow-y-auto">
                <h3 className="text-lg font-semibold text-sage-800 mb-4">Exercises</h3>
                <div className="space-y-3">
                  {selectedPlan.exercises?.filter((ex: any) => ex.category !== 'callout').map((exercise: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-sage-50 rounded-2xl">
                      <div className="flex-1">
                        <h4 className="font-medium text-sage-800 text-base">
                          {exercise.name && exercise.name !== 'Exercise' ? exercise.name : `Exercise ${idx + 1}`}
                        </h4>
                        {exercise.targetAreas && exercise.targetAreas.length > 0 && (
                          <p className="text-sage-600 text-sm mt-1">
                            {exercise.targetAreas.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <span className="text-sage-700 font-medium text-sm">
                          {exercise.duration || 3}min
                        </span>
                        {exercise.difficulty && (
                          <p className="text-sage-500 text-xs mt-1 capitalize">
                            {exercise.difficulty}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => {
                      onTeachPlan(selectedPlan);
                      handleCloseModal();
                    }}
                    className="flex-1 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl py-3 font-medium"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Teaching
                  </Button>
                  <Button
                    onClick={() => {
                      handleEditPlan(selectedPlan);
                      handleCloseModal();
                    }}
                    variant="outline"
                    className="flex-1 border-sage-300 text-sage-700 hover:bg-sage-50 rounded-2xl py-3 font-medium"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
