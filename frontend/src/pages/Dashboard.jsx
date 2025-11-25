import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { useAuth } from '../context/AuthContext';
import { useThemeToggle } from '../context/ThemeContext';
import { taskAPI } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { Plus, Edit, Trash2, LogOut, Moon, Sun, Calendar, CheckCircle2, Clock, Search, X, ChevronDown, ChevronUp } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useThemeToggle();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, taskId: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchTasks();
  }, [page, debouncedSearchQuery]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks(page, 10, debouncedSearchQuery);
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
      setTotalTasks(response.data.totalTasks || 0);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPage(1);
  };

  const toggleDescription = (taskId) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleDelete = async () => {
    try {
      await taskAPI.deleteTask(deleteDialog.taskId);
      setDeleteDialog({ open: false, taskId: null });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-900">
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-blue-200/50 dark:bg-slate-900/90 dark:border-purple-500/20 dark:shadow-purple-500/10 border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 via-pink-500 to-orange-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              Task Management
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground text-yellow-500 dark:text-yellow-400" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
                <Moon className="h-4 w-4 text-muted-foreground text-blue-500 dark:text-purple-400" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800 dark:text-purple-200">{user?.name}</p>
                  <p className="text-xs text-muted-foreground text-blue-600/70 dark:text-purple-300/60 capitalize font-medium">{user?.role}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm">My Tasks</h2>
          <p className="text-muted-foreground text-blue-700/70 dark:text-purple-300/70">Manage and track your tasks efficiently</p>
          </div>
          <Button
            onClick={() => navigate('/task/new')}
            className="gap-2 shadow-lg shadow-blue-300/50 hover:shadow-blue-400/60 dark:shadow-purple-500/20 dark:hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add Task
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground text-blue-500" />
            <Input
              type="text"
              placeholder="Search tasks by title..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10 h-11 border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-purple-500/30 dark:focus:border-purple-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-blue-100 dark:hover:bg-purple-500/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {debouncedSearchQuery && (
            <p className="mt-2 text-sm text-muted-foreground text-blue-600/70 dark:text-purple-300/70">
              {searchQuery !== debouncedSearchQuery ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></span>
                  Searching...
                </span>
              ) : (
                `Found tasks matching "${debouncedSearchQuery}"`
              )}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-transparent dark:border-purple-400"></div>
          </div>
        ) : tasks.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:border-purple-500/30 dark:bg-slate-800/50 shadow-lg">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                {debouncedSearchQuery ? (
                  <>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 dark:bg-orange-500/20 flex items-center justify-center shadow-md">
                      <Search className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-purple-200 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">No tasks found</h3>
                      <p className="text-muted-foreground text-blue-700/70 dark:text-purple-300/70 mb-4">
                        No tasks match "{debouncedSearchQuery}"
                      </p>
                      <Button onClick={clearSearch} variant="outline" className="border-blue-300 hover:bg-blue-50">
                        Clear Search
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:bg-purple-500/20 flex items-center justify-center shadow-md">
                      <Plus className="h-8 w-8 text-blue-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-purple-200 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">No tasks yet</h3>
                      <p className="text-muted-foreground text-blue-700/70 dark:text-purple-300/70 mb-4">
                        Get started by creating your first task
                      </p>
                      <Button onClick={() => navigate('/task/new')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-300/50 dark:bg-purple-600 dark:hover:bg-purple-700">
                        Create Task
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-2 mb-4">
              {tasks.map((task) => (
                <Card
                  key={task._id}
                  className="hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-purple-500/20 transition-all duration-200 border-l-4 border-l-primary dark:bg-slate-800/50 dark:border-purple-500/30 bg-white/80 backdrop-blur-sm border-t border-blue-100"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5 flex-shrink-0">
                          {task.status === 'Completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base font-semibold text-gray-800 dark:text-purple-100 truncate">
                              {task.title}
                            </CardTitle>
                            <Badge
                              variant={task.status === 'Completed' ? 'default' : 'secondary'}
                              className={`text-xs h-5 px-1.5 flex-shrink-0 ${task.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-orange-100 text-orange-700 border-orange-300'} dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30`}
                            >
                              {task.status}
                            </Badge>
                          </div>
                          {task.description && (
                            <div className="mb-1">
                              <p className={`text-sm text-muted-foreground text-gray-600 dark:text-purple-200/70 ${expandedDescriptions.has(task._id) ? '' : 'line-clamp-1'}`}>
                                {task.description}
                              </p>
                              {task.description.length > 60 && (
                                <button
                                  onClick={() => toggleDescription(task._id)}
                                  className="text-xs text-blue-600 dark:text-purple-400 hover:underline mt-1 flex items-center gap-1"
                                >
                                  {expandedDescriptions.has(task._id) ? (
                                    <>
                                      <ChevronUp className="h-3 w-3" />
                                      Show less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3" />
                                      Show more
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground text-blue-600/70 dark:text-purple-300/60">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-blue-500 dark:text-purple-400" />
                              <span>{formatDate(task.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/task/edit/${task._id}`)}
                          className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-purple-500/20 dark:text-purple-300 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        {user?.role === 'admin' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDeleteDialog({ open: true, taskId: task._id })
                            }
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-red-100 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 pt-6 border-t border-blue-100 dark:border-purple-500/20">
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-purple-500/30 dark:hover:bg-purple-500/20 dark:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground text-gray-600 dark:text-purple-300/70">Page</span>
                    <Input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={page}
                      onChange={(e) => {
                        const newPage = parseInt(e.target.value);
                        if (newPage >= 1 && newPage <= totalPages) {
                          setPage(newPage);
                        }
                      }}
                      className="w-16 h-9 text-center border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-purple-500/30 dark:focus:border-purple-500"
                    />
                    <span className="text-sm text-muted-foreground text-gray-600 dark:text-purple-300/70">of {totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-purple-500/30 dark:hover:bg-purple-500/20 dark:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, taskId: deleteDialog.taskId })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Dashboard;
