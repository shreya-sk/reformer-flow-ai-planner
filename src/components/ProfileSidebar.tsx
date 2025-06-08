
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  Store, 
  HelpCircle, 
  LogOut,
  X
} from 'lucide-react';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSidebar = ({ isOpen, onClose }: ProfileSidebarProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    { title: 'Profile', url: '/profile', icon: User, color: 'bg-sage-100 text-sage-700' },
    { title: 'Store', url: '/store', icon: Store, color: 'bg-sage-100 text-burgundy-800', isStore: true },
    { title: 'Settings', url: '/settings', icon: Settings, color: 'bg-sage-100 text-sage-700' },
    { title: 'Help', url: '/help', icon: HelpCircle, color: 'bg-sage-100 text-sage-700' },
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      {/* Enhanced Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 transition-all duration-500 ease-out"
          onClick={onClose}
        />
      )}
      
      {/* Enhanced Sidebar - Much Bigger */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-all duration-500 ease-out rounded-l-3xl ${
        isOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'
      }`}>
        
        {/* Enhanced Header */}
        <div className="p-6 bg-gradient-to-br from-sage-500/80 to-sage-600/80 text-white relative rounded-tl-3xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 w-10 h-10 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-4 mr-12">
            <Avatar className="h-16 w-16 border-2 border-white/30 shadow-lg">
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-lg">
                {user?.email || 'Guest'}
              </p>
              <p className="text-sm text-white/80">Reformer Instructor</p>
            </div>
          </div>
        </div>

        {/* Enhanced Menu Items */}
        <div className="p-6 space-y-3">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              onClick={() => handleNavigation(item.url)}
              className={`w-full justify-start rounded-2xl h-14 transition-all duration-300 hover:scale-105 hover:shadow-md text-base font-medium ${
                item.isStore ? 'text-burgundy-800 hover:text-burgundy-900 hover:bg-burgundy-50' : 'text-sage-700 hover:bg-sage-100'
              }`}
            >
              <div className={`p-3 rounded-xl mr-4 transition-all duration-200 ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left">{item.title}</span>
              {item.url === '/store' && (
                <div className="w-3 h-3 bg-burgundy-600 rounded-full animate-pulse"></div>
              )}
            </Button>
          ))}
        </div>

        {/* Enhanced Sign Out */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start rounded-2xl h-14 text-red-600 hover:bg-red-50 hover:scale-105 transition-all duration-300 text-base font-medium"
          >
            <div className="p-3 rounded-xl mr-4 bg-red-100 text-red-600 transition-all duration-200">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="flex-1 text-left">Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};
