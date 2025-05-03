import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    fullName: '',
    storeName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/signup', form);
      navigate('/auth/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f9f9f9'
    }}>
      <form onSubmit={handleSubmit} style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center' }}>Sign Up</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {['fullName', 'storeName', 'username', 'email', 'phoneNumber', 'password'].map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={form[field]}
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
        ))}

        <button type="submit" style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Sign Up
        </button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account?{' '}
          <a href="/auth/login" style={{ color: '#007bff' }}>
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
