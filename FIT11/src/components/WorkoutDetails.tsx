import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Target, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { TopBar } from './shared/TopBar';

interface WorkoutDetailsProps {
  onLogout: () => void;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
  completed: boolean;
}

export function WorkoutDetails({ onLogout }: WorkoutDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // Mock data - in a real app, this would be fetched based on the id
  const workout = {
    id: id || '1',
    name: 'Upper Body Strength',
    description: 'Focus on chest, shoulders, and arms with compound movements for maximum muscle building',
    type: 'strength' as const,
    duration: 45,
    difficulty: 'intermediate' as const,
    lastCompleted: '2024-01-20',
    completedCount: 12,
    estimatedCalories: 320,
    exercises: [
      {
        id: '1',
        name: 'Push-ups',
        sets: 3,
        reps: '12-15',
        rest: 60,
        notes: 'Keep your core tight and maintain straight line from head to heels',
        completed: false
      },
      {
        id: '2',
        name: 'Dumbbell Bench Press',
        sets: 4,
        reps: '8-10',
        rest: 90,
        notes: 'Control the weight on both up and down phases',
        completed: false
      },
      {
        id: '3',
        name: 'Shoulder Press',
        sets: 3,
        reps: '10-12',
        rest: 75,
        notes: 'Press straight up, don\'t arch your back',
        completed: false
      },
      {
        id: '4',
        name: 'Bent-over Rows',
        sets: 3,
        reps: '10-12',
        rest: 75,
        notes: 'Pull to your lower chest, squeeze shoulder blades together',
        completed: false
      },
      {
        id: '5',
        name: 'Tricep Dips',
        sets: 3,
        reps: '8-12',
        rest: 60,
        notes: 'Lower until arms are at 90 degrees, push through heels',
        completed: false
      }
    ] as Exercise[]
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-red-100 text-red-800';
      case 'cardio':
        return 'bg-blue-100 text-blue-800';
      case 'hiit':
        return 'bg-orange-100 text-orange-800';
      case 'flexibility':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const startWorkout = () => {
    setIsStarted(true);
  };

  const completeSet = () => {
    if (currentSet < workout.exercises[currentExercise].sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTime(workout.exercises[currentExercise].rest);
      
      // Simulate rest timer
      const timer = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Complete exercise
      setCompletedExercises(prev => [...prev, workout.exercises[currentExercise].id]);
      
      if (currentExercise < workout.exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
        setCurrentSet(1);
      } else {
        // Workout complete
        alert('Workout completed! Great job!');
        navigate('/dashboard');
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const getWorkoutProgress = () => {
    const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets, 0);
    const completedSets = completedExercises.length * workout.exercises[0]?.sets || 0;
    const currentProgress = (currentExercise * workout.exercises[0]?.sets || 0) + (currentSet - 1);
    return Math.round(((completedSets + currentProgress) / totalSets) * 100);
  };

  if (isStarted) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <TopBar onLogout={onLogout} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h1>{workout.name}</h1>
              <Progress value={getWorkoutProgress()} className="w-full h-3" />
              <p className="text-muted-foreground">
                Exercise {currentExercise + 1} of {workout.exercises.length}
              </p>
            </div>

            {isResting ? (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="text-center p-8">
                  <h2 className="text-4xl mb-4">{restTime}s</h2>
                  <p className="text-muted-foreground mb-4">Rest Time</p>
                  <Button onClick={skipRest} variant="outline">
                    Skip Rest
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    {workout.exercises[currentExercise].name}
                  </CardTitle>
                  <CardDescription>
                    Set {currentSet} of {workout.exercises[currentExercise].sets}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl">
                      {workout.exercises[currentExercise].reps}
                    </div>
                    <p className="text-muted-foreground">Repetitions</p>
                  </div>

                  {workout.exercises[currentExercise].notes && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Form Tip:</strong> {workout.exercises[currentExercise].notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={completeSet} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Set
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/no-rep-counter')}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Use No-Rep Counter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exercise List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exercise List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workout.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        index === currentExercise
                          ? 'border-primary bg-primary/5'
                          : completedExercises.includes(exercise.id)
                          ? 'border-green-200 bg-green-50'
                          : 'border-border'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        completedExercises.includes(exercise.id)
                          ? 'bg-green-500 text-white'
                          : index === currentExercise
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {completedExercises.includes(exercise.id) ? '✓' : index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-sm">{exercise.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar onLogout={onLogout} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1>{workout.name}</h1>
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor(workout.type)}>
                  {workout.type}
                </Badge>
                <Badge className={getDifficultyColor(workout.difficulty)}>
                  {workout.difficulty}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={startWorkout} size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/workout-form?edit=${workout.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {workout.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exercises ({workout.exercises.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workout.exercises.map((exercise, index) => (
                      <div key={exercise.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
                              {index + 1}
                            </div>
                            <h3>{exercise.name}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {exercise.rest}s rest
                            </div>
                          </div>
                        </div>
                        
                        {exercise.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Form Tip:</strong> {exercise.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p>{workout.duration} minutes</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Calories</p>
                      <p>{workout.estimatedCalories} kcal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Completed</p>
                      <p>{workout.lastCompleted}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Times Completed</p>
                      <p>{workout.completedCount}x</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link to="/no-rep-counter">
                      <Target className="h-4 w-4 mr-2" />
                      Use No-Rep Counter
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/mood-workout">
                      <Target className="h-4 w-4 mr-2" />
                      Mood-Based Alternative
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}