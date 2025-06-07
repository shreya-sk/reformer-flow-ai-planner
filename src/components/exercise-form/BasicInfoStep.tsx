
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload } from 'lucide-react';
import { Exercise, PrimaryMuscle } from '@/types/reformer';
import { CATEGORIES, POSITIONS } from './FormConstants';

interface BasicInfoStepProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
  selectedCategories: PrimaryMuscle[];
  setSelectedCategories: (categories: PrimaryMuscle[]) => void;
  uploadingImage: boolean;
  uploadingVideo: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoStep = ({
  formData,
  setFormData,
  selectedCategories,
  setSelectedCategories,
  uploadingImage,
  uploadingVideo,
  onImageUpload,
  onVideoUpload
}: BasicInfoStepProps) => {
  const toggleCategory = (category: PrimaryMuscle) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-base font-semibold mb-3 block">Exercise Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Single Leg Teaser"
          className="text-lg p-4 rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-semibold mb-3 block">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the exercise..."
          className="min-h-20 rounded-xl"
        />
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Categories for Organization (Multi-select)</Label>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => toggleCategory(cat.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                selectedCategories.includes(cat.value)
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-gray-200 hover:border-sage-300'
              }`}
            >
              <div className="font-medium">{cat.label}</div>
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedCategories.map(cat => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {CATEGORIES.find(c => c.value === cat)?.label}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Position</Label>
        <div className="grid grid-cols-2 gap-3">
          {POSITIONS.map((pos) => (
            <button
              key={pos.value}
              onClick={() => setFormData({ ...formData, position: pos.value })}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                formData.position === pos.value
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-gray-200 hover:border-sage-300'
              }`}
            >
              <div className="font-medium">{pos.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-base font-semibold mb-3 block">Upload Image</Label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sage-400 transition-colors"
            >
              {uploadingImage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sage-600"></div>
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <span className="text-sm">Upload Image</span>
            </label>
            {formData.image && (
              <div className="text-xs text-green-600">✓ Image uploaded</div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">Upload Video</Label>
          <div className="space-y-2">
            <input
              type="file"
              accept="video/*"
              onChange={onVideoUpload}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sage-400 transition-colors"
            >
              {uploadingVideo ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sage-600"></div>
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span className="text-sm">Upload Video</span>
            </label>
            {formData.videoUrl && (
              <div className="text-xs text-green-600">✓ Video uploaded</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
