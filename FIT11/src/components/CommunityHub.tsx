// src/components/CommunityHub.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, MessageCircle, Heart, Share2, Trophy, Plus, Search, X,
  Image as ImageIcon, Send, User, ThumbsUp, MessageSquare, Eye, Trash2,
  MoreVertical, Award, Crown, Medal
} from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TopBar } from './shared/TopBar';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './utils/ImageWithFallback';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

import workout1Image from '../assets/workout1.jpg';
import workout2Image from '../assets/workout2.jpg';


interface CommunityHubProps {
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  userPoints: number;
  onPointsUpdate: (points: number) => void;
}

interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
    points?: number;
  };
  content: string;
  images?: string[];
  workout?: {
    name: string;
    duration: number;
    calories: number;
  };
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked: boolean;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  participants: number;
  endDate: string;
  progress: number;
  isJoined: boolean;
}

// Points system constants
const POINTS = {
  POST: 10,
  COMMENT: 5,
  LIKE_RECEIVED: 1,
  LIKE_GIVEN: 0 // No points for giving likes
};

export function CommunityHub({
  onLogout, isDarkMode, onToggleTheme, userPoints, onPointsUpdate
}: CommunityHubProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Current user
  const [currentUser, setCurrentUser] = useState({
    name: 'You',
    avatar: '',
    badge: 'Rising Star',
    points: userPoints
  });

  // New post form state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState<{ [key: string]: string }>({});
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);

  // Posts state (✅ استخدمنا الصور المستوردة بدل المسارات المطلقة)
  const [postsData, setPostsData] = useState<Post[]>([
    {
      id: '1',
      author: { name: 'Sarah Chen', badge: 'Warrior', points: 2380 },
      content:
        'Just crushed my morning HIIT session! Feeling amazing and ready to take on the day. Who else is getting their sweat on today? 💪',
      workout: { name: 'HIIT Cardio Blast', duration: 30, calories: 285 },
      likes: 24,
      comments: [
        {
          id: 'c1', postId: '1', author: { name: 'Mike Rodriguez' },
          content: 'Great work! Keep it up! 🔥', timestamp: '1 hour ago', likes: 5, isLiked: false
        },
        {
          id: 'c2', postId: '1', author: { name: 'Emma Wilson' },
          content: "You're such an inspiration! What time do you usually workout?",
          timestamp: '45 mins ago', likes: 2, isLiked: false
        }
      ],
      timestamp: '2 hours ago',
      isLiked: false
    },
    {
      id: '2',
      author: { name: 'Mike Rodriguez', badge: 'Champion', points: 2210 },
      content:
        'Week 3 of the 30-day challenge complete! The community support here is incredible. Thanks everyone for keeping me motivated!',
      images: [workout1Image], // ✅
      likes: 31,
      comments: [
        {
          id: 'c3', postId: '2', author: { name: 'Alex Johnson' },
          content: 'You got this! Only one more week to go! 💪',
          timestamp: '2 hours ago', likes: 8, isLiked: true
        }
      ],
      timestamp: '4 hours ago',
      isLiked: true
    },
    {
      id: '3',
      author: { name: 'Emma Wilson', points: 2100 },
      content:
        'New PR on deadlifts today! 🎉 The form tips from this community have been game-changing. Consistency really pays off!',
      images: [workout2Image], // ✅
      workout: { name: 'Strength Training', duration: 60, calories: 320 },
      likes: 18,
      comments: [],
      timestamp: '6 hours ago',
      isLiked: false
    },
  ]);

  // Sync user points with parent
  useEffect(() => {
    setCurrentUser(prev => ({ ...prev, points: userPoints }));
  }, [userPoints]);

  // Scroll to highlighted post
  useEffect(() => {
    if (highlightedPostId && postRefs.current[highlightedPostId]) {
      postRefs.current[highlightedPostId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightedPostId(null), 2000);
    }
  }, [highlightedPostId]);

  // ✅ إدارة أفضل لعناوين الصور التي تم إنشاؤها بـ URL.createObjectURL
  // - نحرص على إلغاء (revoke) العنوان عند إزالة الصورة أو إغلاق نافذة إنشاء المنشور.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const createdUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setNewPostImages(prev => [...prev, ...createdUrls]);
    }
  };

  const removeImage = (index: number) => {
    // Revoke URL before removing
    URL.revokeObjectURL(newPostImages[index]);
    setNewPostImages(prev => prev.filter((_, i) => i !== index));
  };

  // Revoke all object URLs when closing the dialog
  useEffect(() => {
    if (!showCreatePostDialog && newPostImages.length > 0) {
      newPostImages.forEach(url => URL.revokeObjectURL(url));
      setNewPostImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCreatePostDialog]);

  const handleCreatePost = () => {
    if (!newPostContent.trim() && newPostImages.length === 0) return;

    // Award points for creating a post FIRST
    const newPoints = currentUser.points + POINTS.POST;
    const updatedUser = { ...currentUser, points: newPoints };

    const newPost: Post = {
      id: Date.now().toString(),
      author: updatedUser,
      content: newPostContent,
      images: newPostImages.length > 0 ? newPostImages : undefined,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      isLiked: false
    };

    setPostsData([newPost, ...postsData]);
    setCurrentUser(updatedUser);
    onPointsUpdate(newPoints);

    setNewPostContent('');
    setNewPostImages([]);
    setShowCreatePostDialog(false);
  };

  const handleLikePost = (postId: string) => {
    setPostsData(postsData.map(post => {
      if (post.id === postId) {
        const isLiking = !post.isLiked;

        if (isLiking && post.author.name !== currentUser.name) {
          post.author.points = (post.author.points || 0) + POINTS.LIKE_RECEIVED;
        } else if (!isLiking && post.author.name !== currentUser.name) {
          post.author.points = (post.author.points || 0) - POINTS.LIKE_RECEIVED;
        }

        return { ...post, isLiked: isLiking, likes: isLiking ? post.likes + 1 : post.likes - 1 };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    const commentContent = newCommentContent[postId];
    if (!commentContent?.trim()) return;

    const newPoints = currentUser.points + POINTS.COMMENT;
    const updatedUser = { ...currentUser, points: newPoints };

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author: { name: updatedUser.name, avatar: updatedUser.avatar },
      content: commentContent,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };

    setPostsData(postsData.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      if (post.author.name === currentUser.name) {
        return { ...post, author: { ...post.author, points: newPoints } };
      }
      return post;
    }));

    setCurrentUser(updatedUser);
    onPointsUpdate(newPoints);
    setNewCommentContent(prev => ({ ...prev, [postId]: '' }));
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPostsData(postsData.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment =>
            comment.id === commentId
              ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
              : comment
          )
        };
      }
      return post;
    }));
  };

  const handleDeletePost = (postId: string) => {
    const postToDelete = postsData.find(post => post.id === postId);
    const commentsCount = postToDelete?.comments.filter(c => c.author.name === currentUser.name).length || 0;

    const pointsToDeduct = POINTS.POST + (commentsCount * POINTS.COMMENT);
    const newPoints = Math.max(0, currentUser.points - pointsToDeduct);
    const updatedUser = { ...currentUser, points: newPoints };

    setPostsData(postsData.filter(post => post.id !== postId));
    setDeletePostId(null);

    setCurrentUser(updatedUser);
    onPointsUpdate(newPoints);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <Trophy className="w-4 h-4 text-muted-foreground" />;
  };

  const topContributors = React.useMemo(() => {
    const contributors = [...postsData]
      .map(post => post.author)
      .reduce((acc: any[], author) => {
        const existing = acc.find(a => a.name === author.name);
        if (!existing) acc.push({ ...author });
        else existing.points = Math.max(existing.points || 0, author.points || 0);
        return acc;
      }, []);

    const userInList = contributors.find(c => c.name === currentUser.name);
    if (!userInList && currentUser.points > 0) {
      contributors.push({ ...currentUser });
    } else if (userInList) {
      userInList.points = currentUser.points;
    }

    return contributors.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5);
  }, [postsData, currentUser]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onLogout={onLogout} isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Community Hub
                </h1>
                <p className="text-sm text-muted-foreground">Connect with fitness enthusiasts worldwide</p>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Your Points</p>
                  <p className="text-2xl">{currentUser.points}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Community Feed</TabsTrigger>
              <TabsTrigger value="activity">My Activity</TabsTrigger>
              <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-accent/5">
                <CardHeader>
                  <CardTitle>Share Your Progress</CardTitle>
                  <CardDescription>Post updates, achievements, or motivation!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-muted-foreground"
                        onClick={() => setShowCreatePostDialog(true)}
                      >
                        What's on your mind?
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {postsData.map((post) => (
                <div key={post.id} ref={el => postRefs.current[post.id] = el}>
                  <Card className={`${highlightedPostId === post.id ? 'ring-2 ring-primary' : ''} transition-all`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {post.author.avatar ? (
                              <AvatarImage src={post.author.avatar} />
                            ) : (
                              <AvatarFallback>
                                {post.author.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p>{post.author.name}</p>
                              {post.author.badge && (
                                <Badge variant="secondary" className="text-xs">{post.author.badge}</Badge>
                              )}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Trophy className="w-3 h-3" />
                                <span>{post.author.points || 0} pts</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                          </div>
                        </div>
                        {post.author.name === currentUser.name && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeletePostId(post.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p>{post.content}</p>

                      {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {post.images.map((image, idx) => (
                            <ImageWithFallback
                              key={idx}
                              src={image}
                              alt="Post image"
                              className="rounded-lg w-full h-48 object-cover"
                            />
                          ))}
                        </div>
                      )}

                      {post.workout && (
                        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Workout</p>
                                <p>{post.workout.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">{post.workout.duration} min</p>
                                <p className="text-sm">{post.workout.calories} cal</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Separator />

                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                          className={post.isLiked ? 'text-primary' : ''}
                        >
                          <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {post.comments.length}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>

                      {showComments === post.id && (
                        <div className="space-y-4 pt-4 border-t">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="w-8 h-8">
                                {comment.author.avatar ? (
                                  <AvatarImage src={comment.author.avatar} />
                                ) : (
                                  <AvatarFallback className="text-xs">
                                    {comment.author.name.charAt(0)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-accent/50 rounded-lg p-3">
                                  <p className="text-sm mb-1">{comment.author.name}</p>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1 px-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-xs"
                                    onClick={() => handleLikeComment(post.id, comment.id)}
                                  >
                                    <ThumbsUp className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current text-primary' : ''}`} />
                                    {comment.likes > 0 && comment.likes}
                                  </Button>
                                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                <User className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Input
                                placeholder="Write a comment..."
                                value={newCommentContent[post.id] || ''}
                                onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddComment(post.id);
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newCommentContent[post.id]?.trim()}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                  <CardDescription>Posts and comments you've made</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {postsData.filter(p => p.author.name === currentUser.name).length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        You haven't posted anything yet. Share your fitness journey!
                      </p>
                    ) : (
                      postsData
                        .filter(p => p.author.name === currentUser.name)
                        .map(post => (
                          <Card
                            key={post.id}
                            className="cursor-pointer hover:bg-accent/50"
                            onClick={() => {
                              setActiveTab('feed');
                              setHighlightedPostId(post.id);
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm text-muted-foreground mb-1">{post.timestamp}</p>
                                  <p className="line-clamp-2">{post.content}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-4 h-4" />
                                      {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageCircle className="w-4 h-4" />
                                      {post.comments.length}
                                    </span>
                                  </div>
                                </div>
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contributors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Contributors</CardTitle>
                  <CardDescription>
                    Community members with the most points from posts, comments, and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div
                        key={contributor.name}
                        className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-primary/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(index + 1)}
                          </div>
                          <Avatar>
                            {contributor.avatar ? (
                              <AvatarImage src={contributor.avatar} />
                            ) : (
                              <AvatarFallback>
                                {contributor.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p>{contributor.name}</p>
                              {contributor.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {contributor.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">Rank #{index + 1}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            <span className="text-xl">{contributor.points || 0}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader><CardTitle>How to Earn Points</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <span>Create a post</span>
                      </div>
                      <Badge>+{POINTS.POST} pts</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <span>Add a comment</span>
                      </div>
                      <Badge>+{POINTS.COMMENT} pts</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-primary" />
                        <span>Receive a like</span>
                      </div>
                      <Badge>+{POINTS.LIKE_RECEIVED} pt</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreatePostDialog} onOpenChange={setShowCreatePostDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              Share your fitness journey, achievements, or tips with the community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Share your fitness journey, achievements, or tips..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={5}
            />

            {newPostImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {newPostImages.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img src={image} alt="" className="rounded-lg w-full h-32 object-cover" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Add Images
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreatePostDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} disabled={!newPostContent.trim() && newPostImages.length === 0}>
                  <Send className="w-4 h-4 mr-2" />
                  Post (+{POINTS.POST} pts)
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone and you will lose {POINTS.POST} points.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePostId && handleDeletePost(deletePostId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
