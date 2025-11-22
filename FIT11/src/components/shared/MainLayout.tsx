import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function MainLayout({ children, onLogout, isDarkMode, onToggleTheme }: MainLayoutProps) {
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block h-full">
        <Sidebar 
          onLogout={onLogout} 
          isDarkMode={isDarkMode} 
          onToggleTheme={onToggleTheme} 
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}