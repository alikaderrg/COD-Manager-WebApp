import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      toast({ title: '✅ Logged in!', description: 'Welcome back!' });
      navigate('/');
    } catch (error) {
      toast({ title: '❌ Login failed', description: error.response?.data?.error || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Login to Your Account</h2>

      <Input placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="mb-2" />
      <Input placeholder="Password" type="password" name="password" value={formData.password} onChange={handleChange} className="mb-4" />

      <Button className="w-full" onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </div>
  );
}
