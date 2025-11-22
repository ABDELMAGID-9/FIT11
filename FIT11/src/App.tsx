import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/shared/MainLayout';
import { LoginScreen } from './components/LoginScreen';
// Ensure this path is correct based on where you created the file
import { RegisterScreen } from './components/RegisterScreen'; 
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { WorkoutDetails } from './components/WorkoutDetails';
import { WorkoutForm } from './components/WorkoutForm';
import { SettingsPage } from './components/SettingsPage';
import { NotFoundPage } from './components/NotFoundPage';
import { AIWorkoutBuilder } from './components/AIWorkoutBuilder';
import { NutritionPlanner } from './components/NutritionPlanner';
import { Leaderboard } from './components/Leaderboard';
import { NoRepCounter } from './components/NoRepCounter';
import { CommunityHub } from './components/CommunityHub';
import { AudioLibrary } from './components/AudioLibrary';

export interface SavedWorkoutPlan {
  id: string;
  name: string;
  split: string;
  goal: string;
  experience: string;
  daysPerWeek: number;
  createdAt: string;
  planData: any;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('userPoints');
    return saved ? parseInt(saved) : 1680;
  });
  
  // Store user profile info
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [savedPlans, setSavedPlans] = useState<SavedWorkoutPlan[]>(() => {
    const saved = localStorage.getItem('workoutPlans');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('workoutStreak');
    return saved ? parseInt(saved) : 0;
  });
  const [lastWorkoutDate, setLastWorkoutDate] = useState(() => {
    const saved = localStorage.getItem('lastWorkoutDate');
    return saved || null;
  });
  const [leaderboardRank, setLeaderboardRank] = useState(0);

  useEffect(() => {
      const leaderboardUsers = [
        { name: 'Alex Johnson', points: 2450 },
        { name: 'Sarah Chen', points: 2380 },
        { name: 'Mike Rodriguez', points: 2210 },
        { name: 'Emma Wilson', points: 2100 },
        { name: 'David Park', points: 1950 },
        { name: 'Lisa Thompson', points: 1820 },
        { name: 'James Wilson', points: 1750 },
        { name: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'You', points: userPoints },
      ];
      const sortedUsers = [...leaderboardUsers]
        .map(user => user.name.includes('You') || (userProfile && user.name === `${userProfile.firstName} ${userProfile.lastName}`) ? { ...user, points: userPoints } : user)
        .sort((a, b) => b.points - a.points);
      
      const rank = sortedUsers.findIndex(u => u.name.includes('You') || (userProfile && u.name === `${userProfile.firstName} ${userProfile.lastName}`)) + 1;
      setLeaderboardRank(rank);
    }, [userPoints, userProfile]);
  
    useEffect(() => {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);
  
    useEffect(() => {
      localStorage.setItem('userPoints', userPoints.toString());
    }, [userPoints]);

    // Save profile when updated
    useEffect(() => {
      if (userProfile) {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
    }, [userProfile]);
  
    useEffect(() => {
      localStorage.setItem('workoutPlans', JSON.stringify(savedPlans));
      if (savedPlans.length > 0) {
        const today = new Date().toDateString();
        const lastDate = lastWorkoutDate ? new Date(lastWorkoutDate).toDateString() : null;
        if (lastDate === today) return;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        if (lastDate === yesterdayStr) {
          const newStreak = currentStreak + 1;
          setCurrentStreak(newStreak);
          localStorage.setItem('workoutStreak', newStreak.toString());
        } else if (!lastDate) {
          setCurrentStreak(1);
          localStorage.setItem('workoutStreak', '1');
        } else {
          setCurrentStreak(1);
          localStorage.setItem('workoutStreak', '1');
        }
        setLastWorkoutDate(today);
        localStorage.setItem('lastWorkoutDate', today);
      }
    }, [savedPlans]);
  
    useEffect(() => {
      if (!localStorage.getItem('workoutStreak')) {
        setCurrentStreak(12);
        localStorage.setItem('workoutStreak', '12');
      }
    }, []);

  const handleLogin = () => setIsAuthenticated(true);
  
  const handleRegister = (userData: { firstName: string; lastName: string; gymLevel: string }) => {
    setUserProfile(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handlePointsUpdate = (points: number) => setUserPoints(points);
  const handleSavePlan = (plan: SavedWorkoutPlan) => setSavedPlans(prev => [...prev, plan]);
  const handleDeletePlan = (planId: string) => setSavedPlans(prev => prev.filter(p => p.id !== planId));

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return (
      <MainLayout onLogout={handleLogout} isDarkMode={isDarkMode} onToggleTheme={toggleTheme}>
        {children}
      </MainLayout>
    );
  };

  return (
    <Router>
      <div className="size-full">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
          />

          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen onLogin={handleLogin} />} 
          />

          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterScreen onRegister={handleRegister} />} 
          />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard 
                onLogout={handleLogout} isDarkMode={isDarkMode} onToggleTheme={toggleTheme}
                savedPlans={savedPlans} onDeletePlan={handleDeletePlan}
                userPoints={userPoints} leaderboardRank={leaderboardRank} currentStreak={currentStreak}
              />
            </ProtectedRoute>
          } />
          
          <Route path="/workout/:id" element={<ProtectedRoute><WorkoutDetails onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/workout-form" element={<ProtectedRoute><WorkoutForm onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/ai-builder" element={<ProtectedRoute><AIWorkoutBuilder onLogout={handleLogout} onSavePlan={handleSavePlan} savedPlans={savedPlans} /></ProtectedRoute>} />
          <Route path="/plan/:planId" element={<ProtectedRoute><AIWorkoutBuilder onLogout={handleLogout} onSavePlan={handleSavePlan} savedPlans={savedPlans} /></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><NutritionPlanner onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard onLogout={handleLogout} userPoints={userPoints} onPointsUpdate={handlePointsUpdate} leaderboardRank={leaderboardRank} /></ProtectedRoute>} />
          <Route path="/no-rep-counter" element={<ProtectedRoute><NoRepCounter onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityHub onLogout={handleLogout} userPoints={userPoints} onPointsUpdate={handlePointsUpdate} /></ProtectedRoute>} />
          <Route path="/audio-library" element={<ProtectedRoute><AudioLibrary onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}