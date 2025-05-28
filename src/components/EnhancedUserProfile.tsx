
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Camera, Save, User, Award, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface UserProfile {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  experience: string;
  certifications: string[];
  specialties: string[];
  profilePicture: string;
}

export const EnhancedUserProfile = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    experience: 'beginner',
    certifications: [],
    specialties: [],
    profilePicture: ''
  });

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5-10 years)' },
    { value: 'expert', label: 'Expert (10+ years)' }
  ];

  const commonCertifications = [
    'PMA Certified',
    'BASI Pilates',
    'Romana\'s Pilates',
    'Classical Pilates',
    'Contemporary Pilates',
    'Stott Pilates',
    'Balanced Body',
    'Peak Pilates'
  ];

  const specialtyAreas = [
    'Prenatal/Postnatal',
    'Injury Rehabilitation',
    'Athletes',
    'Seniors',
    'Beginners',
    'Advanced Movement',
    'Anatomy Focus',
    'Breath Work'
  ];

  const handleSave = () => {
    // Here you would save to Supabase
    setIsEditing(false);
  };

  const toggleCertification = (cert: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const toggleSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
      <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Profile Settings
            </CardTitle>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className={isEditing ? "" : "bg-sage-600 hover:bg-sage-700"}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture & Basic Info */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.profilePicture} />
                <AvatarFallback className="bg-sage-100 text-sage-700 text-xl">
                  {profile.firstName?.[0]}{profile.lastName?.[0] || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-sage-600 hover:bg-sage-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    First Name
                  </Label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
                <div>
                  <Label className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    Last Name
                  </Label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
              </div>

              <div>
                <Label className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  Bio
                </Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself and your Pilates journey..."
                  className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : ''}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className={`flex items-center gap-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                disabled={!isEditing}
                placeholder="City, Country"
                className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : ''}
              />
            </div>

            <div>
              <Label className={`flex items-center gap-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                <Award className="h-4 w-4" />
                Experience Level
              </Label>
              <Select
                value={profile.experience}
                onValueChange={(value) => setProfile(prev => ({ ...prev, experience: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <Label className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} mb-3 block`}>
              Certifications
            </Label>
            <div className="flex flex-wrap gap-2">
              {commonCertifications.map(cert => (
                <Badge
                  key={cert}
                  variant={profile.certifications.includes(cert) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isEditing ? 'hover:scale-105' : 'cursor-default'
                  } ${
                    profile.certifications.includes(cert)
                      ? 'bg-sage-600 text-white'
                      : preferences.darkMode 
                        ? 'border-gray-600 text-gray-300'
                        : 'border-sage-300 text-sage-600'
                  }`}
                  onClick={() => isEditing && toggleCertification(cert)}
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div>
            <Label className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} mb-3 block`}>
              Teaching Specialties
            </Label>
            <div className="flex flex-wrap gap-2">
              {specialtyAreas.map(specialty => (
                <Badge
                  key={specialty}
                  variant={profile.specialties.includes(specialty) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isEditing ? 'hover:scale-105' : 'cursor-default'
                  } ${
                    profile.specialties.includes(specialty)
                      ? 'bg-sage-600 text-white'
                      : preferences.darkMode 
                        ? 'border-gray-600 text-gray-300'
                        : 'border-sage-300 text-sage-600'
                  }`}
                  onClick={() => isEditing && toggleSpecialty(specialty)}
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* App Preferences */}
          <div className="border-t pt-6">
            <h3 className={`text-lg font-semibold mb-4 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              App Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    Dark Mode
                  </Label>
                  <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Use dark theme throughout the app
                  </p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => updatePreferences({ darkMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    Pregnancy Safe Only
                  </Label>
                  <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Show only pregnancy-safe exercises
                  </p>
                </div>
                <Switch
                  checked={preferences.showPregnancySafeOnly}
                  onCheckedChange={(checked) => updatePreferences({ showPregnancySafeOnly: checked })}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-sage-600 hover:bg-sage-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
