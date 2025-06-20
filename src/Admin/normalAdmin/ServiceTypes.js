import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, ExternalLink } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import './servicetype.css';

const ServiceTypes = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axios.get('https://connectus.net.in/connectus-api/adminservice/service-types', {
        withCredentials: true,
      });
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services', err);
      setMessage('❌ Failed to fetch services');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      setMessage('❗ Service name required');
      return;
    }
    if (!iconUrl.trim()) {
      setMessage('❗ SVG icon code is required');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'https://connectus.net.in/connectus-api/adminservice/service-types',
        { name, icon: iconUrl },
        { withCredentials: true }
      );
      setMessage('✅ Service type added');
      setName('');
      setIconUrl('');
      fetchServices();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const totp = prompt('Enter your TOTP code to confirm deletion');
    if (!totp) {
      setMessage('❗ TOTP code is required for deletion');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`https://connectus.net.in/connectus-api/adminservice/service-types/${id}`, {
        params: { totp },
        withCredentials: true,
      });
      setMessage('✅ Deleted');
      fetchServices();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  return (

<div className="sm-app-container">
  <Sidebar/>
  <div className='sm-content-wrapper'>
      <div className="sm-header">
    <div className="sm-header-content">
      <h1 className="sm-header-title">Service Management</h1>
      <p className="sm-header-subtitle">Manage your service types and categories</p>
    </div>
  </div>
  <div className="sm-main-content">
    <div className="sm-grid-container">
      {/* Left Side - Add Service Form */}
      <div className="sm-form-card">
        <div className="sm-card-header">
          <div className="sm-icon-wrapper">
            <Plus className="sm-icon" />
          </div>
          <h2 className="sm-card-title">Add New Service</h2>
        </div>
        <div className="sm-form-content">
          {/* Service Name Input */}
          <div className="sm-input-group">
            <label className="sm-input-label">
              Service Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Service name"
              className="sm-text-input"
            />
          </div>
          <div className="sm-input-group">
            <div className="sm-label-row">
              <label className="sm-input-label">
                Service Icon (SVG)
              </label>
              <a 
                href="https://www.svgrepo.com/svg/122183/plumber?edit=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="sm-external-link"
              >
                <ExternalLink className="sm-link-icon" />
                Get SVG Icon
              </a>
            </div>
            <textarea
              value={iconUrl}
              onChange={e => setIconUrl(e.target.value)}
              placeholder="Paste SVG code"
              rows={5}
              className="sm-textarea-input"
            />
          </div>
          {iconUrl && (
            <div className="sm-preview-container">
              <div className="sm-preview-header">
                <Eye className="sm-preview-icon" />
                <span className="sm-preview-label">Preview</span>
              </div> 
              <div className="sm-preview-box">
                <div
                  dangerouslySetInnerHTML={{ __html: iconUrl }}
                  className="sm-preview-svg"
                />
              </div>
            </div>
          )}
          <button onClick={handleAdd} disabled={loading} className="sm-add-button">
            {loading ? 'Adding...' : 'Add Service Type'}
          </button>
          {message && (
            <div 
              className="sm-message" 
              style={{ color: message.includes('✅') ? 'green' : 'red' }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
      {/* Right Side - Services List */}
      <div className="sm-services-card">
        <div className="sm-services-header">
          <h2 className="sm-services-title">Current Services</h2>
          <span className="sm-services-count">
            Services
          </span>
        </div>
        <div className="sm-services-list">
          {services.map(service => (
            <div
              key={service._id}
              className="sm-service-item"
            >
              <div className="sm-service-info">
                <div className="sm-service-icon-wrapper">
                  <div 
                    className="sm-service-icon" 
                    dangerouslySetInnerHTML={{ __html: service.icon }}
                  />
                </div>
                <div className="sm-service-details">
                  <h3 className="sm-service-name">{service.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(service._id)} 
                className="sm-delete-button" 
                disabled={loading}
              >
                <Trash2 className="sm-delete-icon" />
              </button>
            </div>
          ))}
       </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        // <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
    //   <h2>Manage Service Types</h2>

    //   <input
    //     value={name}
    //     onChange={e => setName(e.target.value)}
    //     placeholder="Service name"
    //     style={{ width: '100%', padding: 8, marginBottom: 10 }}
    //   />
    //   <a href='https://www.svgrepo.com/svg/122183/plumber?edit=true'> click link to add svg</a>
    //   <textarea
    //     value={iconUrl}
    //     onChange={e => setIconUrl(e.target.value)}
    //     placeholder="Paste SVG code"
    //     rows={5}
    //     style={{ width: '100%', padding: 8, marginBottom: 10 }}
    //   />
    //   {iconUrl && (
    //     <div style={{ marginBottom: 10 }}>
    //       <strong>Preview:</strong>
    //       <div
    //         dangerouslySetInnerHTML={{ __html: iconUrl }}
    //         style={{ width: 50, height: 50 }}
    //       />
    //     </div>
    //   )}
    //   <button onClick={handleAdd} disabled={loading}>
    //     {loading ? 'Adding...' : 'Add Service Type'}
    //   </button>

    //   {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

    //   <ul style={{ listStyle: 'none', padding: 0 }}>
    //     {services.map(service => (
    //       <li
    //         key={service._id}
    //         style={{
    //           display: 'flex',
    //           justifyContent: 'space-between',
    //           alignItems: 'center',
    //           padding: '8px 0',
    //           borderBottom: '1px solid #ccc',
    //         }}
    //       >
    //         <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    //           <span dangerouslySetInnerHTML={{ __html: service.icon }} style={{ width: 24, height: 24 }} />
    //           {service.name}
    //         </span>
    //         <button onClick={() => handleDelete(service._id)} style={{ color: 'red' }} disabled={loading}>
    //           Delete
    //         </button>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default ServiceTypes;
