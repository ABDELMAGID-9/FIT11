import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TopBar } from './shared/TopBar';

interface WorkoutFormProps {
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  notes: string;
}

interface FormData {
  name: string;
  description: string;
  type: 'building_muscle' | 'cardio' | '';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | '';
  duration: number;
  exercises: Exercise[];
}

interface FormErrors {
  name?: string;
  description?: string;
  type?: string;
  difficulty?: string;
  duration?: string;
  exercises?: string;
}

// Popular exercises list for autocomplete
const POPULAR_EXERCISES = {
  strength: [
    'Squat',
    'Bench Press',
    'Deadlift',
    'Leg Extension',
    'Leg Curl',
    'Leg Press',
    'Bicep Curls',
    'Tricep Curls',
    'Lat Pull Down',
    'Pull-ups',
    'Push-ups',
    'Dumbbell Press',
    'Shoulder Press',
    'Lateral Raises',
    'Front Raises',
    'Chest Fly',
    'Cable Crossover',
    'Dips',
    'Barbell Row',
    'Dumbbell Row',
    'Face Pulls',
    'Hammer Curls',
    'Preacher Curls',
    'Tricep Extensions',
    'Skull Crushers',
    'Calf Raises',
    'Lunges',
    'Bulgarian Split Squat',
    'Romanian Deadlift',
    'Hip Thrust',
    'Plank',
    'Ab Crunches',
  ],
  cardio: [
    'Running on Treadmill',
    'Walking on Treadmill',
    'Cycling',
    'Rowing Machine',
    'Elliptical',
    'Stair Climber',
    'Jump Rope',
    'Burpees',
    'Mountain Climbers',
    'High Knees',
    'Jumping Jacks',
    'Swimming',
    'Running (Outdoor)',
    'Cycling (Outdoor)',
  ]
};

export function WorkoutForm({ onLogout, isDarkMode, onToggleTheme }: WorkoutFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  const [formData, setFormData] = useState<FormData>({
    name: isEditing ? 'Upper Body Strength' : '',
    description: isEditing ? 'Focus on chest, shoulders, and arms with compound movements' : '',
    type: isEditing ? 'building_muscle' : '',
    difficulty: isEditing ? 'intermediate' : '',
    duration: isEditing ? 45 : 30,
    exercises: isEditing ? [
      {
        id: '1',
        name: 'Push-ups',
        sets: 3,
        reps: '12-15',
        rest: 60,
        notes: 'Keep your core tight'
      }
    ] : [
      {
        id: '1',
        name: '',
        sets: 3,
        reps: '',
        rest: 60,
        notes: ''
      }
    ]
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available exercises based on workout type
  const getAvailableExercises = () => {
    if (formData.type === 'building_muscle') {
      return POPULAR_EXERCISES.strength;
    } else if (formData.type === 'cardio') {
      return POPULAR_EXERCISES.cardio;
    }
    return [...POPULAR_EXERCISES.strength, ...POPULAR_EXERCISES.cardio];
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Workout name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Workout name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.type) {
      newErrors.type = 'Workout type is required';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty level is required';
    }

    if (formData.duration < 5 || formData.duration > 180) {
      newErrors.duration = 'Duration must be between 5 and 180 minutes';
    }

    const hasValidExercises = formData.exercises.some(ex => ex.name.trim() && ex.reps.trim());
    if (!hasValidExercises) {
      newErrors.exercises = 'At least one exercise with name and reps is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    navigate('/dashboard');
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: 3,
      reps: '',
      rest: 60,
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const removeExercise = (id: string) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== id)
    }));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    }));
  };

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

          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Edit Workout' : 'Create New Workout'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Workout Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Upper Body Strength"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="5"
                      max="180"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                      className={errors.duration ? 'border-destructive' : ''}
                    />
                    {errors.duration && (
                      <p className="text-sm text-destructive">{errors.duration}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your workout and its goals"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Workout Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select workout type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="building_muscle">Building Muscle</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange('difficulty', value)}
                    >
                      <SelectTrigger className={errors.difficulty ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.difficulty && (
                      <p className="text-sm text-destructive">{errors.difficulty}</p>
                    )}
                  </div>
                </div>

                {/* Exercises */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3>Exercises</h3>
                    <Button type="button" onClick={addExercise} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </Button>
                  </div>

                  {errors.exercises && (
                    <p className="text-sm text-destructive">{errors.exercises}</p>
                  )}

                  <div className="space-y-4">
                    {formData.exercises.map((exercise, index) => (
                      <Card key={exercise.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm">Exercise {index + 1}</h4>
                            {formData.exercises.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExercise(exercise.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Exercise Name</Label>
                              <Select
                                value={exercise.name}
                                onValueChange={(value) => updateExercise(exercise.id, 'name', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select or type an exercise" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                  {getAvailableExercises().map((exerciseName) => (
                                    <SelectItem key={exerciseName} value={exerciseName}>
                                      {exerciseName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Reps</Label>
                              <Input
                                placeholder="e.g., 12-15 or 30 seconds"
                                value={exercise.reps}
                                onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Sets</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={exercise.sets}
                                onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 1)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Rest (seconds)</Label>
                              <Input
                                type="number"
                                min="0"
                                max="300"
                                value={exercise.rest}
                                onChange={(e) => updateExercise(exercise.id, 'rest', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <Label>Form Notes (optional)</Label>
                            <Textarea
                              placeholder="Tips for proper form and technique"
                              rows={2}
                              value={exercise.notes}
                              onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Workout' : 'Create Workout')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}