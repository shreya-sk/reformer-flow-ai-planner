
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  Store, 
  Timer, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { setOpen } = useSidebar();

  const menuItems = [
    { title: 'Profile', url: '/profile', icon: User },
    { title: 'Timer', url: '/timer', icon: Timer },
    { title: 'Store', url: '/store', icon: Store },
    { title: 'Settings', url: '/settings', icon: Settings },
    { title: 'Help', url: '/help', icon: HelpCircle },
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
    setOpen(false); // Close sidebar on mobile after navigation
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar side="left" className="border-r border-sage-200">
      <SidebarHeader className="p-4 border-b border-sage-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-sage-600 text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sage-800 truncate">
              {user?.email || 'Guest'}
            </p>
            <p className="text-xs text-sage-500">Reformer Instructor</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sage-600 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    className={`w-full justify-between hover:bg-sage-50 ${
                      isActive(item.url) ? 'bg-sage-100 text-sage-800 font-medium' : 'text-sage-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    {item.url === '/store' && (
                      <span className="w-2 h-2 bg-sage-600 rounded-full"></span>
                    )}
                    <ChevronRight className="h-3 w-3 opacity-50" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sage-200">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-sage-600 hover:bg-sage-50 hover:text-sage-800"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
