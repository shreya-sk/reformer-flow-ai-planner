
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
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Very Compact Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-48 bg-white/95 backdrop-blur-xl shadow-xl z-50 transform transition-all duration-300 ease-out rounded-l-xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Ultra Compact Header */}
        <div className="p-2 bg-gradient-to-r from-sage-400/70 to-sage-500/70 text-white relative rounded-tl-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-0.5 right-0.5 text-white hover:bg-white/20 rounded-full p-1 w-5 h-5"
          >
            <X className="h-2.5 w-2.5" />
          </Button>
          
          <div className="flex items-center gap-1.5 mr-4">
            <Avatar className="h-6 w-6 border border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-[10px] font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-[10px]">
                {user?.email || 'Guest'}
              </p>
              <p className="text-[8px] text-white/70">Instructor</p>
            </div>
          </div>
        </div>

        {/* Ultra Compact Menu */}
        <div className="p-1.5 space-y-0.5">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              onClick={() => handleNavigation(item.url)}
              className={`w-full justify-start rounded-md h-7 transition-all duration-200 hover:bg-sage-100/60 text-[10px] font-medium ${
                item.isStore ? 'text-burgundy-800 hover:text-burgundy-900' : 'text-sage-700'
              }`}
            >
              <div className={`p-0.5 rounded-sm mr-1.5 ${item.color}`}>
                <item.icon className="h-2.5 w-2.5" />
              </div>
              <span>{item.title}</span>
              {item.url === '/store' && (
                <div className="ml-auto w-1 h-1 bg-burgundy-600 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>

        {/* Ultra Compact Sign Out */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start rounded-md h-7 text-red-600 hover:bg-red-50/60 text-[10px] font-medium"
          >
            <div className="p-0.5 rounded-sm mr-1.5 bg-red-100 text-red-600">
              <LogOut className="h-2.5 w-2.5" />
            </div>
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};
