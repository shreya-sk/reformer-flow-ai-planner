
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2 } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

export const CustomCalloutsManager = () => {
  const { preferences, addCustomCallout, removeCustomCallout, updateCustomCallouts } = useUserPreferences();
  const [newCallout, setNewCallout] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCallout = () => {
    if (newCallout.trim() && !preferences.customCallouts.includes(newCallout.trim())) {
      addCustomCallout(newCallout.trim());
      setNewCallout('');
    }
  };

  const handleEditCallout = (index: number) => {
    setEditingIndex(index);
    setEditValue(preferences.customCallouts[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updatedCallouts = [...preferences.customCallouts];
      updatedCallouts[editingIndex] = editValue.trim();
      updateCustomCallouts(updatedCallouts);
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
      <CardHeader>
        <CardTitle className={`text-lg ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
          Custom Callouts
        </CardTitle>
        <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
          Create custom section dividers for organizing your class plans
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new callout */}
        <div className="flex gap-2">
          <Input
            value={newCallout}
            onChange={(e) => setNewCallout(e.target.value)}
            placeholder="Enter new callout name..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddCallout()}
            className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-300'}
          />
          <Button 
            onClick={handleAddCallout}
            size="sm"
            className="bg-sage-600 hover:bg-sage-700"
            disabled={!newCallout.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* List of callouts */}
        <div className="space-y-2">
          {preferences.customCallouts.map((callout, index) => (
            <div key={index} className="flex items-center gap-2">
              {editingIndex === index ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveEdit} variant="outline">
                    Save
                  </Button>
                  <Button size="sm" onClick={handleCancelEdit} variant="ghost">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Badge 
                    variant="secondary" 
                    className={`flex-1 justify-start ${preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-sage-100 text-sage-700'}`}
                  >
                    {callout}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditCallout(index)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCustomCallout(callout)}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
