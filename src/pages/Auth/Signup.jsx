import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SignupForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    storeName: '',
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, formData);
      toast({ title: '✅ Account created!', description: 'You can now login.' });
      navigate('/login');
    } catch (error) {
      toast({ title: '❌ Signup failed', description: error.response?.data?.error || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>

      <Input placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} className="mb-2" />
      <Input placeholder="Store Name" name="storeName" value={formData.storeName} onChange={handleChange} className="mb-2" />
      <Input placeholder="Username" name="username" value={formData.username} onChange={handleChange} className="mb-2" />
      <Input placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="mb-2" />
      <Input placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} className="mb-2" />
      <Input placeholder="Password" type="password" name="password" value={formData.password} onChange={handleChange} className="mb-4" />

      <Button className="w-full" onClick={handleSignup} disabled={loading}>
        {loading ? 'Creating...' : 'Sign Up'}
      </Button>
    </div>
  );
}
<Link to="/auth/login">Log in</Link>
