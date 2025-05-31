
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, Star, EyeOff, Palette, Moon, Sun, Camera, ChevronRight, Baby } from 'lucide-react';
import { CustomCalloutsManager } from './CustomCalloutsManager';
import { TeachingModePreferences } from './TeachingModePreferences';
import { UserStatsSection } from './UserStatsSection';

export const EnhancedUserProfile = () => {
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences, togglePregnancySafeOnly } = useUserPreferences();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '');

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveProfile = () => {
    // In a real app, you'd save this to the user's profile
    setIsEditing(false);
    console.log('Profile updated');
  };

  const toggleDarkMode = () => {
    updatePreferences({ darkMode: !preferences.darkMode });
    console.log(`Switched to ${preferences.darkMode ? 'light' : 'dark'} mode`);
  };

  const userInitials = user?.user_metadata?.full_name
    ?.split(' ')
    ?.map((n: string) => n[0])
    ?.join('')
    ?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-6`}>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={preferences.profileImage} />
                  <AvatarFallback className="text-2xl font-bold bg-sage-600 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="font-semibold text-lg"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} size="sm">Save</Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      {displayName}
                    </h1>
                    <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      {user?.email}
                    </p>
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 p-0 h-auto font-normal"
                    >
                      Edit profile <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="teaching">Teaching</TabsTrigger>
            <TabsTrigger value="callouts">Callouts</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <UserStatsSection />
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            {/* Display Preferences */}
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  <Palette className="h-5 w-5" />
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={preferences.darkMode ? 'text-white' : 'text-sage-800'}>
                      Dark Mode
                    </Label>
                    <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      Use dark theme throughout the app
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-500" />
                    <Switch
                      checked={preferences.darkMode || false}
                      onCheckedChange={toggleDarkMode}
                    />
                    <Moon className="h-4 w-4 text-slate-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={preferences.darkMode ? 'text-white' : 'text-sage-800'}>
                      Pregnancy-Safe Only
                    </Label>
                    <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      Show only pregnancy-safe exercises
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Baby className="h-4 w-4 text-pink-500" />
                    <Switch
                      checked={preferences.showPregnancySafeOnly || false}
                      onCheckedChange={togglePregnancySafeOnly}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teaching" className="space-y-4">
            <TeachingModePreferences />
          </TabsContent>

          <TabsContent value="callouts" className="space-y-4">
            <CustomCalloutsManager />
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            {/* Account Actions */}
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  <User className="h-5 w-5" />
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
