
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, BookOpen, Plus, Timer, User, Store } from 'lucide-react';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';

interface BottomNavigationProps {
  onPlanClass?: () => void;
}

export const BottomNavigation = ({ onPlanClass }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentClass } = usePersistedClassPlan();
  
  const isActive = (path: string) => location.pathname === path;
  
  // Count non-callout exercises for the badge
  const exerciseCount = currentClass.exercises.filter(ex => ex.category !== 'callout').length;
  
  // Define navigation items - updated to include store
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/library', label: 'Library', icon: BookOpen },
    { path: '/plan', label: 'Plan', icon: Plus, special: true, count: exerciseCount },
    { path: '/store', label: 'Store', icon: Store },
    { path: '/timer', label: 'Timer', icon: Timer },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-sage-600 via-sage-500 to-sage-600"></div>
        
        {/* Flowing top wave */}
        <svg className="absolute top-0 w-full h-4" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,60 C360,20 600,50 840,30 C1080,10 1320,40 1440,25 L1440,0 L0,0 Z" fill="rgba(255,255,255,0.1)" />
        </svg>
        
        <div className="relative flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
          {navItems.map((item) => (
            item.special ? (
              <div key={item.path} className="relative">
                <Button
                  onClick={onPlanClass ? onPlanClass : () => navigate(item.path)}
                  className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                >
                  <item.icon className="h-7 w-7" />
                </Button>
                <Badge 
                  className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 border border-white text-xs font-bold ${
                    item.count && item.count > 0 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {item.count && item.count > 99 ? '99+' : (item.count || 0)}
                </Badge>
              </div>
            ) : (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                variant="ghost"
                className={`flex flex-col items-center text-white hover:text-sage-200 hover:bg-white/20 rounded-2xl transition-all duration-300 transform hover:scale-110 p-2 min-w-[60px] ${
                  isActive(item.path) ? 'bg-white/20' : ''
                }`}
              >
                {item.path === '/profile' ? (
                  <div className="w-5 h-5 rounded-full bg-white/30 mb-1 flex items-center justify-center">
                    <span className="text-xs font-bold">U</span>
                  </div>
                ) : item.path === '/store' ? (
                  <div className="relative">
                    <item.icon className="h-5 w-5 mb-1" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-sage-300 rounded-full"></span>
                  </div>
                ) : (
                  <item.icon className="h-5 w-5 mb-1" />
                )}
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};
