
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-32 left-8 w-48 h-48 bg-gradient-to-br from-sage-200/30 to-sage-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-8 w-64 h-64 bg-gradient-to-br from-sage-100/40 to-sage-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <Card className="bg-white/95 backdrop-blur-xl border-0 rounded-3xl shadow-2xl mx-4 max-w-sm w-full transform hover:scale-105 transition-all duration-500 ease-out">
            <CardContent className="p-8 text-center">
              <div className="p-6 bg-gradient-to-br from-sage-100 to-sage-200 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Clock className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-xl font-bold text-sage-800 mb-3">No Class Plans Yet</h3>
              <p className="text-sage-600 text-base mb-8 leading-relaxed">Create your first class plan to get started with your Pilates journey</p>
              <Button
                onClick={() => navigate('/plan')}
                className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300"
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
        className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 relative px-4 pb-32 overflow-hidden"
        onClick={handleCloseModal}
      >
        {/* Enhanced floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-4 w-32 h-32 bg-gradient-to-br from-sage-200/20 to-sage-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-48 right-8 w-24 h-24 bg-gradient-to-br from-sage-100/30 to-sage-200/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-12 w-40 h-40 bg-gradient-to-br from-sage-300/15 to-sage-200/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative z-10 pt-6 space-y-2 max-w-xs mx-auto">
          {classPlans.map((plan, index) => {
            const stackOffset = index * 6;
            const scale = 1 - (index * 0.015);
            const opacity = Math.max(0.85, 1 - (index * 0.05));
            const isHovered = hoveredCard === plan.id;
            const isTopCard = index === 0;
            
            return (
              <Card 
                key={plan.id}
                className={`relative bg-white/98 backdrop-blur-xl border-0 rounded-3xl shadow-xl cursor-pointer group overflow-hidden transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  ${isTopCard ? 'animate-float' : ''}`}
                style={{
                  transform: `translateY(-${stackOffset}px) scale(${scale}) ${isHovered ? 'translateY(-8px) scale(1.015)' : ''}`,
                  zIndex: 50 - index,
                  opacity: opacity,
                  filter: isHovered ? 'brightness(1.03) drop-shadow(0 15px 20px rgb(0 0 0 / 0.12))' : 'drop-shadow(0 8px 12px rgb(0 0 0 / 0.08))',
                }}
                onClick={(e) => handleCardTap(plan, e)}
                onMouseEnter={() => setHoveredCard(plan.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-0 relative h-48 overflow-hidden">
                  {/* Enhanced background image with multiple overlays */}
                  <div className="absolute inset-0">
                    <img 
                      src={plan.image || getRandomImage(plan.id)}
                      alt={plan.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-sage-600/5 via-transparent to-sage-800/5"></div>
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-t from-sage-900/15 via-transparent to-transparent animate-fade-in"></div>
                    )}
                  </div>

                  {/* Enhanced content with better typography */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    {/* Top Section - Enhanced badge and menu */}
                    <div className="flex items-start justify-between">
                      <Badge className="bg-white/95 backdrop-blur-xl text-sage-800 border-0 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="w-1.5 h-1.5 bg-sage-500 rounded-full mr-2"></div>
                        Reformer
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-300"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl z-[200] p-2">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPlan(plan);
                            }}
                            className="text-sage-700 hover:bg-sage-100/80 rounded-xl m-1 py-3 px-4 font-medium transition-all duration-200"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicatePlan(plan);
                            }}
                            className="text-sage-700 hover:bg-sage-100/80 rounded-xl m-1 py-3 px-4 font-medium transition-all duration-200"
                          >
                            <Copy className="h-4 w-4 mr-3" />
                            Duplicate & Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlan(plan.id);
                            }}
                            className="text-red-600 hover:bg-red-100/80 rounded-xl m-1 py-3 px-4 font-medium transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Bottom Section - Enhanced typography and layout */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight drop-shadow-lg">
                        {plan.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white/95 text-sm">
                          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-bold">{plan.duration || 45}min</span>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                            <span className="font-bold">
                              {plan.exercises?.filter((ex: any) => ex.category !== 'callout').length || 0} ex
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTeachPlan(plan);
                          }}
                          className="w-11 h-11 rounded-full bg-white/98 hover:bg-white text-sage-800 shadow-2xl hover:shadow-3xl transform hover:scale-125 active:scale-95 transition-all duration-300 ease-out p-0 backdrop-blur-sm"
                        >
                          <Play className="h-4 w-4 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Subtle glow effect on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-sage-500/5 via-transparent to-transparent pointer-events-none animate-fade-in"></div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Enhanced Modal with Sage backdrop and no scroll */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-sage-600/30 via-sage-500/25 to-sage-700/35 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseModal}
        >
          <Card 
            className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl max-w-sm w-full transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-0">
              {/* Enhanced header with proper rounding */}
              <div className="relative rounded-t-3xl overflow-hidden">
                <img 
                  src={selectedPlan.image || getRandomImage(selectedPlan.id)}
                  alt={selectedPlan.name}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sage-900/50 via-sage-800/15 to-transparent"></div>
                
                <Button
                  onClick={handleCloseModal}
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 text-white hover:bg-white/20 backdrop-blur-sm rounded-full w-9 h-9 transform hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="bg-white/95 backdrop-blur-xl text-sage-800 border-0 rounded-full px-3 py-1.5 text-xs font-bold mb-2 shadow-lg">
                    <div className="w-1.5 h-1.5 bg-sage-500 rounded-full mr-2"></div>
                    Reformer Class
                  </Badge>
                  <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg mb-2">
                    {selectedPlan.name}
                  </h2>
                  <div className="flex items-center gap-3 text-white/95 text-sm">
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <Clock className="h-3 w-3" />
                      <span className="font-bold">{selectedPlan.duration || 45}min</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <span className="font-bold">
                        {selectedPlan.exercises?.filter((ex: any) => ex.category !== 'callout').length || 0} exercises
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercises list - limited to 4 exercises, no scroll */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-sage-800 mb-3">Exercises</h3>
                <div className="space-y-2">
                  {selectedPlan.exercises?.filter((ex: any) => ex.category !== 'callout').slice(0, 4).map((exercise: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-sage-50 to-sage-100/80 rounded-xl border border-sage-200/50">
                      <div className="flex-1">
                        <h4 className="font-bold text-sage-800 text-sm">
                          {exercise.name && exercise.name !== 'Exercise' ? exercise.name : `Exercise ${idx + 1}`}
                        </h4>
                        {exercise.targetAreas && exercise.targetAreas.length > 0 && (
                          <p className="text-sage-600 text-xs">
                            {exercise.targetAreas.slice(0, 2).join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <div className="bg-sage-200 text-sage-800 rounded-full px-2 py-1 text-xs font-bold">
                          {exercise.duration || 3}min
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedPlan.exercises?.filter((ex: any) => ex.category !== 'callout').length > 4 && (
                    <div className="text-center text-sage-500 text-xs py-1">
                      +{selectedPlan.exercises?.filter((ex: any) => ex.category !== 'callout').length - 4} more exercises
                    </div>
                  )}
                </div>

                {/* Enhanced action buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => {
                      onTeachPlan(selectedPlan);
                      handleCloseModal();
                    }}
                    className="flex-1 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-xl py-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
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
                    className="flex-1 border-2 border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-400 rounded-xl py-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
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

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};
