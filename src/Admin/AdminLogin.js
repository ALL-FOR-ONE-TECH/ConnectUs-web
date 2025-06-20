import React, { useState } from 'react';
import axios from 'axios';
import { Shield } from 'lucide-react';
import './adminlog.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';
const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    totp: '',
  });
  const navigate = useNavigate;
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
 const [isLoading, setIsLoading] = useState(false);//frontend
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    navigate('/adm-ConnectUs/admin-home')
    e.preventDefault();
    setMessage('');
    setSuccess(false);
    setIsLoading(false); // frontend
    try {
      const res = await axios.post('https://connectus.net.in/connectus-api/adminauth/admin-login', formData, {
        withCredentials: true,
      });

      setMessage(res.data.message);
      setSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (


<div className="al-admin-login-container">
  <div className="al-admin-login-wrapper">
    <div className="al-admin-login-form">
      <div className="al-form-header">
        <div className="al-logo-container">
          <Shield className="al-logo-icon" size={32} />
        </div>
        <h2 className="al-form-title">Admin Login</h2>
        <p className="al-form-subtitle">Secure access to your dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="al-login-form">
        <div className="al-input-group">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="al-form-input"
            autoComplete="email"
          />
        </div>

        <div className="al-input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="al-form-input"
            autoComplete="current-password"
          />
        </div>

        <div className="al-input-group">
          <input
            type="text"
            name="totp"
            placeholder="TOTP (Google Authenticator Code)"
            value={formData.totp}
            onChange={handleChange}
            required
            className="al-form-input"
            maxLength={6}
            pattern="[0-9]{6}"
          />
        </div>

        <button 
          type="submit" 
          className={`al-submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <div className={`al-message ${success ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>

    </div>
  </div>
</div>
    // <div style={styles.container}>
    //   <form onSubmit={handleSubmit} style={styles.form}>
    //     <h2>Admin Login</h2>
    //     <input
    //       type="email"
    //       name="email"
    //       placeholder="Admin Email"
    //       value={formData.email}
    //       onChange={handleChange}
    //       required
    //       style={styles.input}
    //     />
    //     <input
    //       type="password"
    //       name="password"
    //       placeholder="Password"
    //       value={formData.password}
    //       onChange={handleChange}
    //       required
    //       style={styles.input}
    //     />
    //     <input
    //       type="text"
    //       name="totp"
    //       placeholder="TOTP (Google Authenticator Code)"
    //       value={formData.totp}
    //       onChange={handleChange}
    //       required
    //       style={styles.input}
    //     />
    //     <button type="submit" style={styles.button}>Login</button>
    //     <p style={{ color: success ? 'green' : 'red' }}>{message}</p>
    //   </form>
    // </div>
  );
};



export default AdminLogin;