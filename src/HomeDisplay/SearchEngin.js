import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Heart } from 'lucide-react';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import './searchengin.css'; // Import your CSS file for styling
const SearchEngin = () => {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('https://connectus.net.in/connectus-api/searchengine/service-types');
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    const fetchPlaces = async () => {
      try {
        const res = await axios.get('https://connectus.net.in/connectus-api/searchengine/businesses/places');
        setPlaces(res.data);
      } catch (err) {
        console.error('Error fetching places:', err);
      }
    };

    fetchServices();
    fetchPlaces();

    // Handle initial search if coming from homepage
    if (location.state?.initialSearch) {
      setSearchText(location.state.initialSearch);
    }
  }, [location.state]);

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (selectedServices.length > 0) params.append('services', selectedServices.join(','));
    if (selectedPlaces.length > 0) params.append('places', selectedPlaces.join(','));
    if (searchText.trim().length > 0) params.append('q', searchText);

    setLoading(true);
    try {
      const response = await axios.get(`https://connectus.net.in/connectus-api/searchengine/businesses/search?${params.toString()}`);
      setResults(response.data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.trim().length > 0) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchText, selectedServices, selectedPlaces]);

  return (
    <>
    <Navbar/>
    <div className="se-search-engine">
  <div className="se-search-container">
    <h1 className="se-search-title">Find Local Services</h1>
    
    <div className="se-search-layout">
      {/* Filters Sidebar */}
      <aside className="se-filters-sidebar">
        <div className="se-filter-section">
          <h3 className="se-filter-title">Service Types</h3>
          <div className="se-filter-list">
            {services.map((service) => (
              <label key={service._id} className="se-filter-item">
                <input
                  type="checkbox"
                  value={service._id}
                  checked={selectedServices.includes(service._id)}
                  onChange={() => {
                    setSelectedServices(prev =>
                      prev.includes(service._id)
                        ? prev.filter(id => id !== service._id)
                        : [...prev, service._id]
                    );
                  }}
                  className="se-filter-checkbox"
                />
                <span className="se-checkmark"></span>
                <span className="se-filter-label">{service.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="se-filter-section">
          <h3 className="se-filter-title">Locations</h3>
          <div className="se-filter-list">
            {places.map((place) => (
              <label key={place} className="se-filter-item">
                <input
                  type="checkbox"
                  value={place}
                  checked={selectedPlaces.includes(place)}
                  onChange={() => {
                    setSelectedPlaces(prev =>
                      prev.includes(place)
                        ? prev.filter(p => p !== place)
                        : [...prev, place]
                    );
                  }}
                  className="se-filter-checkbox"
                />
                <span className="se-checkmark"></span>
                <span className="se-filter-label">{place}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Search Area */}
      <main className="se-search-main">
        <div className="se-search-bar-container">
          <div className="se-search-input-wrapper">
            <Search className="se-search-icon" size={20} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for services, businesses..."
              className="se-search-input"
            />
          </div>
          <button
            onClick={handleSearch}
            className="se-search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="se-results-container">
          {loading ? (
            <div className="se-loading-state">
              <div className="se-loading-spinner"></div>
              <p>Searching for businesses...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="se-empty-state">
              <Search size={64} className="se-empty-icon" />
              <h3>No results found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="se-results-grid">
              {results.map((business) => (
                <div key={business._id} className="se-business-card">
                  <div className="se-business-image">
                    {business.image && business.image[0] ? (
                      <img
                        src={`https://connectus.net.in${business.image[0]}`}
                        alt={business.businessName}
                        loading="lazy"
                      />
                    ) : (
                      <div className="se-image-placeholder">
                        <Search size={32} />
                      </div>
                    )}
                    <button className="se-favorite-btn">
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="se-business-content">
                    <Link className="se-business-name" to={`/business-details/${business._id}`}>
                      <h3>{business.businessName}</h3>
                    </Link>
                    <div className="se-business-address">
                      <MapPin size={16} />
                      <span>{business.address}</span>
                    </div>
                    {business.serviceTypes && (
                      <div className="se-business-services">
                        {business.serviceTypes.map((service, index) => (
                          <span className="se-service-tag" style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
                            Services: {business.serviceTypes.map(st => st.name).join(', ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  </div>
</div>
<Footer/>
    </>

    // <div style={{
    //   padding: '40px',
    //   maxWidth: '1200px',
    //   margin: '0 auto',
    //   backgroundColor: '#f5f7fa'
    // }}>
    //   <h2 style={{
    //     fontSize: '2.5rem',
    //     color: '#2c3e50',
    //     textAlign: 'center',
    //     marginBottom: '2rem',
    //     fontWeight: '600'
    //   }}>Advanced Search</h2>

    //   <div style={{
    //     display: 'grid',
    //     gridTemplateColumns: 'minmax(250px, 1fr) minmax(600px, 2fr)',
    //     gap: '2rem',
    //     alignItems: 'start'
    //   }}>
    //     {/* Filters Section */}
    //     <div style={{
    //       backgroundColor: 'white',
    //       padding: '1.5rem',
    //       borderRadius: '10px',
    //       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    //     }}>
    //       <div style={{ marginBottom: '2rem' }}>
    //         <h3 style={{
    //           color: '#2c3e50',
    //           fontSize: '1.2rem',
    //           marginBottom: '1rem'
    //         }}>Service Types</h3>
    //         {services.map((service) => (
    //           <div key={service._id} style={{ marginBottom: '0.5rem' }}>
    //             <label style={{
    //               display: 'flex',
    //               alignItems: 'center',
    //               cursor: 'pointer',
    //               padding: '0.5rem',
    //               borderRadius: '4px',
    //               transition: 'background-color 0.2s'
    //             }}>
    //               <input
    //                 type="checkbox"
    //                 value={service._id}
    //                 checked={selectedServices.includes(service._id)}
    //                 onChange={() => {
    //                   setSelectedServices(prev =>
    //                     prev.includes(service._id)
    //                       ? prev.filter(id => id !== service._id)
    //                       : [...prev, service._id]
    //                   );
    //                 }}
    //                 style={{ marginRight: '0.5rem' }}
    //               />
    //               {service.name}
    //             </label>
    //           </div>
    //         ))}
    //       </div>

    //       <div>
    //         <h3 style={{
    //           color: '#2c3e50',
    //           fontSize: '1.2rem',
    //           marginBottom: '1rem'
    //         }}>Locations</h3>
    //         {places.map((place) => (
    //           <div key={place} style={{ marginBottom: '0.5rem' }}>
    //             <label style={{
    //               display: 'flex',
    //               alignItems: 'center',
    //               cursor: 'pointer',
    //               padding: '0.5rem',
    //               borderRadius: '4px',
    //               transition: 'background-color 0.2s'
    //             }}>
    //               <input
    //                 type="checkbox"
    //                 value={place}
    //                 checked={selectedPlaces.includes(place)}
    //                 onChange={() => {
    //                   setSelectedPlaces(prev =>
    //                     prev.includes(place)
    //                       ? prev.filter(p => p !== place)
    //                       : [...prev, place]
    //                   );
    //                 }}
    //                 style={{ marginRight: '0.5rem' }}
    //               />
    //               {place}
    //             </label>
    //           </div>
    //         ))}
    //       </div>
    //     </div>

    //     {/* Search and Results Section */}
    //     <div>          <div style={{
    //         marginBottom: '2rem',
    //         position: 'relative',
    //         display: 'flex',
    //         gap: '1rem'
    //       }}>
    //         <input
    //           type="text"
    //           value={searchText}
    //           onChange={(e) => setSearchText(e.target.value)}
    //           onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    //           placeholder="Search businesses, services, or locations..."
    //           style={{
    //             flex: 1,
    //             padding: '1rem 1.5rem',
    //             fontSize: '1rem',
    //             border: '2px solid #e2e8f0',
    //             borderRadius: '8px',
    //             outline: 'none',
    //             transition: 'all 0.3s'
    //           }}
    //         />
    //         <button
    //           onClick={handleSearch}
    //           style={{
    //             backgroundColor: '#3498db',
    //             color: 'white',
    //             padding: '0 2rem',
    //             borderRadius: '8px',
    //             border: 'none',
    //             fontSize: '1rem',
    //             cursor: 'pointer',
    //             transition: 'background-color 0.3s',
    //             display: 'flex',
    //             alignItems: 'center',
    //             gap: '0.5rem'
    //           }}
    //         >
    //           {loading ? 'Searching...' : (
    //             <>
    //               <span>🔍</span>
    //               <span>Search</span>
    //             </>
    //           )}
    //         </button>
    //       </div>

    //       <div>
    //         {loading ? (
    //           <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
    //             Searching...
    //           </p>
    //         ) : results.length === 0 ? (
    //           <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
    //             No businesses found.
    //           </p>
    //         ) : (
    //           <div style={{ display: 'grid', gap: '1rem' }}>
    //             {results.map((business) => (
    //               <div key={business._id} style={{
    //                 backgroundColor: 'white',
    //                 borderRadius: '10px',
    //                 padding: '1.5rem',
    //                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    //                 display: 'flex',
    //                 gap: '1.5rem'
    //               }}>
    //                 <div style={{
    //                   width: '120px',
    //                   height: '120px',
    //                   flexShrink: 0,
    //                   borderRadius: '4px',
    //                   overflow: 'hidden'
    //                 }}>
    //                   {business.image && business.image[0] ? (
    //                     <img
    //                       src={`https://connectus.net.in${business.image[0]}`}
    //                       alt={business.businessName}
    //                       style={{
    //                         width: '100%',
    //                         height: '100%',
    //                         objectFit: 'cover'
    //                       }}
    //                     />
    //                   ) : (
    //                     <div style={{
    //                       width: '100%',
    //                       height: '100%',
    //                       backgroundColor: '#f8f9fa',
    //                       display: 'flex',
    //                       alignItems: 'center',
    //                       justifyContent: 'center',
    //                       color: '#a0aec0'
    //                     }}>
    //                       No Image
    //                     </div>
    //                   )}
    //                 </div>
    //                 <div style={{ flex: 1 }}>
    //                   <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
    //                     <Link to={`/business-details/${business._id}`} style={{ color: '#3498db', textDecoration: 'none' }}>
    //                       {business.businessName}
    //                     </Link>
    //                   </h3>
    //                   <p style={{ color: '#718096', marginBottom: '0.5rem' }}>{business.address}</p>
    //                   {business.serviceTypes && (
    //                     <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
    //                       Services: {business.serviceTypes.map(st => st.name).join(', ')}
    //                     </p>
    //                   )}
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SearchEngin;
