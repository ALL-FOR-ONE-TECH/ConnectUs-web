import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, User, Mail, MessageSquare } from 'lucide-react';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import './buinessrev.css';
const BusinessReviews = () => {
  const { code } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    // Fetch business info from review link
    fetch(`https://connectus.net.in/connectus-api/reviews/review-link/${code}/business`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setBusiness(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Something went wrong.');
        setLoading(false);
      });
  }, [code]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`https://connectus.net.in/connectus-api/reviews/review-link/${code}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerName,
        reviewerEmail,
        rating,
        reviewText
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert('Error: ' + data.error);
        } else {
          alert('Review added successfully!');
          // Clear form
          setReviewerName('');
          setReviewerEmail('');
          setRating(5);
          setReviewText('');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Something went wrong.');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <>
    <Navbar/>
     <div className="feedback-form-container">
  <div className="feedback-form">
    <div className="company-header">
      <h1>Leave a Review</h1>
      <div className="company-info">
        <h2>{business.businessName}</h2>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="feedback-form-content">
      <div className="input-group">
        <label htmlFor="reviewerName" className="input-label">
          <User size={18} />
          Your Name
        </label>
        <input
          type="text"
          id="reviewerName"
          className="input-field"
          placeholder="Enter your full name"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="reviewerEmail" className="input-label">
          <Mail size={18} />
          Email Address
        </label>
        <input
          type="email"
          id="reviewerEmail"
          className="input-field"
          placeholder="your.email@example.com"
          value={reviewerEmail}
          onChange={(e) => setReviewerEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label className="input-label">
          <Star size={18} />
          Your Rating
        </label>
        <div className="rating-container">
          <div className="stars-wrapper">
            <select className="star" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? 's' : ''}
                </option>
              ))}
            </select>   
            <Star size={24} />
          </div>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="reviewText" className="input-label">
          <MessageSquare size={18} />
          Your Review
        </label>
        <textarea
          id="reviewText"
          className="input-textarea"
          placeholder="Share your experience with others..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          required
        />
      </div>

      <button 
        type="submit" 
        className=" button-submit "
        
      >
        submit Review
      </button>
    </form>
  </div>
</div>

    <Footer/>
    </>

    // <div>
    //   <h2>Leave a Review for {business.businessName}</h2>

    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       placeholder="Your name"
    //       value={reviewerName}
    //       onChange={(e) => setReviewerName(e.target.value)}
    //       required
    //     />
    //     <input
    //       type="email"
    //       placeholder="Your email"
    //       value={reviewerEmail}
    //       onChange={(e) => setReviewerEmail(e.target.value)}
    //     />
    //     <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
    //       {[1, 2, 3, 4, 5].map((r) => (
    //         <option key={r} value={r}>
    //           {r} Star{r > 1 ? 's' : ''}
    //         </option>
    //       ))}
    //     </select>
    //     <textarea
    //       placeholder="Your review"
    //       value={reviewText}
    //       onChange={(e) => setReviewText(e.target.value)}
    //       required
    //     />
    //     <button type="submit">Submit Review</button>
    //   </form>
    // </div>
  );
};


export default BusinessReviews;
