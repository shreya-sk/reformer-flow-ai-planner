import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Moon, 
  Sun, 
  Settings, 
  LogOut,
  Save,
  Edit2,
  Baby,
  Camera,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { CustomCalloutsManager } from './CustomCalloutsManager';
import { toast } from '@/hooks/use-toast';

// Default profile images
const defaultProfileImages = [
  '/lovable-uploads/156c5622-2826-4e16-8de0-e4c9aaa78cd3.png',
  '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
  '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
  '/lovable-uploads/8cb5e632-af4e-471a-a2c4-0371ce90cda2.png',
  '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
  '/lovable-uploads/52c9b506-ac25-4335-8a26-0c2b10d2c954.png',
];

export const EnhancedUserProfile = () => {
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences, updateDetailPreferences } = useUserPreferences();
  const [isEditing, setIsEditing] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
  });

  const handleSaveProfile = async () => {
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

  const resetPreferences = () => {
    updatePreferences({ 
      darkMode: false, 
      showPregnancySafeOnly: false,
      profileImage: '',
      customCallouts: []
    });
    toast({
      title: "Preferences reset",
      description: "All preferences have been reset to default.",
    });
  };

  const handleProfileImageSelect = (imageUrl: string) => {
    updatePreferences({ profileImage: imageUrl });
    setShowImageSelector(false);
    toast({
      title: "Profile image updated",
      description: "Your profile image has been changed.",
    });
  };

  const getUserInitials = () => {
    const name = profileData.displayName || profileData.email;
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const detailPrefs = preferences.exerciseDetailPreferences || {};

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} p-4`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            Profile Settings
          </h1>
          <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Image Section */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
          <CardHeader>
            <CardTitle className={`text-lg flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              <Camera className="h-5 w-5" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={preferences.profileImage} alt="Profile" />
              <AvatarFallback className="text-lg font-semibold bg-sage-100 text-sage-800">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button
                onClick={() => setShowImageSelector(!showImageSelector)}
                variant="outline"
                className="mb-2"
              >
                Choose Image
              </Button>
              {showImageSelector && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {defaultProfileImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => handleProfileImageSelect(imageUrl)}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-sage-400 transition-colors"
                    >
                      <img
                        src={imageUrl}
                        alt={`Profile option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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

        {/* Exercise Detail View Preferences */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
          <CardHeader>
            <CardTitle className={`text-lg flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              <Eye className="h-5 w-5" />
              Exercise Detail Preferences
            </CardTitle>
            <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
              Customize what information you see when viewing exercise details
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Springs & Equipment
                </Label>
                <Switch
                  checked={detailPrefs.showSpringsEquipment}
                  onCheckedChange={(checked) => updateDetailPreferences({ showSpringsEquipment: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Teaching Cues
                </Label>
                <Switch
                  checked={detailPrefs.showTeachingCues}
                  onCheckedChange={(checked) => updateDetailPreferences({ showTeachingCues: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Breathing Cues
                </Label>
                <Switch
                  checked={detailPrefs.showBreathingCues}
                  onCheckedChange={(checked) => updateDetailPreferences({ showBreathingCues: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Setup Instructions
                </Label>
                <Switch
                  checked={detailPrefs.showSetupInstructions}
                  onCheckedChange={(checked) => updateDetailPreferences({ showSetupInstructions: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Muscle Groups
                </Label>
                <Switch
                  checked={detailPrefs.showMuscleGroups}
                  onCheckedChange={(checked) => updateDetailPreferences({ showMuscleGroups: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Progressions
                </Label>
                <Switch
                  checked={detailPrefs.showProgressions}
                  onCheckedChange={(checked) => updateDetailPreferences({ showProgressions: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Regressions
                </Label>
                <Switch
                  checked={detailPrefs.showRegressions}
                  onCheckedChange={(checked) => updateDetailPreferences({ showRegressions: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Modifications
                </Label>
                <Switch
                  checked={detailPrefs.showModifications}
                  onCheckedChange={(checked) => updateDetailPreferences({ showModifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Safety Notes
                </Label>
                <Switch
                  checked={detailPrefs.showSafetyNotes}
                  onCheckedChange={(checked) => updateDetailPreferences({ showSafetyNotes: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Description
                </Label>
                <Switch
                  checked={detailPrefs.showDescription}
                  onCheckedChange={(checked) => updateDetailPreferences({ showDescription: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Images & Videos
                </Label>
                <Switch
                  checked={detailPrefs.showMedia}
                  onCheckedChange={(checked) => updateDetailPreferences({ showMedia: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Pregnancy Safety
                </Label>
                <Switch
                  checked={detailPrefs.showPregnancySafety}
                  onCheckedChange={(checked) => updateDetailPreferences({ showPregnancySafety: checked })}
                />
              </div>
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
          </CardContent>
        </Card>

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
                onClick={resetPreferences}
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
