
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Moon, 
  Sun, 
  Settings, 
  Eye,
  LogOut,
  Save,
  Edit2,
  Baby
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { CustomCalloutsManager } from './CustomCalloutsManager';
import { toast } from '@/hooks/use-toast';

export const EnhancedUserProfile = () => {
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences, clearPreferences } = useUserPreferences();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
  });

  const handleSaveProfile = async () => {
    // In a real app, you'd update the user profile here
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} p-4`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            Profile Settings
          </h1>
          <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`text-lg flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <Button
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  size="sm"
                  variant={isEditing ? "default" : "outline"}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="displayName" className={preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}>
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                  disabled={!isEditing}
                  className={`mt-1 ${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-300'}`}
                />
              </div>
              
              <div>
                <Label htmlFor="email" className={preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}>
                  Email Address
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                  <Input
                    id="email"
                    value={profileData.email}
                    disabled
                    className={`flex-1 ${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-sage-300'}`}
                  />
                </div>
                <p className={`text-xs mt-1 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                  Email cannot be changed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
            <CardHeader>
              <CardTitle className={`text-lg flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                <Settings className="h-5 w-5" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {preferences.darkMode ? (
                    <Moon className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  )}
                  <div>
                    <Label className={`font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      Dark Mode
                    </Label>
                    <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => updatePreferences({ darkMode: checked })}
                />
              </div>

              <Separator className={preferences.darkMode ? 'bg-gray-700' : 'bg-sage-200'} />

              {/* Pregnancy Safe Filter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Baby className="h-4 w-4 text-pink-500" />
                  <div>
                    <Label className={`font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      Show Only Pregnancy Safe Exercises
                    </Label>
                    <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                      Filter exercise library to show pregnancy-safe options only
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.showPregnancySafeOnly || false}
                  onCheckedChange={(checked) => updatePreferences({ showPregnancySafeOnly: checked })}
                />
              </div>

              <Separator className={preferences.darkMode ? 'bg-gray-700' : 'bg-sage-200'} />

              {/* Exercise Visibility */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-sage-500" />
                  <div>
                    <Label className={`font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      Show Exercise Details
                    </Label>
                    <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                      Display detailed exercise information in library
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.showExerciseDetails || true}
                  onCheckedChange={(checked) => updatePreferences({ showExerciseDetails: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Callouts Manager */}
        <CustomCalloutsManager />

        {/* Account Actions */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={clearPreferences}
                variant="outline"
                className="flex-1"
              >
                Reset Preferences
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="flex-1 gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className={`text-center py-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
          <p className="text-sm">
            ReformerPro v1.0.0 • Built for Pilates Instructors
          </p>
        </div>
      </div>
    </div>
  );
};
