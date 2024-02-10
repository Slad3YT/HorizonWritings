import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from './blogService';

const Login = ({ setIsLoggedIn, redirect, setUsername }) => { // Change setUsername1 to setUsername
  const [username, setUsernameState] = useState(''); // Change setUsername to setUsernameState
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: '/' } }; // Get the location to redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await login({ username, password });
      console.log('User logged in successfully');
      setIsLoggedIn(true); // Update the authentication state
      setUsername(username); // Call setUsername prop instead of setUsername1

      if (redirect) {
        navigate(redirect);
      } else {
        navigate(from ? from.pathname : '/create'); // Redirect to the intended page after login
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Error logging in. Please try again later.');
      }
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsernameState(e.target.value)} // Change setUsername to setUsernameState
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
        <br />
        <h3>
          Don't have an account? <Link to="/register">Register here</Link>.
        </h3>
      </form>
    </div>
  );
};

export default Login;
