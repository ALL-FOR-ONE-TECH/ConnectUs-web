// src/pages/AllComplaints.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, RefreshCw, Mail, Phone, User, Calendar } from 'lucide-react';
import Sidebar from '../Sidebar';
import './review.css'

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('https://connectus.net.in/connectus-api/complaints/complaints',{ withCredentials: true }); // adjust base URL if needed
      setComplaints(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch complaints');
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
        <AlertTriangle className="dashboard-icon" size={28} />
        <h1 className="dashboard-title">Complaints Management</h1>
      </div>
      <p className="dashboard-subtitle">View and manage all submitted complaints</p>
    </div>
  </div>

  <div className="dashboard-content">
    {loading && (
      <div className="loading-panel">
        <RefreshCw className="loading-spinner" size={32} />
        <p>Loading complaints...</p>
      </div>
    )}

    {error && (
      <div className="error-panel">
        <AlertTriangle size={24} />
        <p>{error}</p>
        <button className="button button-primary" onClick={fetchComplaints}>
          Try Again
        </button>
      </div>
    )}

    {!loading && complaints.length === 0 && (
      <div className="empty-panel">
        <AlertTriangle size={48} />
        <h3>No Complaints Found</h3>
        <p>There are currently no complaints to display.</p>
      </div>
    )}

    {!loading && complaints.length > 0 && (
      <div className="table-container">
        <div className="metrics-bar">
          <div className="metric-item">
            <span className="metric-number">{complaints.length}</span>
            <span className="metric-label">Total Complaints</span>
          </div>
        </div>
        
        <div className="table-scroll">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>
                  <User size={16} />
                  Client Details
                </th>
                <th>
                  <AlertTriangle size={16} />
                  Issue Description
                </th>
                <th>
                  <Calendar size={16} />
                  Date Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>
                    <div className="client-details">
                      <div className="client-name">{complaint.name}</div>
                      <div className="client-contact">
                        <div className="contact-detail">
                          <Phone size={14} />
                          {complaint.mobile}
                        </div>
                        <div className="contact-detail">
                          <Mail size={14} />
                          {complaint.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="issue-description">
                      {complaint.problemDescription}
                    </div>
                  </td>
                  <td>
                    <div className="date-detail">
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      <div className="time-detail">
                        {new Date(complaint.createdAt).toLocaleTimeString('en-US', {
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

    // <div className="container mx-auto p-6">
    //   <h2 className="text-2xl font-bold mb-4">All Submitted Complaints</h2>

    //   {loading && <p>Loading complaints...</p>}
    //   {error && <p className="text-red-600">{error}</p>}

    //   {!loading && complaints.length === 0 && <p>No complaints found.</p>}

    //   {!loading && complaints.length > 0 && (
    //     <div className="overflow-x-auto">
    //       <table className="table-auto w-full border border-gray-300">
    //         <thead className="bg-gray-100">
    //           <tr>
    //             <th className="border px-4 py-2">Name</th>
    //             <th className="border px-4 py-2">Mobile</th>
    //             <th className="border px-4 py-2">Email</th>
    //             <th className="border px-4 py-2">Problem</th>
    //             <th className="border px-4 py-2">Date</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {complaints.map((complaint) => (
    //             <tr key={complaint._id}>
    //               <td className="border px-4 py-2">{complaint.name}</td>
    //               <td className="border px-4 py-2">{complaint.mobile}</td>
    //               <td className="border px-4 py-2">{complaint.email}</td>
    //               <td className="border px-4 py-2">{complaint.problemDescription}</td>
    //               <td className="border px-4 py-2">
    //                 {new Date(complaint.createdAt).toLocaleString()}
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

export default AllComplaints;
