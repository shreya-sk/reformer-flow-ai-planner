
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Edit2, Palette } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { CustomCallout } from '@/types/reformer';

const colorOptions = [
  { value: 'amber' as const, label: 'Amber', bgClass: 'bg-amber-100', borderClass: 'border-amber-400', textClass: 'text-amber-700' },
  { value: 'blue' as const, label: 'Blue', bgClass: 'bg-blue-100', borderClass: 'border-blue-400', textClass: 'text-blue-700' },
  { value: 'green' as const, label: 'Green', bgClass: 'bg-green-100', borderClass: 'border-green-400', textClass: 'text-green-700' },
  { value: 'purple' as const, label: 'Purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-400', textClass: 'text-purple-700' },
  { value: 'red' as const, label: 'Red', bgClass: 'bg-red-100', borderClass: 'border-red-400', textClass: 'text-red-700' },
];

export const CustomCalloutsManager = () => {
  const { preferences, addCustomCallout, updateCustomCallout, deleteCustomCallout } = useUserPreferences();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCallout, setEditingCallout] = useState<string | null>(null);
  const [newCalloutName, setNewCalloutName] = useState('');
  const [newCalloutColor, setNewCalloutColor] = useState<CustomCallout['color']>('amber');
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState<CustomCallout['color']>('amber');

  const handleAddCallout = () => {
    if (newCalloutName.trim()) {
      addCustomCallout(newCalloutName.trim(), newCalloutColor);
      setNewCalloutName('');
      setNewCalloutColor('amber');
      setShowAddDialog(false);
    }
  };

  const startEditing = (callout: CustomCallout) => {
    setEditingCallout(callout.id);
    setEditName(callout.name);
    setEditColor(callout.color);
  };

  const saveEdit = () => {
    if (editingCallout && editName.trim()) {
      updateCustomCallout(editingCallout, { name: editName.trim(), color: editColor });
      setEditingCallout(null);
      setEditName('');
      setEditColor('amber');
    }
  };

  const cancelEdit = () => {
    setEditingCallout(null);
    setEditName('');
    setEditColor('amber');
  };

  const getColorClasses = (color: CustomCallout['color']) => {
    const colorOption = colorOptions.find(option => option.value === color);
    return colorOption || colorOptions[0];
  };

  return (
    <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
      <CardHeader>
        <CardTitle className={`text-lg flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
          <Palette className="h-5 w-5" />
          Custom Callouts
        </CardTitle>
        <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
          Create custom section dividers with colors for organizing your class plans
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new callout button */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button 
              className="w-full border-dashed border-2 border-sage-300 hover:border-sage-400 bg-transparent hover:bg-sage-50 text-sage-600"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Callout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Callout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newCalloutName}
                  onChange={(e) => setNewCalloutName(e.target.value)}
                  placeholder="Enter callout name..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Color</label>
                <Select value={newCalloutColor} onValueChange={(value: CustomCallout['color']) => setNewCalloutColor(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border-2 ${option.bgClass} ${option.borderClass}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Preview */}
              {newCalloutName && (
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className={`border-l-4 pl-3 py-2 rounded-r-lg ${getColorClasses(newCalloutColor).borderClass} ${getColorClasses(newCalloutColor).bgClass}`}>
                    <span className={`font-medium ${getColorClasses(newCalloutColor).textClass}`}>
                      {newCalloutName}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddCallout} disabled={!newCalloutName.trim()} className="flex-1">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* List of custom callouts */}
        <div className="space-y-2">
          {(preferences.customCallouts || []).map((callout) => {
            const colorClasses = getColorClasses(callout.color);
            
            return (
              <div key={callout.id} className="flex items-center gap-2">
                {editingCallout === callout.id ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-sm"
                    />
                    <Select value={editColor} onValueChange={(value: CustomCallout['color']) => setEditColor(value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded border ${option.bgClass} ${option.borderClass}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={saveEdit} variant="outline" className="text-xs">
                        Save
                      </Button>
                      <Button size="sm" onClick={cancelEdit} variant="ghost" className="text-xs">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`flex-1 border-l-4 pl-3 py-2 rounded-r-lg ${colorClasses.borderClass} ${colorClasses.bgClass}`}>
                      <span className={`font-medium text-sm ${colorClasses.textClass}`}>
                        {callout.name}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(callout)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteCustomCallout(callout.id)}
                      className={`h-6 w-6 p-0 ${
                        preferences.darkMode 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-red-500 hover:text-red-700'
                      }`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {(preferences.customCallouts || []).length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-xl">
            <Palette className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">No custom callouts yet.</p>
            <p className="text-gray-500 text-xs mt-1">
              Create custom section dividers to organize your classes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
