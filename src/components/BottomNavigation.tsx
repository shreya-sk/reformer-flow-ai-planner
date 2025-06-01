
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, BookOpen, Plus, Menu } from 'lucide-react';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { FloatingMenu } from '@/components/FloatingMenu';

interface BottomNavigationProps {
  onPlanClass?: () => void;
}

export const BottomNavigation = ({ onPlanClass }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentClass } = usePersistedClassPlan();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  // Count non-callout exercises for the badge
  const exerciseCount = currentClass.exercises.filter(ex => ex.category !== 'callout').length;
  
  // Core navigation items only - clean and focused
  const coreNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/library', label: 'Library', icon: BookOpen },
    { path: '/plan', label: 'Plan', icon: Plus, special: true, count: exerciseCount },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="relative overflow-hidden">
          {/* Floating pill-shaped navigation */}
          <div className="mx-4 mb-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-2">
              <div className="flex items-center justify-around max-w-lg mx-auto">
                {/* Core navigation items */}
                {coreNavItems.map((item) => (
                  item.special ? (
                    <div key={item.path} className="relative">
                      <Button
                        onClick={onPlanClass ? onPlanClass : () => navigate(item.path)}
                        className="w-16 h-16 rounded-3xl bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                      >
                        <item.icon className="h-7 w-7" />
                      </Button>
                      <Badge 
                        className={`absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 border-2 border-white text-xs font-bold rounded-full ${
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
                      className={`flex flex-col items-center rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 p-3 min-w-[64px] h-16 ${
                        isActive(item.path) 
                          ? 'bg-sage-100 text-sage-700' 
                          : 'text-sage-600 hover:text-sage-700 hover:bg-sage-50'
                      }`}
                    >
                      <item.icon className="h-6 w-6 mb-1" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </Button>
                  )
                ))}

                {/* Menu button */}
                <Button
                  onClick={() => setIsMenuOpen(true)}
                  variant="ghost"
                  className="flex flex-col items-center text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 p-3 min-w-[64px] h-16"
                >
                  <Menu className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">Menu</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Menu */}
      <FloatingMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
};
