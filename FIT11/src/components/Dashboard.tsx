
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './shared/Sidebar';
import { TopBar } from './shared/TopBar';
import { FitnessEmptyState } from './shared/FitnessEmptyState';
import { LoadingState } from './shared/LoadingState';
import { ErrorState } from './shared/ErrorState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, Target, Trophy, Brain, Trash2, Eye, Plus } from 'lucide-react';

interface SavedWorkoutPlan {
  id: string;
  name: string;
  split: string;
  goal: string;
  experience: string;
  daysPerWeek: number;
  createdAt: string;
  planData: any;
}

interface DashboardProps {
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  savedPlans?: SavedWorkoutPlan[];
  onDeletePlan?: (planId: string) => void;
  userPoints?: number;
  leaderboardRank?: number;
  currentStreak?: number;
}

export function Dashboard({ 
  onLogout, 
  isDarkMode, 
  onToggleTheme, 
  savedPlans = [], 
  onDeletePlan, 
  userPoints = 0, 
  leaderboardRank = 0, 
  currentStreak = 12 
}: DashboardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddNew = () => navigate('/workout-form');
  const handleAIBuilder = () => navigate('/ai-builder');

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  // Main content renderer
  const renderMainContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState onRetry={handleRetry} />;
    
    if (!savedPlans || savedPlans.length === 0) {
      return <FitnessEmptyState onAddNew={handleAddNew} onAIBuilder={handleAIBuilder} />;
    }
    
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">AI Workout Plans</h2>
              <p className="text-sm text-muted-foreground">Manage your generated routines</p>
            </div>
          </div>
          <Button onClick={handleAIBuilder} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-all duration-200 border-muted/60">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate" title={plan.name}>
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="mt-1 truncate">
                      {plan.split}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {plan.daysPerWeek} days
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm bg-muted/30 p-3 rounded-md">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Goal</p>
                    <p className="capitalize truncate" title={plan.goal.replace('_', ' ')}>
                      {plan.goal.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Level</p>
                    <p className="capitalize truncate" title={plan.experience}>
                      {plan.experience}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Created:</span>
                  <span>{new Date(plan.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/plan/${plan.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {onDeletePlan && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this plan?')) {
                          onDeletePlan(plan.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar 
        currentPage="dashboard" 
        onLogout={onLogout} 
        isDarkMode={isDarkMode} 
        onToggleTheme={onToggleTheme} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          title="Dashboard" 
          onLogout={onLogout} 
          isDarkMode={isDarkMode} 
          onToggleTheme={onToggleTheme} 
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                title="Total Plans" 
                value={savedPlans.length} 
                subtext="AI-generated plans" 
                icon={TrendingUp}
                loading={loading}
              />
              <StatsCard 
                title="Total Points" 
                value={userPoints.toLocaleString()} 
                subtext="Community points" 
                icon={Trophy}
                loading={loading}
              />
              <StatsCard 
                title="Current Streak" 
                value={currentStreak} 
                subtext="Days in a row" 
                icon={Target}
                loading={loading}
              />
              <StatsCard 
                title="Rank" 
                value={leaderboardRank > 0 ? `#${leaderboardRank}` : '-'} 
                subtext="Global leaderboard" 
                icon={Trophy}
                loading={loading}
              />
            </div>

            {/* Content Area */}
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper component for consistent Stat Cards
function StatsCard({ title, value, subtext, icon: Icon, loading }: { title: string, value: string | number, subtext: string, icon: any, loading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      </CardContent>
    </Card>
  );
}