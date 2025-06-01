
import React from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  FileText,
  ArrowLeft,
  ExternalLink,
  Play,
  BookOpen,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const navigate = useNavigate();

  const helpSections = [
    {
      title: "Getting Started",
      icon: Play,
      color: "bg-blue-100 text-blue-600",
      items: [
        "How to create your first class",
        "Adding exercises to your library",
        "Using the timer feature"
      ]
    },
    {
      title: "Exercise Library",
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
      items: [
        "Browsing and filtering exercises",
        "Creating custom exercises",
        "Managing your library"
      ]
    },
    {
      title: "Teaching Mode",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      items: [
        "Setting up your class",
        "Using the presentation view",
        "Managing class timing"
      ]
    }
  ];

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
          <h1 className="text-xl font-semibold text-sage-800">Help & Support</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-sage-800">
              <div className="p-2 bg-sage-100 rounded-2xl">
                <HelpCircle className="h-5 w-5 text-sage-600" />
              </div>
              Quick Help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between rounded-2xl h-12 border-sage-200">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-sage-600" />
                <span>Live Chat Support</span>
              </div>
              <ExternalLink className="h-4 w-4 text-sage-400" />
            </Button>
            <Button variant="outline" className="w-full justify-between rounded-2xl h-12 border-sage-200">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-sage-600" />
                <span>Email Support</span>
              </div>
              <ExternalLink className="h-4 w-4 text-sage-400" />
            </Button>
            <Button variant="outline" className="w-full justify-between rounded-2xl h-12 border-sage-200">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-sage-600" />
                <span>Documentation</span>
              </div>
              <ExternalLink className="h-4 w-4 text-sage-400" />
            </Button>
          </CardContent>
        </Card>

        {/* Help Sections */}
        {helpSections.map((section, index) => (
          <Card key={index} className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-sage-800">
                <div className={`p-2 rounded-2xl ${section.color}`}>
                  <section.icon className="h-5 w-5" />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className="w-full justify-start rounded-2xl h-auto p-4 text-left hover:bg-sage-50"
                  >
                    <span className="text-sage-700">{item}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* App Info */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <h3 className="font-semibold text-sage-800">Reformer Instructor</h3>
              <p className="text-sm text-sage-600">Version 1.0.0</p>
              <p className="text-xs text-sage-500 mt-4">
                Built with love for Pilates instructors
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Help;
