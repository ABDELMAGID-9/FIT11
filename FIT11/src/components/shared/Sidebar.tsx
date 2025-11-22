import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  Trophy, 
  Target, 
  Headphones, 
  Users, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Activity
} from 'lucide-react';
// Go up one level to access UI components
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface SidebarProps {
  currentPage?: string;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Sidebar({ currentPage, onLogout, isDarkMode, onToggleTheme }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'workout-builder', label: 'AI Workout Builder', icon: Dumbbell, path: '/ai-builder' },
    { id: 'nutrition', label: 'AI Nutrition Tracker', icon: Utensils, path: '/nutrition' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { id: 'no-rep', label: 'No-Rep Counter', icon: Target, path: '/no-rep' },
    { id: 'audio', label: 'Audio Library', icon: Headphones, path: '/audio' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' },
    // Renamed Settings to Profile
    { id: 'profile', label: 'Profile', icon: User, path: '/settings' }, 
  ];

  return (
    // ADDED: 'hidden md:flex' ensures it is hidden on mobile and visible as flex on desktop
    <div className="hidden md:flex h-full w-64 bg-card border-r border-border flex-col">
      <div className="p-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
          FIT11
        </span>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">Menu</p>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={location.pathname === item.path || currentPage === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                location.pathname === item.path || currentPage === item.id 
                  ? "bg-primary/10 text-primary hover:bg-primary/15" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 space-y-4">
        <Separator />
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={onToggleTheme}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}