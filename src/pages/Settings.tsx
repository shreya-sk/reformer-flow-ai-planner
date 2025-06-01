
import React from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download,
  Trash2,
  ArrowLeft,
  Moon,
  Volume2,
  Vibrate
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-sage-100 sticky top-0 z-40">
        <div className="p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-sage-100"
          >
            <ArrowLeft className="h-5 w-5 text-sage-600" />
          </Button>
          <h1 className="text-xl font-semibold text-sage-800">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-sage-800">
              <div className="p-2 bg-sage-100 rounded-2xl">
                <User className="h-5 w-5 text-sage-600" />
              </div>
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-sage-50 rounded-2xl">
              <p className="text-sm text-sage-600">Email</p>
              <p className="font-medium text-sage-800">{user?.email || 'Not signed in'}</p>
            </div>
            <Button className="w-full rounded-2xl bg-sage-600 hover:bg-sage-700 h-12">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-sage-800">
              <div className="p-2 bg-blue-100 rounded-2xl">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-sage-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-sage-600" />
                <span className="text-sage-700">Sound</span>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 bg-sage-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Vibrate className="h-4 w-4 text-sage-600" />
                <span className="text-sage-700">Vibration</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-sage-800">
              <div className="p-2 bg-purple-100 rounded-2xl">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-sage-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-sage-600" />
                <span className="text-sage-700">Dark Mode</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-sage-800">
              <div className="p-2 bg-green-100 rounded-2xl">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start rounded-2xl h-12 border-sage-200">
              <Download className="h-4 w-4 mr-3" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-2xl h-12 border-red-200 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-3" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
