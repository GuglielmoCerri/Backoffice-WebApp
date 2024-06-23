import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css'; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authenticated, setauthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || false)
  );

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://127.0.0.1:5000/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Token verification successful:", response.data);
      } catch (error) {
        console.error("Token verification failed:", error.response.data);
      }
    }
  };
  
  const refreshToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/refresh', {
          refresh_token: token
        });
        const newAccessToken = response.data.access_token;
        console.log("Token refresh successful");
        localStorage.setItem('token', newAccessToken);
      } catch (error) {
        console.error("Token refresh failed:", error.response.data);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {username, password});
      const { access_token } = response.data;
      // 7 days if 'Remember Me' is True, otherwise 30 minutes
      const tokenExpiration = rememberMe ? Date.now() + (1000 * 60 * 60 * 24 * 7) : Date.now() + (1000 * 60 * 30); 
      localStorage.setItem('token', access_token);
      localStorage.setItem('tokenExpiration', tokenExpiration);
      localStorage.setItem("authenticated", true);
      navigate("/analytics");
      verifyToken();
      refreshToken();
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/register', {username, password});
      alert('Registration successful!');
      setIsRegistering(false);
    } catch (error) {
      alert('Registration failed' + error);
    }
  };

  return (
    <div className="login-box">
      <h2 className="text-xl mb-5 text-gray-800">{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <div className="textbox">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="textbox password-container">
          <label htmlFor="password" >Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="show-password-button"
          >
            <FontAwesomeIcon 
              icon={showPassword ? faEyeSlash : faEye} 
              className="password-icon"
            />
          </button>
        </div>
        <div className="checkbox">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <button type="submit" className="btn">{isRegistering ? 'Register' : 'Sign in'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)} className="btn-switch">
        {isRegistering ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </div>
  );
};

export default Login;
