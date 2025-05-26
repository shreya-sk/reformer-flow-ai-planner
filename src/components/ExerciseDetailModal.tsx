
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, Edit, Plus, X, Image, Video } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (exercise: Exercise) => void;
}

export const ExerciseDetailModal = ({ exercise, isOpen, onClose, onUpdate }: ExerciseDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState(exercise);
  const [newCue, setNewCue] = useState('');

  const getSpringVisual = (springs: string) => {
    const springConfig = {
      'light': [{ color: 'bg-green-500', count: 1 }],
      'medium': [{ color: 'bg-yellow-500', count: 1 }],
      'heavy': [{ color: 'bg-red-500', count: 2 }],
      'mixed': [
        { color: 'bg-red-500', count: 1 },
        { color: 'bg-yellow-500', count: 1 },
        { color: 'bg-green-500', count: 1 }
      ]
    };

    const config = springConfig[springs as keyof typeof springConfig] || springConfig.light;
    
    return (
      <div className="flex items-center gap-1">
        {config.map((spring, index) => (
          <div key={index} className="flex gap-0.5">
            {Array.from({ length: spring.count }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${spring.color}`} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSave = () => {
    onUpdate(editedExercise);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedExercise(exercise);
    setIsEditing(false);
  };

  const addCue = () => {
    if (newCue.trim()) {
      setEditedExercise(prev => ({
        ...prev,
        cues: [...(prev.cues || []), newCue.trim()]
      }));
      setNewCue('');
    }
  };

  const removeCue = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      cues: prev.cues?.filter((_, i) => i !== index) || []
    }));
  };

  const updateCue = (index: number, value: string) => {
    setEditedExercise(prev => ({
      ...prev,
      cues: prev.cues?.map((cue, i) => i === index ? value : cue) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-sage-800">
              {exercise.name}
            </DialogTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-sage-300"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Image/Video */}
          {(exercise.image || exercise.videoUrl) && (
            <div className="space-y-3">
              {exercise.image && (
                <div>
                  <Label className="text-sm font-medium text-sage-700">Reference Image</Label>
                  <div className="mt-2">
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-sage-200"
                    />
                  </div>
                </div>
              )}
              
              {exercise.videoUrl && (
                <div>
                  <Label className="text-sm font-medium text-sage-700">Video Reference</Label>
                  <div className="mt-2">
                    <a
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-800 underline"
                    >
                      <Video className="h-4 w-4" />
                      Watch Video
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Exercise Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sage-500" />
              <span className="text-sm text-sage-600">{exercise.duration} minutes</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-sage-500">Springs:</span>
              {getSpringVisual(exercise.springs)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={`${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </Badge>
            {exercise.muscleGroups.map(group => (
              <Badge key={group} variant="secondary" className="bg-sage-100 text-sage-700">
                {group}
              </Badge>
            ))}
          </div>

          {/* Description */}
          {exercise.description && (
            <div>
              <Label className="text-sm font-medium text-sage-700">Description</Label>
              <p className="mt-1 text-sm text-sage-600">{exercise.description}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium text-sage-700">Notes</Label>
            {isEditing ? (
              <Textarea
                value={editedExercise.notes || ''}
                onChange={(e) => setEditedExercise(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add exercise notes..."
                className="mt-1"
                rows={3}
              />
            ) : (
              <p className="mt-1 text-sm text-sage-600">
                {exercise.notes || 'No notes added'}
              </p>
            )}
          </div>

          {/* Cues */}
          <div>
            <Label className="text-sm font-medium text-sage-700">Teaching Cues</Label>
            <div className="mt-2 space-y-2">
              {(isEditing ? editedExercise.cues : exercise.cues)?.map((cue, index) => (
                <div key={index} className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Input
                        value={cue}
                        onChange={(e) => updateCue(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCue(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex-1 text-sm text-sage-600 bg-sage-50 p-2 rounded border">
                      • {cue}
                    </div>
                  )}
                </div>
              )) || (
                <p className="text-sm text-sage-500 italic">No cues added</p>
              )}
              
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newCue}
                    onChange={(e) => setNewCue(e.target.value)}
                    placeholder="Add a teaching cue..."
                    onKeyPress={(e) => e.key === 'Enter' && addCue()}
                  />
                  <Button onClick={addCue} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
