
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
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Compact Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-56 bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out rounded-l-[1.5rem] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Compact Header */}
        <div className="p-3 bg-gradient-to-r from-sage-400/80 to-sage-500/80 text-white relative rounded-tl-[1.5rem]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-1 right-1 text-white hover:bg-white/20 rounded-full p-1 w-6 h-6"
          >
            <X className="h-3 w-3" />
          </Button>
          
          <div className="flex items-center gap-2 mr-5">
            <Avatar className="h-7 w-7 border border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-xs">
                {user?.email || 'Guest'}
              </p>
              <p className="text-[10px] text-white/70">Instructor</p>
            </div>
          </div>
        </div>

        {/* Compact Menu */}
        <div className="p-2 space-y-0.5">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              onClick={() => handleNavigation(item.url)}
              className={`w-full justify-start rounded-lg h-8 transition-all duration-200 hover:bg-sage-100/60 text-xs font-medium ${
                item.isStore ? 'text-burgundy-800 hover:text-burgundy-900' : 'text-sage-700'
              }`}
            >
              <div className={`p-1 rounded-md mr-2 ${item.color}`}>
                <item.icon className="h-3 w-3" />
              </div>
              <span>{item.title}</span>
              {item.url === '/store' && (
                <div className="ml-auto w-1.5 h-1.5 bg-burgundy-600 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>

        {/* Compact Sign Out */}
        <div className="absolute bottom-2 left-2 right-2">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start rounded-lg h-8 text-red-600 hover:bg-red-50/60 text-xs font-medium"
          >
            <div className="p-1 rounded-md mr-2 bg-red-100 text-red-600">
              <LogOut className="h-3 w-3" />
            </div>
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};
