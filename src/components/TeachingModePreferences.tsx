
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Settings, Timer, Image as ImageIcon, Lightbulb, Wind, Shield, TrendingUp } from 'lucide-react';

export const TeachingModePreferences = () => {
  const { preferences, updateTeachingModePreferences } = useUserPreferences();
  const teachingPrefs = preferences.teachingModePreferences;

  const handlePreferenceChange = (key: string, value: boolean) => {
    updateTeachingModePreferences({ [key]: value });
  };

  const preferenceItems = [
    {
      key: 'showSetupInstructions',
      label: 'Setup Instructions',
      description: 'Show positioning and equipment setup',
      icon: Settings,
      enabled: teachingPrefs?.showSetupInstructions ?? true
    },
    {
      key: 'showTeachingCues',
      label: 'Teaching Cues',
      description: 'Display exercise coaching points',
      icon: Lightbulb,
      enabled: teachingPrefs?.showTeachingCues ?? true
    },
    {
      key: 'showBreathingCues',
      label: 'Breathing Cues',
      description: 'Show breathing instructions',
      icon: Wind,
      enabled: teachingPrefs?.showBreathingCues ?? true
    },
    {
      key: 'showSafetyNotes',
      label: 'Safety Notes',
      description: 'Display contraindications and safety warnings',
      icon: Shield,
      enabled: teachingPrefs?.showSafetyNotes ?? true
    },
    {
      key: 'showProgressionsRegressions',
      label: 'Progressions & Regressions',
      description: 'Show exercise modifications',
      icon: TrendingUp,
      enabled: teachingPrefs?.showProgressionsRegressions ?? true
    },
    {
      key: 'showTimer',
      label: 'Exercise Timer',
      description: 'Display countdown timer for timed exercises',
      icon: Timer,
      enabled: teachingPrefs?.showTimer ?? true
    },
    {
      key: 'showExerciseImage',
      label: 'Exercise Images',
      description: 'Show reference images when available',
      icon: ImageIcon,
      enabled: teachingPrefs?.showExerciseImage ?? true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Teaching Mode Display
        </CardTitle>
        <p className="text-sm text-sage-600">
          Customize what information appears during teaching mode to focus on what matters most to you.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferenceItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.key} className="flex items-start space-x-3 p-3 rounded-lg border border-sage-100 hover:bg-sage-50">
              <div className="flex-shrink-0 mt-1">
                <IconComponent className="h-4 w-4 text-sage-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor={item.key} className="text-sm font-medium text-sage-800 cursor-pointer">
                    {item.label}
                  </Label>
                  <Switch
                    id={item.key}
                    checked={item.enabled}
                    onCheckedChange={(checked) => handlePreferenceChange(item.key, checked)}
                  />
                </div>
                <p className="text-xs text-sage-600 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
