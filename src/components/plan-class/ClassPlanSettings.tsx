
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClassPlan } from '@/types/reformer';
import { Clock, Image as ImageIcon, Calendar, Tag } from 'lucide-react';

interface ClassPlanSettingsProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onUpdateClassDuration?: (duration: number) => void;
  onUpdateClassNotes?: (notes: string) => void;
  onUpdateClassImage?: (image: string) => void;
}

// Default images for class plans
const defaultImages = [
  '/lovable-uploads/156c5622-2826-4e16-8de0-e4c9aaa78cd3.png',
  '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
  '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
  '/lovable-uploads/8cb5e632-af4e-471a-a2c4-0371ce90cda2.png',
  '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
  '/lovable-uploads/52c9b506-ac25-4335-8a26-0c2b10d2c954.png',
  '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
  '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png',
  '/lovable-uploads/f986f49e-45f2-4dd4-8758-4be41a199bfd.png',
  '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png'
];

export const ClassPlanSettings = ({
  currentClass,
  onUpdateClassName,
  onUpdateClassDuration,
  onUpdateClassNotes,
  onUpdateClassImage
}: ClassPlanSettingsProps) => {
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [classDuration, setClassDuration] = useState(currentClass.classDuration || 45);
  
  const handleDurationChange = (values: number[]) => {
    const duration = values[0];
    setClassDuration(duration);
    if (onUpdateClassDuration) {
      onUpdateClassDuration(duration);
    }
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateClassName(e.target.value);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onUpdateClassNotes) {
      onUpdateClassNotes(e.target.value);
    }
  };
  
  const handleImageSelect = (imageUrl: string) => {
    if (onUpdateClassImage) {
      onUpdateClassImage(imageUrl);
    }
    setShowImageSelector(false);
  };

  return (
    <div className="p-3 space-y-4">
      <Card className="rounded-xl overflow-hidden shadow-sm border-sage-200 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-3">
          <CardTitle className="text-sage-800">Class Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="className" className="text-sm font-medium text-sage-700">
              <Tag className="h-4 w-4 mr-2 inline-block" />
              Class Name
            </Label>
            <Input
              id="className"
              value={currentClass.name}
              onChange={handleNameChange}
              placeholder="Enter class name..."
              className="border-sage-300 focus:border-sage-500 focus:ring-sage-200 rounded-lg"
            />
          </div>
          
          {/* Class Duration */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="classDuration" className="text-sm font-medium text-sage-700">
                <Clock className="h-4 w-4 mr-2 inline-block" />
                Class Duration
              </Label>
              <span className="ml-auto font-medium text-sage-800">{classDuration} minutes</span>
            </div>
            <Slider
              id="classDuration"
              min={15}
              max={90}
              step={5}
              value={[classDuration]}
              onValueChange={handleDurationChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-sage-600">
              <span>15 min</span>
              <span>45 min</span>
              <span>90 min</span>
            </div>
          </div>
          
          {/* Class Notes */}
          <div className="space-y-2">
            <Label htmlFor="classNotes" className="text-sm font-medium text-sage-700">
              <Calendar className="h-4 w-4 mr-2 inline-block" />
              Class Notes
            </Label>
            <Textarea
              id="classNotes"
              value={currentClass.notes || ''}
              onChange={handleNotesChange}
              placeholder="Add notes about this class, special instructions, or general themes..."
              className="border-sage-300 focus:border-sage-500 focus:ring-sage-200 resize-none min-h-[100px] rounded-lg"
            />
          </div>
          
          {/* Class Image */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-sage-700">
              <ImageIcon className="h-4 w-4 mr-2 inline-block" />
              Class Image
            </Label>
            <div className="flex items-center gap-3">
              {currentClass.image ? (
                <img 
                  src={currentClass.image} 
                  alt="Class thumbnail" 
                  className="w-16 h-16 object-cover rounded-lg border border-sage-200 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 bg-sage-50 rounded-lg border border-sage-200 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-sage-400" />
                </div>
              )}
              
              <Dialog open={showImageSelector} onOpenChange={setShowImageSelector}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-sage-300 text-sage-600 rounded-lg">
                    {currentClass.image ? 'Change Image' : 'Select Image'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Select Class Image</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
                    {defaultImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(image)}
                        className="aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-sage-500 transition-colors hover:shadow-md"
                      >
                        <img 
                          src={image} 
                          alt={`Class image option ${index + 1}`}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-xl overflow-hidden shadow-sm border-sage-200 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-3">
          <CardTitle className="text-sage-800">Class Stats</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-sage-50 rounded-lg">
              <div className="text-2xl font-bold text-sage-800">
                {currentClass.exercises.filter(ex => ex.category !== 'callout').length}
              </div>
              <div className="text-xs text-sage-600 font-medium">Exercises</div>
            </div>
            <div className="text-center p-3 bg-sage-50 rounded-lg">
              <div className="text-2xl font-bold text-sage-800">{currentClass.totalDuration}</div>
              <div className="text-xs text-sage-600 font-medium">Minutes</div>
            </div>
            <div className="text-center p-3 bg-sage-50 rounded-lg">
              <div className="text-2xl font-bold text-sage-800">
                {Array.from(new Set(currentClass.exercises.flatMap(ex => ex.muscleGroups))).length}
              </div>
              <div className="text-xs text-sage-600 font-medium">Muscle Groups</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
