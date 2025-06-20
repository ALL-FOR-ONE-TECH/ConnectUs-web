
import React from 'react';
import '../HomeDisplay/Home.css'; // Assuming you have a CSS file for styling
export default function Footer() {
    return(
        <div className="app">
                 <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>JustServe</h3>
              <p>Connecting you with trusted local service providers in your area.</p>
            </div>
            {/* <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#help">Help Center</a></li>
              </ul>
            </div> */}
            <div className="footer-section">
              <h4>Categories</h4>
              <ul>
                <li><a href="#restaurants">Restaurants</a></li>
                <li><a href="#home">Home Services</a></li>
                <li><a href="#auto">Auto Services</a></li>
                <li><a href="#health">Health & Medical</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#feedback">Feedback</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 JustServe. All rights reserved.</p>
          </div>
        </div>
      </footer>
</div>


    )
}