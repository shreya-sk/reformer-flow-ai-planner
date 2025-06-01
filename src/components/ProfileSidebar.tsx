
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
    { title: 'Store', url: '/store', icon: Store, color: 'bg-amber-100 text-amber-700' },
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
      {/* Enhanced Backdrop with blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Enhanced Sidebar - more rounded and light sage */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-sage-50/95 backdrop-blur-xl shadow-2xl z-50 transform transition-all duration-300 ease-out rounded-l-3xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Enhanced Header */}
        <div className="p-6 bg-gradient-to-r from-sage-500/90 to-sage-600/90 text-white relative rounded-tl-3xl backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 w-8 h-8"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3 mr-8">
            <Avatar className="h-12 w-12 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">
                {user?.email || 'Guest'}
              </p>
              <p className="text-xs text-white/80">Reformer Instructor</p>
            </div>
          </div>
        </div>

        {/* Enhanced Menu Items - minimal typography */}
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              onClick={() => handleNavigation(item.url)}
              className="w-full justify-start rounded-2xl h-12 transition-all duration-200 hover:bg-sage-100/80 text-sage-700 text-sm font-medium"
            >
              <div className={`p-2.5 rounded-xl mr-3 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <span>{item.title}</span>
              {item.url === '/store' && (
                <div className="ml-auto w-2 h-2 bg-amber-600 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>

        {/* Enhanced Sign Out */}
        <div className="absolute bottom-6 left-4 right-4">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start rounded-2xl h-12 text-red-600 hover:bg-red-50/80 text-sm font-medium"
          >
            <div className="p-2.5 rounded-xl mr-3 bg-red-100 text-red-600">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};
