import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <form onSubmit={handleSubmit} style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center' }}>Log In</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button type="submit" style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Log In
        </button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account?{' '}
          <a href="/auth/signup" style={{ color: '#007bff' }}>
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
