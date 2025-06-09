import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Edit, Copy, EyeOff, Eye, Check, ChevronUp, Baby, AlertTriangle, Target, Zap, Clock, Dumbbell, Users, Settings } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface MobileExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  onAddToClass: (exercise: Exercise) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onToggleHidden: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onCustomizeSystemExercise?: (e: React.MouseEvent) => void;
  observeImage: (element: HTMLElement) => void;
  isFavorite: boolean;
  isHidden: boolean;
  darkMode: boolean;
  feedbackState?: 'success' | 'error' | null;
  className?: string;
}

export const MobileExerciseCard = ({ 
  exercise, 
  onSelect, 
  onAddToClass, 
  onToggleFavorite,
  onToggleHidden,
  onEdit,
  onDuplicate,
  onDelete,
  onCustomizeSystemExercise,
  observeImage, 
  isFavorite,
  isHidden,
  darkMode,
  feedbackState,
  className = ''
}: MobileExerciseCardProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollStartPos, setScrollStartPos] = useState({ x: 0, y: 0 });

  const isCustom = exercise.isCustom || false;
  const isSystemExercise = exercise.isSystemExercise || false;
  const isModified = exercise.isModified || false;

  useEffect(() => {
    if (imageRef.current && exercise.image) {
      observeImage(imageRef.current);
    }
  }, [exercise.image, observeImage]);

  // Enhanced click-outside handler that's scroll-aware
  useEffect(() => {
    if (!showDetails) return;

    let touchStartY = 0;
    let touchMoved = false;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking inside the card
      if (cardRef.current?.contains(target)) return;
      
      // For touch events, track the starting position
      if (event.pointerType === 'touch') {
        touchStartY = event.clientY;
        touchMoved = false;
      } else {
        // For non-touch events (mouse), close immediately
        setShowDetails(false);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        const deltaY = Math.abs(event.clientY - touchStartY);
        if (deltaY > 10) {
          touchMoved = true;
        }
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking inside the card
      if (cardRef.current?.contains(target)) return;
      
      // For touch events, only close if this was a tap (not a scroll)
      if (event.pointerType === 'touch') {
        if (!touchMoved && !isScrolling) {
          setShowDetails(false);
        }
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerup', handlePointerUp, { passive: true });
    
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [showDetails, isScrolling]);

  // Enhanced scroll detection with better mobile optimization
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !showDetails) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScrollStart = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
    };

    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    scrollArea.addEventListener('scroll', handleScrollStart, { passive: true });
    scrollArea.addEventListener('touchstart', handleScrollStart, { passive: true });
    scrollArea.addEventListener('touchmove', handleScrollStart, { passive: true });
    scrollArea.addEventListener('touchend', handleScrollEnd, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      scrollArea.removeEventListener('scroll', handleScrollStart);
      scrollArea.removeEventListener('touchstart', handleScrollStart);
      scrollArea.removeEventListener('touchmove', handleScrollStart);
      scrollArea.removeEventListener('touchend', handleScrollEnd);
    };
  }, [showDetails]);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
    
    setIsAdding(true);
    onAddToClass(exercise);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(e);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(e);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate(e);
  };

  const handleHideClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleHidden(e);
  };

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const handleCardClick = () => {
    if (!showDetails && !isScrolling) {
      onSelect(exercise);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`relative group bg-white/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-md border border-white/30 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] max-w-48 ${isHidden ? 'opacity-60' : ''} ${
        feedbackState === 'success' ? 'ring-2 ring-green-500' : 
        feedbackState === 'error' ? 'ring-2 ring-red-500' : ''
      } ${className}`}
      onClick={handleCardClick}
    >
      {/* Compact image container */}
      <div className="relative aspect-[3/2] overflow-hidden">
        {exercise.image ? (
          <img
            ref={imageRef}
            alt={exercise.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
            <img 
              src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
              alt="Default exercise"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
        
        {/* Status badges */}
        <div className="absolute top-1 left-1 flex flex-col gap-0.5">
          {isHidden && (
            <Badge variant="secondary" className="text-[6px] bg-gray-600/90 text-white px-1 py-0.5 backdrop-blur-sm">
              Hidden
            </Badge>
          )}
          {isModified && isSystemExercise && (
            <Badge className="text-[6px] bg-orange-500/90 text-white px-1 py-0.5 backdrop-blur-sm">
              Modified
            </Badge>
          )}
          {isCustom && (
            <Badge className="text-[6px] bg-blue-500/90 text-white px-1 py-0.5 backdrop-blur-sm">
              Custom
            </Badge>
          )}
        </div>

        {/* Always visible action buttons */}
        <div className="absolute top-1 right-1 flex flex-col gap-0.5">
          <button
            onClick={handleFavoriteClick}
            className={`w-6 h-6 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
              isFavorite 
                ? 'bg-red-500/90 text-white scale-110' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500/90 hover:text-white hover:scale-110'
            }`}
          >
            <Heart className={`h-2.5 w-2.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleEditClick}
            className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-xl text-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-sage-500/90 hover:text-white hover:scale-110 shadow-sm"
          >
            <Edit className="h-2.5 w-2.5" />
          </button>

          <button
            onClick={handleDuplicateClick}
            className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-xl text-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-blue-500/90 hover:text-white hover:scale-110 shadow-sm"
          >
            <Copy className="h-2.5 w-2.5" />
          </button>

          <button
            onClick={handleHideClick}
            className={`w-6 h-6 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
              isHidden 
                ? 'bg-green-500/90 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-gray-500/90 hover:text-white hover:scale-110'
            }`}
          >
            {isHidden ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
          </button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-1">
          <div className="flex items-center justify-between">
            {exercise.isPregnancySafe && (
              <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-[6px] px-1 py-0.5 rounded-md flex items-center gap-1">
                <Baby className="h-1.5 w-1.5" />
                <span>Safe</span>
              </div>
            )}

            <button
              onClick={handleAddClick}
              disabled={isAdding}
              className={`ml-auto w-6 h-6 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                isAdding
                  ? 'bg-green-500/90 text-white scale-110'
                  : 'bg-sage-600/90 hover:bg-sage-700/90 text-white hover:scale-110'
              }`}
            >
              {isAdding ? (
                <Check className="h-3 w-3 animate-bounce" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Expanded content section */}
      <div className="p-2 bg-white/95 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[10px] text-gray-900 truncate leading-tight">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-[7px] text-gray-500">
              <span>{exercise.duration}min</span>
              <span>•</span>
              <span className="truncate">{exercise.category}</span>
              <span>•</span>
              <span className="capitalize">{exercise.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Full width details toggle */}
        <button
          onClick={toggleDetails}
          className={`w-full p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            showDetails 
              ? 'bg-sage-100 text-sage-700' 
              : 'bg-gray-50 hover:bg-sage-50 text-gray-600 hover:text-sage-700'
          }`}
        >
          <span className="text-[7px] font-medium">
            {showDetails ? 'Hide Details' : 'Show All Details'}
          </span>
          <ChevronUp className={`h-2.5 w-2.5 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
        </button>

        {/* Expandable details section with enhanced mobile scrolling */}
        {showDetails && (
          <div className="pt-1.5 border-t border-gray-100 mt-1.5">
            <div 
              ref={scrollAreaRef}
              className="max-h-32 overflow-y-auto overscroll-contain"
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain'
              }}
            >
              <div className="space-y-1.5 pr-1 pb-1">
                
                {/* Basic Exercise Info */}
                <div className="bg-gradient-to-r from-sage-50/60 to-white rounded-lg p-1.5 border border-sage-200/40">
                  <div className="grid grid-cols-2 gap-1.5 text-[6px]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-1.5 w-1.5 text-sage-600" />
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{exercise.duration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-1.5 w-1.5 text-sage-600" />
                      <span className="text-gray-500">Level:</span>
                      <span className="font-medium capitalize">{exercise.difficulty}</span>
                    </div>
                    {exercise.intensityLevel && (
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-1.5 w-1.5 text-sage-600" />
                        <span className="text-gray-500">Intensity:</span>
                        <span className="font-medium capitalize">{exercise.intensityLevel}</span>
                      </div>
                    )}
                    {exercise.tempo && (
                      <div className="flex items-center gap-1">
                        <Settings className="h-1.5 w-1.5 text-sage-600" />
                        <span className="text-gray-500">Tempo:</span>
                        <span className="font-medium">{exercise.tempo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {exercise.description && (
                  <div className="bg-blue-50/60 border border-blue-200/40 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[6px] font-semibold text-blue-700">Description</span>
                    </div>
                    <p className="text-[6px] text-blue-600 leading-tight">
                      {exercise.description}
                    </p>
                  </div>
                )}

                {/* Setup Instructions */}
                {exercise.setup && (
                  <div className="bg-purple-50/60 border border-purple-200/40 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[6px] font-semibold text-purple-700">Setup</span>
                    </div>
                    <p className="text-[6px] text-purple-600 leading-tight">
                      {exercise.setup}
                    </p>
                  </div>
                )}

                {/* Equipment */}
                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div className="bg-indigo-50/60 border border-indigo-200/40 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[6px] font-semibold text-indigo-700">Equipment</span>
                    </div>
                    <div className="flex flex-wrap gap-0.5">
                      {exercise.equipment.map((equip, idx) => (
                        <span key={idx} className="text-[5px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">
                          {equip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safety & Contraindications */}
                {exercise.contraindications && exercise.contraindications.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <AlertTriangle className="h-2 w-2 text-red-600" />
                      <span className="text-[6px] font-semibold text-red-700">Contraindications</span>
                    </div>
                    <div className="space-y-0.5">
                      {exercise.contraindications.map((contra, idx) => (
                        <p key={idx} className="text-[5px] text-red-600 leading-tight">
                          • {contra}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teaching Focus */}
                {exercise.teachingFocus && exercise.teachingFocus.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Target className="h-2 w-2 text-blue-600" />
                      <span className="text-[6px] font-semibold text-blue-700">Teaching Focus</span>
                    </div>
                    <div className="space-y-0.5">
                      {exercise.teachingFocus.map((focus, idx) => (
                        <p key={idx} className="text-[5px] text-blue-600 leading-tight">
                          • {focus}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teaching Cues */}
                {exercise.cues && exercise.cues.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Zap className="h-2 w-2 text-green-600" />
                      <span className="text-[6px] font-semibold text-green-700">Teaching Cues</span>
                    </div>
                    <div className="space-y-0.5">
                      {exercise.cues.map((cue, idx) => (
                        <p key={idx} className="text-[5px] text-green-600 leading-tight">
                          • {cue}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Breathing Cues */}
                {exercise.breathingCues && exercise.breathingCues.length > 0 && (
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[6px] font-semibold text-cyan-700">Breathing Cues</span>
                    </div>
                    <div className="space-y-0.5">
                      {exercise.breathingCues.map((cue, idx) => (
                        <p key={idx} className="text-[5px] text-cyan-600 leading-tight">
                          • {cue}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Areas */}
                {exercise.targetAreas && exercise.targetAreas.length > 0 && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[6px] font-semibold text-pink-700">Target Areas</span>
                    </div>
                    <div className="space-y-0.5">
                      {exercise.targetAreas.map((area, idx) => (
                        <p key={idx} className="text-[5px] text-pink-600 leading-tight">
                          • {area}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progressions & Regressions */}
                <div className="grid grid-cols-2 gap-1.5">
                  {exercise.regressions && exercise.regressions.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1.5">
                      <span className="text-[6px] text-yellow-700 font-semibold">Regressions:</span>
                      <div className="space-y-0.5 mt-0.5">
                        {exercise.regressions.map((reg, idx) => (
                          <p key={idx} className="text-[5px] text-yellow-600 leading-tight">• {reg}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {exercise.progressions && exercise.progressions.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-1.5">
                      <span className="text-[6px] text-orange-700 font-semibold">Progressions:</span>
                      <div className="space-y-0.5 mt-0.5">
                        {exercise.progressions.map((prog, idx) => (
                          <p key={idx} className="text-[5px] text-orange-600 leading-tight">• {prog}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modifications */}
                {exercise.modifications && exercise.modifications.length > 0 && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[6px] font-semibold text-teal-700">Modifications</span>
                    </div>
                    <div className="space-y-0.5">
                      {exercise.modifications.map((mod, idx) => (
                        <p key={idx} className="text-[5px] text-teal-600 leading-tight">
                          • {mod}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Muscle Groups */}
                {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-1.5">
                    <span className="text-[6px] text-gray-700 font-semibold">Target Muscles:</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {exercise.muscleGroups.map((muscle, idx) => (
                        <span key={idx} className="text-[5px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {exercise.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[6px] font-semibold text-amber-700">Notes</span>
                    </div>
                    <p className="text-[5px] text-amber-600 leading-tight">
                      {exercise.notes}
                    </p>
                  </div>
                )}

                {/* Visual scroll indicator */}
                <div className="text-center pt-0.5 select-none">
                  <p className="text-[5px] text-gray-400">↕ Scroll for more details</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
