
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface SectionHeaderProps {
  section: Exercise;
  isExpanded: boolean;
  exerciseCount: number;
  totalDuration: number;
  onToggleExpand: () => void;
  onUpdateSection: (updatedSection: Exercise) => void;
  onDeleteSection: () => void;
  onAddExercise: () => void;
}

export const SectionHeader = ({
  section,
  isExpanded,
  exerciseCount,
  totalDuration,
  onToggleExpand,
  onUpdateSection,
  onDeleteSection,
  onAddExercise
}: SectionHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateSection({ ...section, name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(section.name);
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-7 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleSave} className="h-7 px-2">
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 px-2">
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-blue-800 text-sm">{section.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {exerciseCount} exercises
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {totalDuration} min
                </Badge>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddExercise}
            className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteSection}
            className="h-7 w-7 p-0 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
