import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { AlertCircle } from 'lucide-react';

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await authAPI.signup(formData);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-indigo-950 p-4">
      <Card className="w-full max-w-md shadow-2xl shadow-blue-300/50 border-0 bg-white/90 backdrop-blur-sm dark:bg-slate-800/80 dark:border-purple-500/20 dark:shadow-purple-500/10 border-blue-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Sign up to start managing your tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoFocus
                value={formData.name}
                onChange={handleChange}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="h-11"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="admin"
                checked={formData.role === 'admin'}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    role: checked ? 'admin' : 'user',
                  })
                }
              />
              <Label
                htmlFor="admin"
                className="text-sm font-normal cursor-pointer"
              >
                Sign up as Admin
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <div className="text-center text-sm">
              <Link
                to="/signin"
                className="text-primary hover:underline font-medium"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
