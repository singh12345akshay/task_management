import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { taskAPI } from '../services/api';
import { ArrowLeft, AlertCircle } from 'lucide-react';

function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getTasks(1, 1000);
      const task = response.data.tasks.find((t) => t._id === id);
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || '',
          status: task.status,
        });
      }
    } catch (error) {
      console.error('Failed to fetch task:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await taskAPI.updateTask(id, formData);
      } else {
        await taskAPI.createTask(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-900">
      <header className="border-b bg-white/90 dark:bg-slate-900/90 dark:border-purple-500/20 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-blue-200/50 dark:shadow-purple-500/10 border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-xl shadow-blue-300/50 border-0 bg-white/90 backdrop-blur-sm dark:bg-slate-800/50 dark:border-purple-500/20 border-blue-100">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              {isEdit ? 'Edit Task Details' : 'Task Information'}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? 'Update your task information below'
                : 'Fill in the details to create a new task'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  autoFocus
                  value={formData.title}
                  onChange={handleChange}
                  className="h-11"
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description (optional)"
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11"
                >
                  {loading
                    ? isEdit
                      ? 'Updating...'
                      : 'Creating...'
                    : isEdit
                    ? 'Update Task'
                    : 'Create Task'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default TaskForm;
