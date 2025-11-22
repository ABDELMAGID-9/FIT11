import React from 'react';
import { Search, User, LogOut, Menu, Home, Brain, Trophy, Target, Users as UsersIcon, Apple, Headphones, Settings } from 'lucide-react';
// CHANGED: using '../ui/' to go up one folder level
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '../ui/dropdown-menu';
import { Link, useLocation } from 'react-router-dom';

interface TopBarProps {
  title?: string;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function TopBar({ title, onLogout, isDarkMode, onToggleTheme }: TopBarProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'AI Workout Builder', href: '/ai-builder', icon: Brain },
    { name: 'AI Nutrition Tracker', href: '/nutrition', icon: Apple },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'No-Rep Counter', href: '/no-rep-counter', icon: Target },
    { name: 'Audio Library', href: '/audio-library', icon: Headphones },
    { name: 'Community', href: '/community', icon: UsersIcon },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="h-auto min-h-[4rem] pt-8 pb-4 border-b bg-background flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-2 ml-2">
              <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <DropdownMenuItem key={item.name} asChild className={isActive ? "bg-accent" : ""}>
                    <Link to={item.href} className="flex items-center gap-3 w-full cursor-pointer py-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Page Title */}
        {title && <h1 className="text-lg font-semibold truncate">{title}</h1>}
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Profile Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}