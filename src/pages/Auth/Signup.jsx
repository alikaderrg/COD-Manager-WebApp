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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, formData);
      localStorage.setItem('auth_token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
        <p className="text-sm text-red-500 text-center mb-2">All fields are required</p>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {['fullName', 'storeName', 'username', 'email', 'phoneNumber', 'password'].map((field, idx) => (
            <input
              key={idx}
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              placeholder={
                field === 'phoneNumber'
                  ? 'Phone Number (e.g., 0556385528)'
                  : field[0].toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
              }
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-blue-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            className="text-purple-600 hover:underline"
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
