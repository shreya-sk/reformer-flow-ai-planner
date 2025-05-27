
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit2, Trash2, Copy, Calendar, Clock, ChevronDown, ChevronRight, Save, X } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';

interface ClassPlanManagerProps {
  currentClass: ClassPlan;
  savedClasses: ClassPlan[];
  onUpdateClassName: (name: string) => void;
  onUpdateClassNotes: (notes: string) => void;
  onDeleteClass: (classId: string) => void;
  onLoadClass: (classPlan: ClassPlan) => void;
  onUpdateClass: (updatedClass: ClassPlan) => Promise<boolean>;
  onSaveClass: () => void;
}

export const ClassPlanManager = ({
  currentClass,
  savedClasses,
  onUpdateClassName,
  onUpdateClassNotes,
  onDeleteClass,
  onLoadClass,
  onUpdateClass,
  onSaveClass
}: ClassPlanManagerProps) => {
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const toggleExpanded = (classId: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedClasses(newExpanded);
  };

  const startEditing = (classPlan: ClassPlan) => {
    setEditingClass(classPlan.id);
    setEditName(classPlan.name);
    setEditNotes(classPlan.notes || '');
  };

  const saveEdit = async () => {
    if (editingClass) {
      const classToUpdate = savedClasses.find(c => c.id === editingClass);
      if (classToUpdate) {
        const updatedClass = {
          ...classToUpdate,
          name: editName,
          notes: editNotes
        };
        
        const success = await onUpdateClass(updatedClass);
        if (success) {
          setEditingClass(null);
        }
      }
    }
  };

  const cancelEdit = () => {
    setEditingClass(null);
    setEditName('');
    setEditNotes('');
  };

  const duplicateClass = (classPlan: ClassPlan) => {
    const duplicatedClass = {
      ...classPlan,
      id: '',
      name: `${classPlan.name} (Copy)`,
      createdAt: new Date()
    };
    onLoadClass(duplicatedClass);
  };

  const deleteClass = (classId: string, className: string) => {
    if (window.confirm(`Delete "${className}"? This cannot be undone.`)) {
      onDeleteClass(classId);
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
    <div className="space-y-6">
      {/* Current Class Section */}
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
              placeholder="Add notes, modifications, or reminders..."
              className="border-sage-300 focus:border-sage-500 focus:ring-sage-200"
              rows={3}
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
              <div className="text-2xl font-bold text-sage-800">
                {Array.from(new Set(currentClass.exercises.flatMap(ex => ex.muscleGroups))).length}
              </div>
              <div className="text-xs text-sage-600 font-medium">Muscle Groups</div>
            </div>
          </div>

          {currentClass.exercises.length > 0 && (
            <Button
              onClick={onSaveClass}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white"
            >
              Save Class Plan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Saved Classes Section */}
      <div>
        <h3 className="text-xl font-semibold text-sage-800 mb-4">
          My Classes ({savedClasses.length})
        </h3>

        <div className="space-y-3">
          {savedClasses.map((classPlan) => (
            <Card key={classPlan.id} className="border-sage-200 hover:border-sage-300 transition-all">
              <CardContent className="p-0">
                <Collapsible open={expandedClasses.has(classPlan.id)}>
                  <CollapsibleTrigger
                    onClick={() => toggleExpanded(classPlan.id)}
                    className="w-full p-4 text-left hover:bg-sage-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedClasses.has(classPlan.id) ? (
                          <ChevronDown className="h-4 w-4 text-sage-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-sage-600" />
                        )}
                        <div>
                          <h4 className="font-semibold text-sage-800">{classPlan.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-sage-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(classPlan.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {classPlan.totalDuration}min
                            </span>
                            <span>{classPlan.exercises.length} exercises</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-sage-100">
                      {/* Action Buttons */}
                      <div className="flex gap-2 py-3">
                        <Button
                          onClick={() => onLoadClass(classPlan)}
                          size="sm"
                          className="bg-sage-600 hover:bg-sage-700 text-white"
                        >
                          Load Class
                        </Button>
                        <Button
                          onClick={() => duplicateClass(classPlan)}
                          size="sm"
                          variant="outline"
                          className="border-sage-300"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button
                          onClick={() => startEditing(classPlan)}
                          size="sm"
                          variant="outline"
                          className="border-sage-300"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteClass(classPlan.id, classPlan.name)}
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>

                      {/* Edit Form */}
                      {editingClass === classPlan.id && (
                        <div className="space-y-3 p-3 bg-sage-50 rounded-lg mb-3">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Class name"
                            className="border-sage-300"
                          />
                          <Textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Class notes"
                            rows={2}
                            className="border-sage-300"
                          />
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm" className="bg-sage-600 hover:bg-sage-700">
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button onClick={cancelEdit} size="sm" variant="outline">
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Class Notes */}
                      {classPlan.notes && (
                        <div className="mb-3 p-3 bg-amber-50 rounded-lg">
                          <p className="text-sm text-amber-800">{classPlan.notes}</p>
                        </div>
                      )}

                      {/* Exercises List */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-sage-700 text-sm">Exercises ({classPlan.exercises.length})</h5>
                        {classPlan.exercises.map((exercise, index) => (
                          <div key={exercise.id} className="flex items-center gap-3 p-2 bg-white rounded border border-sage-200">
                            <div className="w-6 h-6 bg-sage-200 rounded-full flex items-center justify-center text-xs font-medium text-sage-700">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sage-800 text-sm">{exercise.name}</div>
                              <div className="text-xs text-sage-600">
                                {exercise.duration}min • {exercise.category} • {exercise.springs} springs
                              </div>
                              <div className="flex gap-1 mt-1">
                                {exercise.muscleGroups.slice(0, 3).map(group => (
                                  <Badge key={group} variant="secondary" className="text-xs h-4 bg-sage-100 text-sage-600">
                                    {group}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}

          {savedClasses.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-sage-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-sage-400" />
              </div>
              <h3 className="text-lg font-medium text-sage-600 mb-2">No Saved Classes</h3>
              <p className="text-sage-500 text-sm">
                Build a class and save it to see it here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
