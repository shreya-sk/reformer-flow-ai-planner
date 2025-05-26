
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, FileText, Calendar, Clock } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';

interface ClassPlanManagerProps {
  currentClass: ClassPlan;
  savedClasses: ClassPlan[];
  onUpdateClassName: (name: string) => void;
  onUpdateClassNotes: (notes: string) => void;
  onDeleteClass: (classId: string) => void;
  onLoadClass: (classPlan: ClassPlan) => void;
}

export const ClassPlanManager = ({
  currentClass,
  savedClasses,
  onUpdateClassName,
  onUpdateClassNotes,
  onDeleteClass,
  onLoadClass
}: ClassPlanManagerProps) => {
  const [showSavedClasses, setShowSavedClasses] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassPlan | null>(null);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleEditClass = (classPlan: ClassPlan) => {
    setEditingClass(classPlan);
    setEditName(classPlan.name);
    setEditNotes(classPlan.notes || '');
  };

  const handleSaveEdit = () => {
    if (editingClass) {
      const updatedClass = {
        ...editingClass,
        name: editName,
        notes: editNotes
      };
      onLoadClass(updatedClass);
      setEditingClass(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Current Class Management */}
        <Card className="border-sage-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-sage-800">Current Class</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="className" className="text-sm font-medium text-sage-700">
                Class Name
              </Label>
              <Input
                id="className"
                value={currentClass.name}
                onChange={(e) => onUpdateClassName(e.target.value)}
                placeholder="Enter class name..."
                className="mt-1 border-sage-300 focus:border-sage-500"
              />
            </div>
            
            <div>
              <Label htmlFor="classNotes" className="text-sm font-medium text-sage-700">
                Class Notes
              </Label>
              <Textarea
                id="classNotes"
                value={currentClass.notes || ''}
                onChange={(e) => onUpdateClassNotes(e.target.value)}
                placeholder="Add class notes, modifications, or reminders..."
                className="mt-1 border-sage-300 focus:border-sage-500"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4 text-sm text-sage-600">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{currentClass.exercises.length} exercises</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{currentClass.totalDuration} min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Classes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-sage-800">Saved Classes</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSavedClasses(!showSavedClasses)}
              className="border-sage-300"
            >
              {showSavedClasses ? 'Hide' : 'Show'} ({savedClasses.length})
            </Button>
          </div>

          {showSavedClasses && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {savedClasses.map((classPlan) => (
                <Card key={classPlan.id} className="border-sage-200 hover:border-sage-300 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sage-800 truncate">
                          {classPlan.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-sage-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(classPlan.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{classPlan.exercises.length} exercises</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{classPlan.totalDuration} min</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onLoadClass(classPlan)}
                          className="h-7 w-7 p-0 text-sage-600 hover:text-sage-800"
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClass(classPlan)}
                          className="h-7 w-7 p-0 text-sage-600 hover:text-sage-800"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteClass(classPlan.id)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {savedClasses.length === 0 && (
                <div className="text-center py-4 text-sm text-sage-500">
                  No saved classes yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class Plan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="editClassName">Class Name</Label>
              <Input
                id="editClassName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter class name..."
              />
            </div>
            
            <div>
              <Label htmlFor="editClassNotes">Notes</Label>
              <Textarea
                id="editClassNotes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Class notes..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingClass(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
