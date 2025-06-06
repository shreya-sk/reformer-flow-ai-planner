
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen, Timer, User, Layers3, Store, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NavigationButtons = () => {
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/library', label: 'Exercise Library', icon: BookOpen },
    { path: '/store', label: 'Exercise Store', icon: Store },
    { path: '/class-plans', label: 'Class Plans', icon: Calendar },
    { path: '/plan', label: 'Plan Class', icon: Layers3 },
    { path: '/timer', label: 'Timer', icon: Timer },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          onClick={() => navigate(item.path)}
          variant="outline"
          className={`flex items-center gap-2 border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-400 relative ${
            item.path === '/plan' ? 'bg-sage-100 border-sage-400' : ''
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
          {item.path === '/store' && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-sage-600 rounded-full"></span>
          )}
        </Button>
      ))}
    </div>
  );
};
