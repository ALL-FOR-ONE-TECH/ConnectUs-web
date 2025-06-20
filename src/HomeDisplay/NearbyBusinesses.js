import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import './nearbybuis.css'; // Import your CSS file for styling
const NearbyBusinesses = () => {
  const { serviceId } = useParams();
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    if (!serviceId) return;

    fetch(`https://connectus.net.in/connectus-api/homeDisplay/businesses-by-service/${serviceId}`)
      .then(res => res.json())
      .then(setBusinesses);
  }, [serviceId]);

  return (
    <div className="nb-container">
      <div className="nb-header">
        <h2 className="nb-title">
          Nearby Businesses
        </h2>
        <p className="nb-subtitle">
          Discover amazing local businesses in your area
        </p>
      </div>

      <div className="nb-grid">
        {businesses.map(biz => (
          <BusinessCard key={biz._id} biz={biz} />
        ))}
      </div>
    </div>
  );
};

const BusinessCard = ({ biz }) => {
  const [imageIndex, setImageIndex] = useState(0);

  // ✅ useMemo to stabilize dependency
  const images = useMemo(() => {
    return biz.image && biz.image.length > 0 ? biz.image : [];
  }, [biz.image]);

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi ${biz.businessName}, I found your service on ConnectUs! I'm interested in your services.`;
    const whatsappUrl = `https://wa.me/${biz.contactNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const currentImage = images.length > 0
    ? `https://connectus.net.in${images[imageIndex]}`
    : 'https://via.placeholder.com/400x200?text=No+Image';

  return (
<>
<Navbar/>
<div className="nb-business-card">
  <div className="nb-image-container">
    <img
      src={currentImage}
      alt={biz.businessName}
      className="nb-business-image"
    />
    
    {images.length > 1 && (
      <>
        <div className="nb-image-indicators">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`nb-indicator ${idx === imageIndex ? 'active' : ''}`}
            />
          ))}
        </div>
        
        <div className="nb-image-navigation">
          <button
            onClick={handlePrevImage}
            className="nb-nav-button nb-nav-prev"
            aria-label="Previous image"
          >
            <span className="nb-nav-icon">‹</span>
          </button>
          <button
            onClick={handleNextImage}
            className="nb-nav-button nb-nav-next"
            aria-label="Next image"
          >
            <span className="nb-nav-icon">›</span>
          </button>
        </div>
      </>
    )}
  </div>

  <div className="nb-business-card-content">
    {images.length > 1 && (
      <div className="nb-image-counter">
        {imageIndex + 1} / {images.length}
      </div>
    )}
    
    <h3 className="nb-business-name">{biz.businessName}</h3>
    <p className="nb-business-address">{biz.address}</p>
    
    <div className="nb-business-actions">
      <a
        href={`tel:${biz.contactNumber}`}
        onClick={(e) => e.stopPropagation()}
        className="nb-action-button nb-call-button"
      >
          <Phone className="nb-action-icon" size={16} />
        <span className="nb-action-text">Call</span>
      </a>
      
      <button
        onClick={handleWhatsApp}
        className="nb-action-button nb-whatsapp-button"
      >
        <MessageCircle className="nb-action-icon" size={16} />
        <span className="nb-action-text">WhatsApp</span>
      </button>
      
      {biz.mapUrl && (
        <a
          href={biz.mapUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="nb-action-button nb-map-button"
        >
          <MapPin className="nb-action-icon" size={16} />
          <span className="nb-action-text">Map</span>
        </a>
      )}
    </div>
  </div>
</div>
<Footer/>
</>


    // <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden group">
    //   <div className="overflow-hidden h-48 w-full relative">
    //     <img
    //       src={currentImage}
    //       alt={biz.businessName}
    //       className="w-full h-full object-cover transition-all duration-700 ease-in-out"
    //     />
    //     {images.length > 1 && (
    //       <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
    //         {images.map((_, idx) => (
    //           <span
    //             key={idx}
    //             className={`w-2 h-2 rounded-full ${
    //               idx === imageIndex ? 'bg-blue-600' : 'bg-gray-300'
    //             }`}
    //           ></span>
    //         ))}
    //       </div>
    //     )}
    //   </div>      <div className="p-5 space-y-2 relative">
    //     {images.length > 1 && (
    //       <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 text-sm text-gray-600">
    //         {imageIndex + 1} / {images.length}
    //       </div>
    //     )}
    //     <h3 className="text-xl font-semibold text-gray-800">{biz.businessName}</h3>
    //     <p className="text-gray-600">{biz.address}</p>
    //     <div className="flex flex-wrap gap-3 pt-3">
    //       <a
    //         href={`tel:${biz.contactNumber}`}
    //         onClick={(e) => e.stopPropagation()}
    //         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm flex items-center gap-2"
    //       >
    //         📞 Call
    //       </a>
    //       <button
    //         onClick={handleWhatsApp}
    //         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition text-sm flex items-center gap-2"
    //       >
    //         💬 WhatsApp
    //       </button>
    //       {biz.mapUrl && (
    //         <a
    //           href={biz.mapUrl}
    //           target="_blank"
    //           rel="noreferrer"
    //           onClick={(e) => e.stopPropagation()}
    //           className="ml-auto text-blue-600 underline text-sm hover:text-blue-800 flex items-center gap-2"
    //         >
    //           🗺️ Map
    //         </a>
    //       )}
    //     </div>
    //     {images.length > 1 && (
    //       <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-2 pointer-events-none">
    //         <button
    //           onClick={handlePrevImage}
    //           className="bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center pointer-events-auto hover:bg-opacity-75"
    //         >
    //           ←
    //         </button>
    //         <button
    //           onClick={handleNextImage}
    //           className="bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center pointer-events-auto hover:bg-opacity-75"
    //         >
    //           →
    //         </button>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default NearbyBusinesses;
