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
    setError('');

    const { fullName, storeName, username, email, phoneNumber, password } = formData;

    // Client-side validation
    if (!fullName || !storeName || !username || !email || !phoneNumber || !password) {
      setError("All fields are required");
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Phone number must be exactly 10 digits and start with 0");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Create Account</h2>
        <p className="text-sm text-red-500 text-center mb-4">All fields are required</p>
        {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-blue-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="storeName"
            placeholder="Store Name"
            value={formData.storeName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-blue-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-blue-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-blue-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-blue-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <span
            className="text-purple-600 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
