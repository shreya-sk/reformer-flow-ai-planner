
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen, Timer, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NavigationButtons = () => {
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/library', label: 'Exercise Library', icon: BookOpen },
    { path: '/plan', label: 'Plan Class', icon: ChevronRight },
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
          className="flex items-center gap-2 border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-400"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </div>
  );
};
