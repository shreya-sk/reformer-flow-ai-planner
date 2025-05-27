
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, FileText, Calendar, Clock, Eye, Play } from 'lucide-react';
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
  const [viewingClass, setViewingClass] = useState<ClassPlan | null>(null);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleEditClass = (classPlan: ClassPlan) => {
    setEditingClass(classPlan);
    setEditName(classPlan.name);
    setEditNotes(classPlan.notes || '');
  };

  const handleViewClass = (classPlan: ClassPlan) => {
    setViewingClass(classPlan);
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

  const getMuscleGroupCoverage = (classPlan: ClassPlan) => {
    const allGroups = classPlan.exercises.flatMap(ex => ex.muscleGroups);
    return Array.from(new Set(allGroups));
  };

  return (
    <>
      <div className="space-y-6">
        {/* Current Class Management */}
        <Card className="border-sage-200 shadow-sm">
          <CardHeader className="pb-4 bg-gradient-to-r from-sage-50 to-white">
            <CardTitle className="text-xl text-sage-800 font-semibold">Current Class</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <Label htmlFor="className" className="text-sm font-medium text-sage-700 mb-2 block">
                Class Name
              </Label>
              <Input
                id="className"
                value={currentClass.name}
                onChange={(e) => onUpdateClassName(e.target.value)}
                placeholder="Enter class name..."
                className="border-sage-300 focus:border-sage-500 focus:ring-sage-200"
              />
            </div>
            
            <div>
              <Label htmlFor="classNotes" className="text-sm font-medium text-sage-700 mb-2 block">
                Class Notes
              </Label>
              <Textarea
                id="classNotes"
                value={currentClass.notes || ''}
                onChange={(e) => onUpdateClassNotes(e.target.value)}
                placeholder="Add class notes, modifications, or reminders..."
                className="border-sage-300 focus:border-sage-500 focus:ring-sage-200"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-3 bg-sage-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-800">{currentClass.exercises.length}</div>
                <div className="text-xs text-sage-600 font-medium">Exercises</div>
              </div>
              <div className="text-center p-3 bg-sage-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-800">{currentClass.totalDuration}</div>
                <div className="text-xs text-sage-600 font-medium">Minutes</div>
              </div>
              <div className="text-center p-3 bg-sage-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-800">{Array.from(new Set(currentClass.exercises.flatMap(ex => ex.muscleGroups))).length}</div>
                <div className="text-xs text-sage-600 font-medium">Muscle Groups</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Classes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-sage-800">Saved Classes</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSavedClasses(!showSavedClasses)}
              className="border-sage-300 hover:bg-sage-50"
            >
              {showSavedClasses ? 'Hide' : 'Show'} ({savedClasses.length})
            </Button>
          </div>

          {showSavedClasses && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedClasses.map((classPlan) => (
                <Card key={classPlan.id} className="border-sage-200 hover:border-sage-300 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sage-800 text-lg mb-2">
                          {classPlan.name}
                        </h4>
                        <div className="grid grid-cols-3 gap-3 text-sm text-sage-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(classPlan.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{classPlan.exercises.length} exercises</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{classPlan.totalDuration} min</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {getMuscleGroupCoverage(classPlan).slice(0, 4).map(group => (
                            <Badge key={group} variant="secondary" className="text-xs bg-sage-100 text-sage-700">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClass(classPlan)}
                          className="h-8 w-8 p-0 text-sage-600 hover:text-sage-800 hover:bg-sage-100"
                          title="View class details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onLoadClass(classPlan)}
                          className="h-8 w-8 p-0 text-sage-600 hover:text-sage-800 hover:bg-sage-100"
                          title="Load class"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClass(classPlan)}
                          className="h-8 w-8 p-0 text-sage-600 hover:text-sage-800 hover:bg-sage-100"
                          title="Edit class"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteClass(classPlan.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                          title="Delete class"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {savedClasses.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-sage-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-sage-400" />
                  </div>
                  <h3 className="text-lg font-medium text-sage-600 mb-2">No Saved Classes</h3>
                  <p className="text-sage-500 text-sm">
                    Classes you save will appear here for future use
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View Class Dialog */}
      <Dialog open={!!viewingClass} onOpenChange={() => setViewingClass(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-sage-800">{viewingClass?.name}</DialogTitle>
          </DialogHeader>
          
          {viewingClass && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-sage-50 rounded-lg">
                  <div className="text-2xl font-bold text-sage-800">{viewingClass.exercises.length}</div>
                  <div className="text-sm text-sage-600">Exercises</div>
                </div>
                <div className="text-center p-4 bg-sage-50 rounded-lg">
                  <div className="text-2xl font-bold text-sage-800">{viewingClass.totalDuration}</div>
                  <div className="text-sm text-sage-600">Minutes</div>
                </div>
                <div className="text-center p-4 bg-sage-50 rounded-lg">
                  <div className="text-2xl font-bold text-sage-800">{getMuscleGroupCoverage(viewingClass).length}</div>
                  <div className="text-sm text-sage-600">Muscle Groups</div>
                </div>
              </div>

              {viewingClass.notes && (
                <div>
                  <h4 className="font-medium text-sage-700 mb-2">Notes</h4>
                  <p className="text-sage-600 bg-sage-50 p-3 rounded-lg text-sm">{viewingClass.notes}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sage-700 mb-3">Exercises</h4>
                <div className="space-y-2">
                  {viewingClass.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg">
                      <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center text-sm font-medium text-sage-700">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sage-800">{exercise.name}</div>
                        <div className="text-sm text-sage-600">{exercise.duration}min • {exercise.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  onLoadClass(viewingClass);
                  setViewingClass(null);
                }} className="flex-1 bg-sage-600 hover:bg-sage-700">
                  Load This Class
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewingClass(null)}
                  className="border-sage-300"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-sage-800">Edit Class Plan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="editClassName" className="text-sm font-medium text-sage-700 mb-2 block">Class Name</Label>
              <Input
                id="editClassName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter class name..."
                className="border-sage-300 focus:border-sage-500"
              />
            </div>
            
            <div>
              <Label htmlFor="editClassNotes" className="text-sm font-medium text-sage-700 mb-2 block">Notes</Label>
              <Textarea
                id="editClassNotes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Class notes..."
                rows={4}
                className="border-sage-300 focus:border-sage-500"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveEdit} className="flex-1 bg-sage-600 hover:bg-sage-700">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingClass(null)}
                className="border-sage-300"
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
