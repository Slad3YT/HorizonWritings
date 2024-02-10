import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from './blogService'; // Make sure to import the register function correctly

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if full name, username (email), password, and confirm password are not empty
    if (!fullName || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Check if password meets requirements
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }
    try {
      // Call the register function from the API
      await register({ fullName, username, password });
      alert(` ${fullName} registered successfully!`);
      console.log('User registered successfully');
      navigate('/login');
    } catch (error) {
      setError('Error registering user. Please try again.');
    }
  };
  

  return (
    <div className="register-container">
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit} className='Register'>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="email"
            name="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
        <br />
        <h3>Already have an account? <Link to="/login">Login here</Link>.</h3>
      </form>
    </div>
  );
};

export default Register;

