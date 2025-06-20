import React, { useEffect, useState } from 'react';
import { Link, RefreshCw, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import Sidebar from '../Sidebar';
import './review.css'; // Import your CSS file for styling
const AdminReviewLinks = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBusinesses = () => {
    setLoading(true);
    fetch('https://connectus.net.in/connectus-api/reviews/Review-businesses', {
      credentials: 'include', // Correct way to send session cookies
    })
      .then(async (res) => {
        const data = await res.json();

        // If not ok (403 or other), handle error
        if (!res.ok) {
          console.error(`Error fetching businesses: ${res.status} ${res.statusText}`, data);
          setBusinesses([]);
          setLoading(false);
          return;
        }

        // If response is not an array → something wrong
        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', data);
          setBusinesses([]);
          setLoading(false);
          return;
        }

        // All good → set businesses
        setBusinesses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Network or server error:', err);
        setBusinesses([]);
        setLoading(false);
      });
  };

  const generateLink = () => {
    fetch('https://connectus.net.in/connectus-api/reviews/review-link/generate-for-all', {
      method: 'POST',
      credentials: 'include', // Correct here too!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          console.error(`Error generating links: ${res.status} ${res.statusText}`, data);
          alert(`Failed to generate links: ${data.error || data.message || 'Unknown error'}`);
          return;
        }

        alert(`Links generated! Created: ${data.createdLinksCount}, Skipped: ${data.skippedLinksCount}`);
        fetchBusinesses(); // Refresh the list
      })
      .catch((err) => {
        console.error('Network or server error:', err);
        alert('Error generating links');
      });
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
<div className="dashboard-container">
  <Sidebar/>
   <div className='sm-content-wrapper'>
     <div className="dashboard-header">
    <div className="dashboard-header-content">
      <div className="dashboard-title-section">
        <Link className="dashboard-icon" size={28} />
        <h1 className="dashboard-title">Review Links Management</h1>
      </div>
      <p className="dashboard-subtitle">Generate and manage review links for all businesses</p>
    </div>
  </div>

  <div className="dashboard-content">
    {loading ? (
      <div className="loading-panel">
        <RefreshCw className="loading-spinner" size={32} />
        <p>Loading businesses...</p>
      </div>
    ) : (
      <div className="table-container">
        <div className="table-scroll">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Review Link Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.length > 0 ? (
                businesses.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div className="company-name">
                        {b.businessName}
                      </div>
                    </td>
                    <td>
                      {b.reviewLink ? (
                        <div className="status-indicator status-success">
                          <CheckCircle size={16} />
                          Link Available
                        </div>
                      ) : (
                        <div className="status-indicator status-error">
                          <AlertCircle size={16} />
                          No Link
                        </div>
                      )}
                    </td>
                    <td>
                      {b.reviewLink ? (
                        <a 
                          href={b.reviewLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="button button-outline button-sm"
                        >
                          <ExternalLink size={14} />
                          View Link
                        </a>
                      ) : (
                        <span className="text-subtle">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-panel">
                    <AlertCircle size={24} />
                    <p>No businesses found or access denied</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
   </div>
 
</div>


    // <div>
    //   <h2>Admin: Review Links for All Businesses</h2>
    //   <button onClick={generateLink}>Generate Links For All</button>
    //   <table border="1" style={{ width: '100%', marginTop: '20px' }}>
    //     <thead>
    //       <tr>
    //         <th>Business Name</th>
    //         <th>Review Link</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {businesses.length > 0 ? (
    //         businesses.map((b) => (
    //           <tr key={b._id}>
    //             <td>{b.businessName}</td>
    //             <td>
    //               {b.reviewLink ? (
    //                 <a href={b.reviewLink} target="_blank" rel="noopener noreferrer">
    //                   {b.reviewLink}
    //                 </a>
    //               ) : (
    //                 <span style={{ color: 'red' }}>No Link</span>
    //               )}
    //             </td>
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="2" style={{ textAlign: 'center', color: 'gray' }}>
    //             No businesses found or access denied.
    //           </td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>
    // </div>
  );
};

export default AdminReviewLinks;
