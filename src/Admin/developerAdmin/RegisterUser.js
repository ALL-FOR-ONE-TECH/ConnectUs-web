import React, { useState } from 'react';
import axios from 'axios';
import './register.css'; // Import your CSS file for styling
function RegisterUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const [qrCodeURL, setQrCodeURL] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setQrCodeURL('');
    setTotpSecret('');

    try {
      const res = await axios.post('https://connectus.net.in/connectus-api/adminauth/register-user', formData,{
        withCredentials: true,
      }); // Adjust your backend URL
      setMessage(res.data.message);
      setQrCodeURL(res.data.qrCodeURL);
      setTotpSecret(res.data.totpSecret);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
<div className="reg-registration-container">
  <div className="reg-registration-card">
    <div className="reg-form-header">
      <div className="reg-logo">
        <span className="reg-logo-text">JustServe</span>
      </div>
      <h2 className="reg-form-title">Create Account</h2>
      <p className="reg-form-subtitle">Join our community today</p>
    </div>

    <form onSubmit={handleSubmit} className="reg-registration-form">
      <div className="reg-form-group">
        <label className="reg-form-label">
          <span className="reg-label-icon">👤</span>
          Full Name
        </label>
        <input 
          name="name" 
          onChange={handleChange} 
          value={formData.name} 
          required 
          className="reg-form-input" 
          placeholder="Enter your full name"
        />
      </div>

      <div className="reg-form-group">
        <label className="reg-form-label">
          <span className="reg-label-icon">✉️</span>
          Email Address
        </label>
        <input 
          type="email" 
          name="email" 
          onChange={handleChange} 
          value={formData.email} 
          required 
          className="reg-form-input"
          placeholder="Enter your email address"
        />
      </div>

      <div className="reg-form-group">
        <label className="reg-form-label">
          <span className="reg-label-icon">🔒</span>
          Password
        </label>
        <input 
          type="password" 
          name="password" 
          onChange={handleChange} 
          value={formData.password} 
          required 
          className="reg-form-input"
          placeholder="Create a secure password"
        />
      </div>

      <div className="reg-form-group">
        <label className="reg-form-label">
          <span className="reg-label-icon">⚡</span>
          Role
        </label>
        <select 
          name="role" 
          onChange={handleChange} 
          value={formData.role} 
          className="reg-form-select"
        >
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit" className="reg-submit-button">
        <span className="reg-button-text">Create Account</span>
        <span className="reg-button-icon">→</span>
      </button>
    </form>

    {message && (
      <div className="reg-alert reg-success-alert">
        <span className="reg-alert-icon">✅</span>
        <span className="reg-alert-text">{message}</span>
      </div>
    )}

    {error && (
      <div className="reg-alert reg-error-alert">
        <span className="reg-alert-icon">❌</span>
        <span className="reg-alert-text">{error}</span>
      </div>
    )}

    {qrCodeURL && (
      <div className="reg-qr-section">
        <div className="reg-qr-header">
          <h4 className="reg-qr-title">Two-Factor Authentication</h4>
          <p className="reg-qr-instruction">Scan this QR Code with Google Authenticator</p>
        </div>
        
        <div className="reg-qr-container">
          <div className="reg-qr-wrapper">
            <img src={qrCodeURL} alt="TOTP QR Code" className="reg-qr-code" />
          </div>
        </div>
        
        <div className="reg-backup-secret">
          <p className="reg-secret-label">Manual Entry Code:</p>
          <div className="reg-secret-container">
            <code className="reg-secret-code">{totpSecret}</code>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

    // <div style={{ padding: '30px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
    //   <h2>Register New User</h2>
    //   <form onSubmit={handleSubmit}>
    //     <label>Name</label>
    //     <input name="name" onChange={handleChange} value={formData.name} required className="input" />

    //     <label>Email</label>
    //     <input type="email" name="email" onChange={handleChange} value={formData.email} required className="input" />

    //     <label>Password</label>
    //     <input type="password" name="password" onChange={handleChange} value={formData.password} required className="input" />

    //     <label>Role</label>
    //     <select name="role" onChange={handleChange} value={formData.role} className="input">
    //       <option value="admin">Admin</option>
    //     </select>

    //     <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>Register</button>
    //   </form>

    //   {message && <p style={{ color: 'green' }}>{message}</p>}
    //   {error && <p style={{ color: 'red' }}>{error}</p>}

    //   {qrCodeURL && (
    //     <div style={{ marginTop: '20px' }}>
    //       <h4>Scan this QR Code in Google Authenticator:</h4>
    //       <img src={qrCodeURL} alt="TOTP QR Code" style={{ width: '200px' }} />
    //       <p><strong>Backup TOTP Secret:</strong> {totpSecret}</p>
    //     </div>
    //   )}

    //   <style jsx>{`
    //     .input {
    //       display: block;
    //       width: 100%;
    //       padding: 8px;
    //       margin-bottom: 15px;
    //       border: 1px solid #ccc;
    //       border-radius: 4px;
    //     }
    //   `}</style>
    // </div>
  );
}

export default RegisterUser;
