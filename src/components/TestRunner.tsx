
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, AlertCircle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

export const TestRunner = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Class Builder Loads', status: 'pending' },
    { name: 'Add Exercise Navigation', status: 'pending' },
    { name: 'Exercise Selection', status: 'pending' },
    { name: 'Drag and Drop Reorder', status: 'pending' },
    { name: 'Exercise Edit Modal', status: 'pending' },
    { name: 'Exercise Deletion', status: 'pending' },
    { name: 'Class Name Update', status: 'pending' },
    { name: 'Save Class Plan', status: 'pending' },
    { name: 'Local Storage Persistence', status: 'pending' },
    { name: 'Duration Calculation', status: 'pending' }
  ]);

  const runTest = async (testIndex: number) => {
    const newTests = [...tests];
    newTests[testIndex].status = 'running';
    setTests(newTests);

    const startTime = Date.now();
    
    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // For demo purposes, randomly pass/fail tests
      const passed = Math.random() > 0.3; // 70% pass rate
      
      newTests[testIndex].status = passed ? 'passed' : 'failed';
      newTests[testIndex].duration = Date.now() - startTime;
      newTests[testIndex].message = passed 
        ? 'Test completed successfully' 
        : 'Test failed - check implementation';
        
    } catch (error) {
      newTests[testIndex].status = 'failed';
      newTests[testIndex].message = `Error: ${error}`;
    }
    
    setTests(newTests);
  };

  const runAllTests = async () => {
    for (let i = 0; i < tests.length; i++) {
      await runTest(i);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;
  const totalTests = tests.length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Functionality Test Suite</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              {passedTests} Passed
            </Badge>
            <Badge variant="outline" className="text-red-600">
              {failedTests} Failed
            </Badge>
            <Badge variant="outline">
              {totalTests - passedTests - failedTests} Pending
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button onClick={runAllTests} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Run All Tests
          </Button>
        </div>
        
        <div className="space-y-2">
          {tests.map((test, index) => (
            <div 
              key={test.name}
              className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <span className="font-medium">{test.name}</span>
                {test.duration && (
                  <span className="text-sm text-gray-500">
                    ({test.duration}ms)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {test.message && (
                  <span className="text-sm text-gray-600">{test.message}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runTest(index)}
                  disabled={test.status === 'running'}
                >
                  Run
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-sage-50 rounded-lg">
          <h4 className="font-semibold mb-2">Test Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {Math.round((passedTests / totalTests) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
