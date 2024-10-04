import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';
import "../assets/css/LoginPage.css";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useAuth();
  const navigate = useNavigate();

  console.log(username,password);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      enqueueSnackbar('Username and password are required.', { variant: 'error' });
      return;
    }
  
    const apiUrl = 'http://localhost:8080/o/headless-admin-user/v1.0/user-accounts';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
  
      // Login successful, update the context and localStorage
      login(username, password);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
  
      enqueueSnackbar('Login successful!', { variant: 'success' });
//      window.location.href = '/MyList';
        navigate('/MyList');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button class="login-submit" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
