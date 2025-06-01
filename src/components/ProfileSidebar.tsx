
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
    { title: 'Profile', url: '/profile', icon: User, color: 'text-sage-700' },
    { title: 'Store', url: '/store', icon: Store, color: 'text-burgundy-700', isStore: true },
    { title: 'Settings', url: '/settings', icon: Settings, color: 'text-sage-700' },
    { title: 'Help', url: '/help', icon: HelpCircle, color: 'text-sage-700' },
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
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Small Capsule Sidebar */}
      <div className={`fixed top-4 right-4 w-80 bg-white/90 backdrop-blur-2xl shadow-2xl z-50 transform transition-all duration-300 ease-out rounded-3xl border border-sage-200/50 ${
        isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}>
        
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-3 right-3 text-sage-500 hover:bg-sage-100 rounded-full w-8 h-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-sage-200/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-sage-200">
              <AvatarFallback className="bg-sage-600 text-white text-lg font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sage-800 truncate">
                {user?.email || 'Guest'}
              </p>
              <p className="text-sm text-sage-600">Instructor</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              onClick={() => handleNavigation(item.url)}
              className={`w-full justify-start rounded-xl h-12 transition-all duration-200 hover:bg-sage-100/60 ${item.color}`}
            >
              <div className="p-2 rounded-lg mr-3 bg-sage-100">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="font-medium">{item.title}</span>
              {item.isStore && (
                <div className="ml-auto w-2 h-2 bg-burgundy-600 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-sage-200/50">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start rounded-xl h-12 text-red-600 hover:bg-red-50/60"
          >
            <div className="p-2 rounded-lg mr-3 bg-red-100 text-red-600">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};
