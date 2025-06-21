// src/pages/AllReviews.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, RefreshCw, Mail, User, Calendar, Building } from 'lucide-react';
import Sidebar from '../Sidebar';
import './review.css'
const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('https://connectus.net.in/connectus-api/reviews/Review-businesses',{withCredentials: true}); // Adjust base URL if needed
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reviews');
      setLoading(false);
    }
  };

  return (

<div className="dashboard-container">
  <Sidebar/>
  <div className='sm-content-wrapper'>
      <div className="dashboard-header">
    <div className="dashboard-header-content">
      <div className="dashboard-title-section">
        <Star className="dashboard-icon" size={28} />
        <h1 className="dashboard-title">Reviews Management</h1>
      </div>
      <p className="dashboard-subtitle">View and manage all submitted reviews</p>
    </div>
  </div>

  <div className="dashboard-content">
    {loading && (
      <div className="loading-panel">
        <RefreshCw className="loading-spinner" size={32} />
        <p>Loading reviews...</p>
      </div>
    )}

    {error && (
      <div className="error-panel">
        <Star size={24} />
        <p>{error}</p>
        <button className="button button-primary" onClick={fetchReviews}>
          Try Again
        </button>
      </div>
    )}

    {!loading && !error && reviews.length === 0 && (
      <div className="empty-panel">
        <Star size={48} />
        <h3>No Reviews Found</h3>
        <p>There are currently no reviews to display.</p>
      </div>
    )}

    {!loading && !error && reviews.length > 0 && (
      <div className="table-container">
        <div className="metrics-bar">
          <div className="metric-item">
            <span className="metric-number">{reviews.length}</span>
            <span className="metric-label">Total Reviews</span>
          </div>
        </div>
        
        <div className="table-scroll">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>
                  <Building size={16} />
                  Company
                </th>
                <th>
                  <User size={16} />
                  Reviewer
                </th>
                <th>
                  <Star size={16} />
                  Rating & Feedback
                </th>
                <th>
                  <Calendar size={16} />
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>
                    <div className="company-info">
                      <div className="company-name">{review.businessName}</div>
                    </div>
                  </td>
                  <td>
                    <div className="reviewer-details">
                      <div className="reviewer-name">{review.reviewerName}</div>
                      <div className="reviewer-contact">
                        <Mail size={14} />
                        {review.reviewerEmail}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="feedback-content">
                      <div className="rating-stars">
                        <span className="rating-value">({review.rating})</span>
                      </div>
                      <div className="feedback-text">
                        {review.reviewText}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="date-detail">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      <div className="time-detail">
                        {new Date(review.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
  </div>

</div>


    // <div className="container mx-auto px-4 py-6">
    //   <h2 className="text-2xl font-bold mb-4">All Submitted Reviews</h2>

    //   {loading && <p>Loading reviews...</p>}
    //   {error && <p className="text-red-600">{error}</p>}

    //   {!loading && !error && reviews.length === 0 && (
    //     <p>No reviews found.</p>
    //   )}

    //   {!loading && !error && reviews.length > 0 && (
    //     <div className="overflow-x-auto">
    //       <table className="table-auto w-full border-collapse border border-gray-300">
    //         <thead>
    //           <tr className="bg-gray-100">
    //             <th className="border px-4 py-2">Business Name</th>
    //             <th className="border px-4 py-2">Reviewer Name</th>
    //             <th className="border px-4 py-2">Email</th>
    //             <th className="border px-4 py-2">Rating</th>
    //             <th className="border px-4 py-2">Review</th>
    //             <th className="border px-4 py-2">Date</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {reviews.map((review) => (
    //             <tr key={review.reviewId}>
    //               <td className="border px-4 py-2">{review.businessName}</td>
    //               <td className="border px-4 py-2">{review.reviewerName}</td>
    //               <td className="border px-4 py-2">{review.reviewerEmail}</td>
    //               <td className="border px-4 py-2">{review.rating}</td>
    //               <td className="border px-4 py-2">{review.reviewText}</td>
    //               <td className="border px-4 py-2">
    //                 {new Date(review.createdAt).toLocaleDateString()}
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   )}
    // </div>

  );
};

export default AllReviews;
