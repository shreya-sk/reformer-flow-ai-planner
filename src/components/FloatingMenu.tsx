
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  Store, 
  Timer, 
  HelpCircle, 
  LogOut,
  X
} from 'lucide-react';

interface FloatingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingMenu = ({ isOpen, onClose }: FloatingMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const menuItems = [
    { title: 'Profile', url: '/profile', icon: User, color: 'bg-blue-100 text-blue-600' },
    { title: 'Timer', url: '/timer', icon: Timer, color: 'bg-green-100 text-green-600' },
    { title: 'Store', url: '/store', icon: Store, color: 'bg-purple-100 text-purple-600' },
    { title: 'Settings', url: '/settings', icon: Settings, color: 'bg-orange-100 text-orange-600' },
    { title: 'Help', url: '/help', icon: HelpCircle, color: 'bg-pink-100 text-pink-600' },
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - More subtle */}
      <div 
        className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Floating Menu - Compact rounded rectangle */}
      <div className="fixed bottom-32 right-4 z-50 animate-slide-in-bottom">
        <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden min-w-0">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full p-2 w-8 h-8"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3 mr-10 pr-2">
              <Avatar className="h-12 w-12 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white font-bold">
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

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                onClick={() => handleNavigation(item.url)}
                className={`w-full justify-start rounded-2xl h-16 transition-all duration-200 text-lg ${
                  isActive(item.url) 
                    ? 'bg-sage-100 text-sage-800 shadow-sm' 
                    : 'hover:bg-sage-50 text-sage-700'
                }`}
              >
                <div className={`p-3 rounded-xl mr-4 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold">{item.title}</span>
                {item.url === '/store' && (
                  <div className="ml-auto w-2.5 h-2.5 bg-sage-600 rounded-full"></div>
                )}
              </Button>
            ))}
          </div>

          {/* Sign Out */}
          <div className="p-4 pt-0 border-t border-sage-100 mt-2">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start rounded-2xl h-16 text-red-600 hover:bg-red-50 text-lg"
            >
              <div className="p-3 rounded-xl mr-4 bg-red-100 text-red-600">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="font-semibold">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
