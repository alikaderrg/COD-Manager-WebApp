import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        formData
      );
      localStorage.setItem('auth_token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url('/images/auth-background.jpg')` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 rounded-xl p-6 shadow-xl border-2 border-transparent animate-gradient-border"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Log In</h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-3 border rounded-md outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded-md outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-2 rounded-md shadow-lg transition duration-300"
        >
          Log In
        </button>

        <div className="flex justify-center mt-4 space-x-4">
          <a
            href="#"
            title="Google"
            className="w-10 h-10 bg-white border rounded shadow hover:scale-105 transition flex items-center justify-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
              alt="Google"
              className="w-5 h-5"
            />

          </a>
          <a
            href="#"
            title="Facebook"
            className="w-10 h-10 bg-white border rounded shadow hover:scale-105 transition flex items-center justify-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              className="w-5 h-5"
            />
          </a>
        </div>

        <p className="text-center mt-4 text-sm text-gray-700">
          Don’t have an account?{' '}
          <span
            className="text-purple-600 hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
