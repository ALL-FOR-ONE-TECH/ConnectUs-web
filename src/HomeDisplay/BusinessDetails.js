import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Phone, MessageCircle, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import './buisnessdet.css'; // Assuming you have a CSS file for styling
const BusinessDetails = () => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`https://connectus.net.in/connectus-api/businessDetails/businesses/${businessId}`);
        setBusiness(res.data);
      } catch (err) {
        console.error('Error fetching business details:', err);
      }
    };

    fetchBusiness();
  }, [businessId]);

  if (!business) {
    return <p>Loading business details...</p>;
  }

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? (business.image?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === (business.image?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleWhatsApp = () => {
    const message = `Hi ${business.businessName}, I found your service on ConnectUs! I'm interested in your services.`;
    const whatsappUrl = `https://wa.me/${business.contactNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
<>
<Navbar/>
<div className="company-profile">
  <div className="company-profile__container">
    {/* Image Carousel */}
    <div className="company-profile__carousel">
      {business.image && business.image.length > 0 ? (
        <>
          <div className="company-profile__image-container">
            <img
              src={`https://connectus.net.in${business.image[currentImageIndex]}`}
              alt={`${business.businessName} - Image ${currentImageIndex + 1}`}
              className="company-profile__image"
            />
            <div className="company-profile__image-overlay"></div>
          </div>
          
          {business.image.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="company-profile__nav-btn company-profile__nav-btn--prev"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                className="company-profile__nav-btn company-profile__nav-btn--next"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
              
              <div className="company-profile__dots">
                {business.image.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`company-profile__dot ${
                      index === currentImageIndex ? 'company-profile__dot--active' : ''
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="company-profile__no-image">
          <MapPin size={48} />
          <p>No Images Available</p>
        </div>
      )}
    </div>

    {/* Business Information */}
    <div className="company-profile__content">
      <div className="company-profile__header">
        <h1 className="company-profile__title">{business.businessName}</h1>
        <div className="company-profile__info">
          <div className="company-profile__info-item">
            <MapPin className="company-profile__icon" size={18} />
            <span>{business.address}</span>
          </div>
          <div className="company-profile__info-item">
            <Phone className="company-profile__icon" size={18} />
            <span>{business.contactNumber}</span>
          </div>
          <div className="company-profile__info-item">
            <MessageCircle className="company-profile__icon" size={18} />
            <span>{business.contactEmail}</span>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="company-profile__services">
        <h3 className="company-profile__services-title">Our Services</h3>
        <div className="company-profile__services-list">
          {business.serviceTypes.map((service, index) => (
            <span key={index} className="company-profile__service-tag">
              {service.name}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="company-profile__actions">
        <a
          href={`tel:${business.contactNumber}`}
          className="company-profile__btn company-profile__btn--primary"
        >
          <Phone size={20} />
          <span>Call Now</span>
        </a>
        <button
          onClick={handleWhatsApp}
          className="company-profile__btn company-profile__btn--whatsapp"
        >
          <MessageCircle size={20} />
          <span>WhatsApp</span>
        </button>
        {business.mapUrl && (
          <a
            href={business.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="company-profile__btn company-profile__btn--secondary"
          >
            <MapPin size={20} />
            <span>View Map</span>
          </a>
        )}
      </div>
    </div>
  </div>
</div>
<Footer/>
</>

 
    // <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
    //   {/* Image Carousel */}
    //   <div style={{
    //     position: 'relative',
    //     width: '100%',
    //     height: '400px',
    //     marginBottom: '2rem',
    //     borderRadius: '10px',
    //     overflow: 'hidden',
    //     backgroundColor: '#f8f9fa'
    //   }}>
    //     {business.image && business.image.length > 0 ? (
    //       <>
    //         <img
    //           src={`https://connectus.net.in${business.image[currentImageIndex]}`}
    //           alt={`${business.businessName} - Image ${currentImageIndex + 1}`}
    //           style={{
    //             width: '100%',
    //             height: '100%',
    //             objectFit: 'cover'
    //           }}
    //         />
    //         {business.image.length > 1 && (
    //           <>
    //             <button
    //               onClick={handlePrevImage}
    //               style={{
    //                 position: 'absolute',
    //                 left: '10px',
    //                 top: '50%',
    //                 transform: 'translateY(-50%)',
    //                 backgroundColor: 'rgba(0,0,0,0.5)',
    //                 color: 'white',
    //                 border: 'none',
    //                 borderRadius: '50%',
    //                 width: '40px',
    //                 height: '40px',
    //                 cursor: 'pointer'
    //               }}
    //             >
    //               ←
    //             </button>
    //             <button
    //               onClick={handleNextImage}
    //               style={{
    //                 position: 'absolute',
    //                 right: '10px',
    //                 top: '50%',
    //                 transform: 'translateY(-50%)',
    //                 backgroundColor: 'rgba(0,0,0,0.5)',
    //                 color: 'white',
    //                 border: 'none',
    //                 borderRadius: '50%',
    //                 width: '40px',
    //                 height: '40px',
    //                 cursor: 'pointer'
    //               }}
    //             >
    //               →
    //             </button>
    //             <div style={{
    //               position: 'absolute',
    //               bottom: '10px',
    //               left: '50%',
    //               transform: 'translateX(-50%)',
    //               display: 'flex',
    //               gap: '5px'
    //             }}>
    //               {business.image.map((_, index) => (
    //                 <button
    //                   key={index}
    //                   onClick={() => setCurrentImageIndex(index)}
    //                   style={{
    //                     width: '10px',
    //                     height: '10px',
    //                     borderRadius: '50%',
    //                     backgroundColor: index === currentImageIndex ? '#3498db' : 'rgba(255,255,255,0.5)',
    //                     border: 'none',
    //                     cursor: 'pointer'
    //                   }}
    //                 />
    //               ))}
    //             </div>
    //           </>
    //         )}
    //       </>
    //     ) : (
    //       <div style={{
    //         width: '100%',
    //         height: '100%',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         color: '#a0aec0'
    //       }}>
    //         No Images Available
    //       </div>
    //     )}
    //   </div>

    //   <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '1rem' }}>{business.businessName}</h2>
    //   <p style={{ marginBottom: '0.5rem' }}><strong>Address:</strong> {business.address}</p>
    //   <p style={{ marginBottom: '0.5rem' }}><strong>Contact:</strong> {business.contactNumber}</p>
    //   <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> {business.contactEmail}</p>
    //   <p style={{ marginBottom: '1.5rem' }}><strong>Services:</strong> {business.serviceTypes.map(st => st.name).join(', ')}</p>

    //   <div style={{
    //     display: 'flex',
    //     gap: '1rem',
    //     marginTop: '2rem'
    //   }}>
    //     <a
    //       href={`tel:${business.contactNumber}`}
    //       style={{
    //         backgroundColor: '#3498db',
    //         color: 'white',
    //         padding: '0.8rem 1.5rem',
    //         borderRadius: '6px',
    //         textDecoration: 'none',
    //         display: 'flex',
    //         alignItems: 'center',
    //         gap: '0.5rem'
    //       }}
    //     >
    //       📞 Call Now
    //     </a>
    //     <button
    //       onClick={handleWhatsApp}
    //       style={{
    //         backgroundColor: '#25D366',
    //         color: 'white',
    //         padding: '0.8rem 1.5rem',
    //         borderRadius: '6px',
    //         border: 'none',
    //         cursor: 'pointer',
    //         display: 'flex',
    //         alignItems: 'center',
    //         gap: '0.5rem'
    //       }}
    //     >
    //       💬 WhatsApp
    //     </button>
    //     {business.mapUrl && (
    //       <a
    //         href={business.mapUrl}
    //         target="_blank"
    //         rel="noreferrer"
    //         style={{
    //           backgroundColor: '#e74c3c',
    //           color: 'white',
    //           padding: '0.8rem 1.5rem',
    //           borderRadius: '6px',
    //           textDecoration: 'none',
    //           display: 'flex',
    //           alignItems: 'center',
    //           gap: '0.5rem'
    //         }}
    //       >
    //         🗺️ View Map
    //       </a>
    //     )}
    //   </div>
    // </div>
  );
};

export default BusinessDetails;
