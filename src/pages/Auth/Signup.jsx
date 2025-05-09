import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    storeName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [error, setError] = useState('');

  const validateForm = () => {
    const { fullName, storeName, username, email, phoneNumber, password } = formData;
    if (!fullName || !storeName || !username || !email || !phoneNumber || !password) {
      return 'All fields are required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return 'Phone number must be exactly 10 digits';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create Account</h2>
        <p className="text-center text-red-500 text-sm mb-4">All fields are required</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input" />
          <input name="storeName" placeholder="Store Name" value={formData.storeName} onChange={handleChange} className="input" />
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="input" />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" />
          <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="input" />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input" />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigate('/auth/login')} className="text-purple-600 hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
