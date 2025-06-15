
import React from 'react';
import { TestRunner } from '@/components/TestRunner';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const Testing = () => {
  const { preferences } = useUserPreferences();

  return (
    <div className={`min-h-screen p-4 ${
      preferences.darkMode 
        ? 'dark bg-gray-900' 
        : 'bg-gradient-to-br from-sage-50 via-white to-sage-100'
    }`}>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">
            Reformer Flow - Functionality Testing
          </h1>
          <p className="text-gray-600">
            Run automated tests to verify app functionality
          </p>
        </div>
        
        <TestRunner />
        
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/30">
            <h3 className="font-semibold mb-4">Manual Testing Checklist</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="nav-test" />
                <label htmlFor="nav-test">Navigate between different pages</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="add-exercise" />
                <label htmlFor="add-exercise">Add exercises to class plan</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="reorder" />
                <label htmlFor="reorder">Reorder exercises via drag and drop</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit-exercise" />
                <label htmlFor="edit-exercise">Edit exercise details</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="save-class" />
                <label htmlFor="save-class">Save and load class plans</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="responsive" />
                <label htmlFor="responsive">Test responsive design</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testing;
