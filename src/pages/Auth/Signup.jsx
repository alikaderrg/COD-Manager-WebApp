import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${baseURL}/api/auth/signup`, { email, password });
      localStorage.setItem('auth_token', res.data.token);
      toast({ title: '✅ Account created!' });
      navigate('/');
    } catch (err) {
      toast({ title: '❌ Signup failed', description: err.response?.data?.error || 'Try again' });
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input className="mt-4" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button className="mt-4 w-full" onClick={handleSignup}>Sign Up</Button>
    </div>
  );
}
