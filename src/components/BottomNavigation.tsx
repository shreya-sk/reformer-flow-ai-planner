
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Timer, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface BottomNavigationProps {
  onPlanClass: () => void;
}

export const BottomNavigation = ({ onPlanClass }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences } = useUserPreferences();

  const navItems = [
    { id: 'home', icon: Home, label: 'Classes', path: '/' },
    { id: 'library', icon: BookOpen, label: 'Library', path: '/library' },
    { id: 'plan', icon: Plus, label: 'Plan', action: onPlanClass },
    { id: 'timer', icon: Timer, label: 'Timer', path: '/timer' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-t safe-area-pb z-50`}>
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActiveItem = item.path ? isActive(item.path) : false;
          const isPlanButton = item.id === 'plan';
          
          if (isPlanButton) {
            return (
              <Button
                key={item.id}
                onClick={item.action}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <item.icon className="h-5 w-5" />
              </Button>
            );
          }

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => item.path && navigate(item.path)}
              className={`flex flex-col items-center h-auto px-3 py-2 ${
                isActiveItem
                  ? preferences.darkMode ? 'text-sage-400' : 'text-sage-600'
                  : preferences.darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-sage-400 hover:text-sage-600'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
