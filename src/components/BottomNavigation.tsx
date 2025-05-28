
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, BookOpen, Timer, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavigationProps {
  onPlanClass: () => void;
}

export const BottomNavigation = ({ onPlanClass }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: Home, label: 'My Classes', path: '/' },
    { id: 'library', icon: BookOpen, label: 'Library', path: '/library' },
    { id: 'timer', icon: Timer, label: 'Timer', path: '/timer' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage-200 safe-area-pb z-50">
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
        {navItems.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center">
            {index === 2 && (
              // FAB Plan Class button in the center
              <Button
                onClick={onPlanClass}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 -mt-6 mb-1"
              >
                <Plus className="h-6 w-6" />
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center h-auto px-3 py-2 ${
                isActive(item.path)
                  ? 'text-sage-600'
                  : 'text-sage-400 hover:text-sage-600'
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${index === 2 ? 'opacity-0' : ''}`} />
              <span className={`text-xs font-medium ${index === 2 ? 'opacity-0' : ''}`}>
                {item.label}
              </span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
