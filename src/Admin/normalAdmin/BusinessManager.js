import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Mail, Phone, MapPin, Image, Plus, Edit, Trash2, X } from 'lucide-react';
import Sidebar from '../Sidebar';
import './buisness.css'; // Import your CSS file for styles
const BusinessManager = () => {
  const [businesses, setBusinesses] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [form, setForm] = useState({
    businessName: '',
    address: '',
    contactEmail: '',
    contactNumber: '',
    mapUrl: '',
    serviceType: '',
    images: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [showTotpModal, setShowTotpModal] = useState(false);
  const [totp, setTotp] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get('https://connectus.net.in/connectus-api/adminbusiness/businesses', {
        withCredentials: true,
      });
      setBusinesses(res.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setMessage('Error fetching businesses: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const res = await axios.get('https://connectus.net.in/connectus-api/adminservice/service-types', {
        withCredentials: true,
      });
      setServiceTypes(res.data);
    } catch (error) {
      console.error('Error fetching service types:', error);
      setMessage('Error fetching service types: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchBusinesses();
    fetchServiceTypes();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setForm(prev => ({ ...prev, images: e.target.files }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!form.businessName.trim()) errors.push('Business Name is required');
    if (!form.address.trim()) errors.push('Address is required');
    if (!form.contactEmail.trim()) errors.push('Contact Email is required');
    if (!form.contactNumber.trim()) errors.push('Contact Number is required');
    if (!form.serviceType) errors.push('Service Type is required');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.contactEmail && !emailRegex.test(form.contactEmail)) {
      errors.push('Invalid email format');
    }
    
    return errors;
  };

  const handleAddOrUpdate = async () => {
    // Validate form first
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setMessage('Validation errors: ' + validationErrors.join(', '));
      return;
    }

    setLoading(true);
    setMessage(''); // Clear previous messages

    const formData = new FormData();
    
    // Add all form fields with trimmed values
    formData.append('businessName', form.businessName.trim());
    formData.append('address', form.address.trim());
    formData.append('contactEmail', form.contactEmail.trim());
    formData.append('contactNumber', form.contactNumber.trim());
    formData.append('mapUrl', form.mapUrl.trim());
    formData.append('serviceTypes', JSON.stringify([form.serviceType]));

    // Add images if any
    if (form.images && form.images.length > 0) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append('images', form.images[i]);
      }
    }

    // Debug: Log what we're sending
    console.log('=== DEBUG: Form submission ===');
    console.log('Form state:', form);
    console.log('Service Type ID:', form.serviceType);
    console.log('Available Service Types:', serviceTypes);
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log('=== END DEBUG ===');

    try {
      let response;
      if (editingId) {
        console.log('Updating business with ID:', editingId);
        response = await axios.put(
          `https://connectus.net.in/connectus-api/adminbusiness/businesses/${editingId}`,
          formData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setMessage('Business updated successfully');
      } else {
        console.log('Creating new business');
        response = await axios.post(
          'https://connectus.net.in/connectus-api/adminbusiness/businesses',
          formData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setMessage('Business added successfully');
      }
      
      console.log('Success response:', response.data);
      
      // Reset form on success
      setForm({
        businessName: '',
        address: '',
        contactEmail: '',
        contactNumber: '',
        mapUrl: '',
        serviceType: '',
        images: [],
      });
      setEditingId(null);
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Refresh the business list
      fetchBusinesses();
      
    } catch (err) {
      console.error('=== ERROR DETAILS ===');
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      console.error('Error response headers:', err.response?.headers);
      console.error('=== END ERROR DETAILS ===');
      
      // Extract meaningful error message
      let errorMessage = 'Unknown error occurred';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setMessage('Error while saving business: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = business => {
    console.log('Editing business:', business);
    setForm({
      businessName: business.businessName || '',
      address: business.address || '',
      contactEmail: business.contactEmail || '',
      contactNumber: business.contactNumber || '',
      mapUrl: business.mapUrl || '',
      serviceType: business.serviceTypes[0]?._id || '',
      images: [],
    });
    setEditingId(business._id);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowTotpModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://connectus.net.in/connectus-api/adminbusiness/businesses/${deletingId}`, {
        withCredentials: true,
        data: { totp },
      });
      setMessage('Deleted successfully');
      setShowTotpModal(false);
      setTotp('');
      setDeletingId(null);
      fetchBusinesses();
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error deleting business';
      setMessage(errorMessage);
    }
  };

  return (

<div className="bm-business-container">
  {/* Header */}
  <Sidebar/>
  <div className='sm-content-wrapper'>
      <div className="bm-header">
    <div className="bm-header-content">
      <div className="bm-header-inner">
        <div className="bm-header-logo">
          <Building2 className="bm-header-icon" />
          <h1 className="bm-header-title">Business Manager</h1>
        </div>
      </div>
    </div>
  </div>

  <div className="bm-main-content">
    {/* Form Section - Left Side */}
    <div className="bm-form-section">
      <div className="bm-form-header">
        <h2 className="bm-form-header-title">
          {editingId ? <Edit className="bm-form-header-icon" /> : <Plus className="bm-form-header-icon" />}
          {editingId ? 'Edit Business' : 'Add New Business'}
        </h2>
      </div>
  
      <div className="bm-form-content">
        <div className="bm-form-grid">
          <div className="bm-form-group">
            <label className="bm-form-label">
              <Building2 className="bm-form-label-icon" />
              Business Name *
            </label>
            <input
              name="businessName"
              placeholder="Enter business name"
              value={form.businessName}
              onChange={handleChange}
              className="bm-form-input"
              required
            />
          </div>

          <div className="bm-form-group">
            <label className="bm-form-label">
              <MapPin className="bm-form-label-icon" />
              Address *
            </label>
            <input
              name="address"
              placeholder="Enter business address"
              value={form.address}
              onChange={handleChange}
              className="bm-form-input"
              required
            />
          </div>

          <div className="bm-form-group">
            <label className="bm-form-label">
              <Mail className="bm-form-label-icon" />
              Contact Email *
            </label>
            <input
              name="contactEmail"
              type="email"
              placeholder="Enter email address"
              value={form.contactEmail}
              onChange={handleChange}
              className="bm-form-input"
              required
            />
          </div>

          <div className="bm-form-group">
            <label className="bm-form-label">
              <Phone className="bm-form-label-icon" />
              Contact Number *
            </label>
            <input
              name="contactNumber"
              placeholder="Enter phone number"
              value={form.contactNumber}
              onChange={handleChange}
              className="bm-form-input"
              required
            />
          </div>

          <div className="bm-form-group">
            <label className="bm-form-label">
              <MapPin className="bm-form-label-icon" />
              Map URL (Optional)
            </label>
            <input
              name="mapUrl"
              placeholder="Enter Google Maps URL"
              value={form.mapUrl}
              onChange={handleChange}
              className="bm-form-input"
            />
          </div>

          <div className="bm-form-group">
            <label className="bm-form-label">
              Service Type *
            </label>
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              className="bm-form-select"
              required
            >
              <option value="">-- Select Service Type --</option>
              {serviceTypes.map(service => (
                <option key={service._id} value={service._id}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="bm-form-group">
            <label className="bm-form-label">
              <Image className="bm-form-label-icon" />
              Business Images (Optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="bm-file-input"
            />
          </div>
        </div>

        <div className="bm-form-actions">
          <button
            onClick={handleAddOrUpdate}
            disabled={loading}
            className="bm-btn-primary"
          >
            {loading ? (
              <div className="bm-loading-spinner"></div>
            ) : editingId ? (
              <Edit className="bm-btn-icon" />
            ) : (
              <Plus className="bm-btn-icon" />
            )}
            {loading ? 'Saving...' : (editingId ? 'Update Business' : 'Add Business')}
          </button>
          {editingId && (
            <button 
              className="bm-btn-secondary"
              onClick={() => {
                setForm({
                  businessName: '',
                  address: '',
                  contactEmail: '',
                  contactNumber: '',
                  mapUrl: '',
                  serviceType: '',
                  images: [],
                });
                setEditingId(null);
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
              }}
            >
              <X className="bm-btn-icon" />
              Cancel
            </button>
          )}  
        </div>
      </div>
    </div>

    {/* Businesses Section - Right Side */}
    <div className="bm-businesses-section">
      <div className="bm-businesses-header">
        <h3 className="bm-businesses-header-title">
          All Businesses ({businesses.length})
        </h3>
      </div>

      {/* Message */}
      {message && (
        <div className={`bm-message ${
          message.includes('Error') || message.includes('Invalid')
            ? 'bm-message-error'
            : 'bm-message-success'
        }`}>
          <div className="bm-message-content">
            <div className="bm-message-text">{message}</div>
          </div>
        </div>
      )}

      <div className="bm-businesses-content">
        {businesses.length === 0 ? (
          <div className="bm-businesses-empty">
            <Building2 className="bm-businesses-empty-icon" />
            <h3 className="bm-businesses-empty-title">No businesses found</h3>
            <p className="bm-businesses-empty-text">Get started by adding your first business.</p>
          </div>
        ) : (
          businesses.map(b => (
            <div key={b._id} className="bm-business-item">
              <div className="bm-business-content">
                <div className="bm-business-main">
                  <div className="bm-business-info">
                    <div className="bm-business-header-info">
                      <div className="bm-business-avatar">
                        <Building2 className="bm-business-avatar-icon" />
                      </div>
                      <div className="bm-business-details">
                        <h4 className="bm-business-name">{b.businessName}</h4>
                        <div className="bm-business-meta">
                          <p className="bm-business-meta-item">
                            <MapPin className="bm-business-meta-icon" />
                            {b.address}
                          </p>
                          <p className="bm-business-meta-item">
                            <Phone className="bm-business-meta-icon" />
                            {b.contactNumber}
                          </p>
                          <p className="bm-business-meta-item">
                            <Mail className="bm-business-meta-icon" />
                            {b.contactEmail}
                          </p>
                          {b.serviceTypes && b.serviceTypes.length > 0 && (
                            <div className="bm-business-service-tag">
                              {b.serviceTypes.map(st => st.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {b.image && b.image.length > 0 && (
                      <div className="bm-business-images">
                        <div className="bm-business-images-grid">
                          {b.image.map((img, i) => (
                            <img
                              key={i}
                              src={`https://connectus.net.in${img}`}
                              alt="Business"
                              className="bm-business-image"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bm-business-actions">
                    <button
                      onClick={() => handleEdit(b)}
                      className="bm-btn-edit"
                    >
                      <Edit className="bm-btn-small-icon" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(b._id)}
                      className="bm-btn-delete"
                    >
                      <Trash2 className="bm-btn-small-icon" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>

  {/* TOTP Modal */}
  {showTotpModal && (
    <div className="bm-modal-overlay">
      <div className="bm-modal-content">
        <div className="bm-modal-body">
          <h3 className="bm-modal-title">Confirm Delete</h3>
          <p className="bm-modal-text">
            Enter your TOTP code to confirm the deletion of this business.
          </p>
          <input
            type="text"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            placeholder="Enter TOTP code"
            className="bm-modal-input"
          />
          <div className="bm-modal-actions">
            <button
              onClick={handleDeleteConfirm}
              className="bm-btn-danger"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => {
                setShowTotpModal(false);
                setTotp('');
                setDeletingId(null);
              }}
              className="bm-btn-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
  </div>

</div>
    // <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
    //   <h3>{editingId ? 'Edit' : 'Add'} Business</h3>
      
    //   <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
    //     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px', marginBottom: '10px' }}>
    //       <input 
    //         name="businessName" 
    //         placeholder="Business Name *" 
    //         value={form.businessName} 
    //         onChange={handleChange}
    //         style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
    //         required
    //       />
    //       <input 
    //         name="address" 
    //         placeholder="Address *" 
    //         value={form.address} 
    //         onChange={handleChange}
    //         style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
    //         required
    //       />
    //       <input 
    //         name="contactEmail" 
    //         type="email"
    //         placeholder="Contact Email *" 
    //         value={form.contactEmail} 
    //         onChange={handleChange}
    //         style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
    //         required
    //       />
    //       <input 
    //         name="contactNumber" 
    //         placeholder="Contact Number *" 
    //         value={form.contactNumber} 
    //         onChange={handleChange}
    //         style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
    //         required
    //       />
    //       <input 
    //         name="mapUrl" 
    //         placeholder="Map URL (optional)" 
    //         value={form.mapUrl} 
    //         onChange={handleChange}
    //         style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
    //       />
    //       <select 
    //         name="serviceType" 
    //         value={form.serviceType} 
    //         onChange={handleChange}
    //         style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
    //         required
    //       >
    //         <option value="">-- Select Service Type * --</option>
    //         {serviceTypes.map(service => (
    //           <option key={service._id} value={service._id}>{service.name}</option>
    //         ))}
    //       </select>
    //     </div>
        
    //     <div style={{ marginBottom: '10px' }}>
    //       <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
    //         Business Images (optional)
    //       </label>
    //       <input 
    //         type="file" 
    //         multiple 
    //         accept="image/*"
    //         onChange={handleFileChange}
    //         style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
    //       />
    //     </div>
        
    //     <button 
    //       onClick={handleAddOrUpdate}
    //       disabled={loading}
    //       style={{ 
    //         padding: '10px 20px', 
    //         backgroundColor: loading ? '#ccc' : '#007bff', 
    //         color: 'white', 
    //         border: 'none', 
    //         borderRadius: '4px',
    //         cursor: loading ? 'not-allowed' : 'pointer'
    //       }}
    //     >
    //       {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
    //     </button>
        
    //     {editingId && (
    //       <button 
    //         onClick={() => {
    //           setForm({
    //             businessName: '',
    //             address: '',
    //             contactEmail: '',
    //             contactNumber: '',
    //             mapUrl: '',
    //             serviceType: '',
    //             images: [],
    //           });
    //           setEditingId(null);
    //           const fileInput = document.querySelector('input[type="file"]');
    //           if (fileInput) fileInput.value = '';
    //         }}
    //         style={{ 
    //           marginLeft: '10px',
    //           padding: '10px 20px', 
    //           backgroundColor: '#6c757d', 
    //           color: 'white', 
    //           border: 'none', 
    //           borderRadius: '4px',
    //           cursor: 'pointer'
    //         }}
    //       >
    //         Cancel
    //       </button>
    //     )}
    //   </div>

    //   {message && (
    //     <div style={{ 
    //       padding: '10px', 
    //       marginBottom: '10px',
    //       backgroundColor: message.includes('Error') || message.includes('error') ? '#f8d7da' : '#d4edda',
    //       color: message.includes('Error') || message.includes('error') ? '#721c24' : '#155724',
    //       border: `1px solid ${message.includes('Error') || message.includes('error') ? '#f5c6cb' : '#c3e6cb'}`,
    //       borderRadius: '4px'
    //     }}>
    //       {message}
    //     </div>
    //   )}

    //   <div style={{ border: '1px solid #ddd', borderRadius: '5px' }}>
    //     <h4 style={{ margin: '0', padding: '15px', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
    //       Businesses ({businesses.length})
    //     </h4>
    //     <div>
    //       {businesses.length === 0 ? (
    //         <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No businesses found</p>
    //       ) : (
    //         businesses.map(b => (
    //           <div key={b._id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
    //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    //               <div>
    //                 <h5 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{b.businessName}</h5>
    //                 <p style={{ margin: '2px 0', color: '#666' }}>{b.address}</p>
    //                 <p style={{ margin: '2px 0', color: '#666' }}>{b.contactNumber}</p>
    //                 <p style={{ margin: '2px 0', color: '#0066cc' }}>{b.contactEmail}</p>
    //                 {b.serviceTypes && b.serviceTypes.length > 0 && (
    //                   <p style={{ margin: '2px 0', fontSize: '14px', color: '#888' }}>
    //                     Services: {b.serviceTypes.map(st => st.name).join(', ')}
    //                   </p>
    //                 )}
    //               </div>
    //               <div style={{ display: 'flex', gap: '5px' }}>
    //                 <button 
    //                   onClick={() => handleEdit(b)}
    //                   style={{ 
    //                     padding: '5px 10px', 
    //                     backgroundColor: '#ffc107', 
    //                     color: 'white', 
    //                     border: 'none', 
    //                     borderRadius: '3px',
    //                     cursor: 'pointer'
    //                   }}
    //                 >
    //                   Edit
    //                 </button>
    //                 <button 
    //                   onClick={() => handleDeleteClick(b._id)}
    //                   style={{ 
    //                     padding: '5px 10px', 
    //                     backgroundColor: '#dc3545', 
    //                     color: 'white', 
    //                     border: 'none', 
    //                     borderRadius: '3px',
    //                     cursor: 'pointer'
    //                   }}
    //                 >
    //                   Delete
    //                 </button>
    //               </div>
    //             </div>
                
    //             {b.image && b.image.length > 0 && (
    //               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
    //                 {b.image.map((img, i) => (
    //                   <img
    //                     key={i}
    //                     src={`https://connectus.net.in${img}`}
    //                     alt="Business"
    //                     style={{ 
    //                       width: '80px', 
    //                       height: '80px', 
    //                       objectFit: 'cover', 
    //                       borderRadius: '4px',
    //                       border: '1px solid #ddd'
    //                     }}
    //                   />
    //                 ))}
    //               </div>
    //             )}
    //           </div>
    //         ))
    //       )}
    //     </div>
    //   </div>

    //   {/* TOTP Modal */}
    //   {showTotpModal && (
    //     <div style={{
    //       position: 'fixed',
    //       top: 0,
    //       left: 0,
    //       right: 0,
    //       bottom: 0,
    //       backgroundColor: 'rgba(0,0,0,0.5)',
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       zIndex: 1000
    //     }}>
    //       <div style={{ 
    //         backgroundColor: 'white', 
    //         padding: '20px', 
    //         borderRadius: '8px',
    //         minWidth: '300px',
    //         boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    //       }}>
    //         <h4 style={{ marginTop: 0 }}>Enter TOTP to Confirm Delete</h4>
    //         <input
    //           type="text"
    //           value={totp}
    //           onChange={(e) => setTotp(e.target.value)}
    //           placeholder="Enter TOTP"
    //           style={{ 
    //             width: '100%', 
    //             padding: '8px', 
    //             border: '1px solid #ccc', 
    //             borderRadius: '4px',
    //             marginBottom: '15px'
    //           }}
    //         />
    //         <div style={{ display: 'flex', gap: '10px' }}>
    //           <button 
    //             onClick={handleDeleteConfirm}
    //             style={{ 
    //               flex: 1,
    //               padding: '8px 16px', 
    //               backgroundColor: '#dc3545', 
    //               color: 'white', 
    //               border: 'none', 
    //               borderRadius: '4px',
    //               cursor: 'pointer'
    //             }}
    //           >
    //             Confirm Delete
    //           </button>
    //           <button 
    //             onClick={() => {
    //               setShowTotpModal(false);
    //               setTotp('');
    //               setDeletingId(null);
    //             }}
    //             style={{ 
    //               flex: 1,
    //               padding: '8px 16px', 
    //               backgroundColor: '#6c757d', 
    //               color: 'white', 
    //               border: 'none', 
    //               borderRadius: '4px',
    //               cursor: 'pointer'
    //             }}
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default BusinessManager;