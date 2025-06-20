import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import './complaint.css'; // Import your CSS file for styling
const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    problemDescription: ''
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  // Check cooldown on component load
  useEffect(() => {
    const lastSubmit = localStorage.getItem('complaintLastSubmit');
    if (lastSubmit) {
      const diff = Date.now() - parseInt(lastSubmit, 10);
      if (diff < 24 * 60 * 60 * 1000) {
        setIsCooldown(true);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      await axios.post('https://connectus.net.in/connectus-api/complaints/complaints', formData);
      setMessage('✅ Complaint submitted successfully!');
      setFormData({ name: '', mobile: '', email: '', problemDescription: '' });

      // Save timestamp in localStorage
      localStorage.setItem('complaintLastSubmit', Date.now().toString());
      setIsCooldown(true);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setMessage('❌ You can only submit one complaint every 24 hours.');
      } else {
        setMessage('❌ Error submitting complaint. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar/>
            <div className="complaint-form-container">
      <div className="complaint-form-wrapper">
        <div className="form-header">
          <div className="header-icon">
            <AlertCircle size={32} />
          </div>
          <h2 className="form-title">Submit a Complaint / Enquiry</h2>
          <p className="form-subtitle">We're here to help resolve your concerns quickly and efficiently</p>
        </div>

        {isCooldown ? (
          <div className="cooldown-message">
            <div className="cooldown-icon">
              <Clock size={48} />
            </div>
            <h3>Submission Received</h3>
            <p>You have already submitted a complaint. Please try again after 24 hours.</p>
            <div className="cooldown-timer">
              <span>Next submission available in: 23:59:45</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile" className="form-label">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="problemDescription" className="form-label">Problem Description</label>
              <textarea
                id="problemDescription"
                name="problemDescription"
                placeholder="Please describe your problem or enquiry in detail..."
                value={formData.problemDescription}
                onChange={handleChange}
                required
                rows={6}
                className="form-textarea"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>

            {message && (
              <div className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>
                <div className="message-icon">
                  {message.startsWith('✅') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </div>
                <span>{message}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
    <Footer/>
    </>


    // <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
    //   <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Submit a Complaint / Enquiry</h2>

    //   {isCooldown ? (
    //     <p style={{ color: 'red', fontWeight: 'bold' }}>
    //       ❌ You have already submitted a complaint. Please try again after 24 hours.
    //     </p>
    //   ) : (
    //     <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
    //       <input
    //         type="text"
    //         name="name"
    //         placeholder="Your Name"
    //         value={formData.name}
    //         onChange={handleChange}
    //         required
    //         style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
    //       />
    //       <input
    //         type="text"
    //         name="mobile"
    //         placeholder="Mobile Number"
    //         value={formData.mobile}
    //         onChange={handleChange}
    //         required
    //         style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
    //       />
    //       <input
    //         type="email"
    //         name="email"
    //         placeholder="Email ID"
    //         value={formData.email}
    //         onChange={handleChange}
    //         required
    //         style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
    //       />
    //       <textarea
    //         name="problemDescription"
    //         placeholder="Describe your problem..."
    //         value={formData.problemDescription}
    //         onChange={handleChange}
    //         required
    //         rows={5}
    //         style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
    //       ></textarea>
    //       <button
    //         type="submit"
    //         disabled={isSubmitting}
    //         style={{
    //           backgroundColor: isSubmitting ? '#95a5a6' : '#3498db',
    //           color: 'white',
    //           padding: '10px 20px',
    //           borderRadius: '6px',
    //           border: 'none',
    //           cursor: isSubmitting ? 'not-allowed' : 'pointer'
    //         }}
    //       >
    //         {isSubmitting ? 'Submitting...' : 'Submit'}
    //       </button>
    //       {message && (
    //         <p style={{ marginTop: '1rem', fontWeight: 'bold', color: message.startsWith('✅') ? 'green' : 'red' }}>
    //           {message}
    //         </p>
    //       )}
    //     </form>
    //   )}
    // </div>
  );
};

export default ComplaintForm;
