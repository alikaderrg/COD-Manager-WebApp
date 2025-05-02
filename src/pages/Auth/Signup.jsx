import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Signup() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${baseURL}/api/auth/signup`, { email, password, name });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast({ title: '✅ Signup successful', description: `Welcome, ${user.email}` });
    } catch (err) {
      toast({ title: '❌ Signup failed', description: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className="max-w-md space-y-4 p-6">
      <h2 className="text-2xl font-bold">Create Account</h2>
      <Input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleSignup}>Sign Up</Button>
    </div>
  );
}
