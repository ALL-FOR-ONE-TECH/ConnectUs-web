import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceList from './ServiceList';
import { Search,MapPin,Heart } from 'lucide-react';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import './Home.css';
const HomePage = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate('/search-engine', { state: { initialSearch: searchText } });
    }
  };

   const popularServices = [
    {
      id: 1,
      image: '/public/jcvkjytyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy.jpg',
      title: 'Premium Restaurant',
      category: 'Restaurant',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Expert Plumbing',
      category: 'Plumbing',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Modern Salon',
      category: 'Beauty',
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Auto Repair Pro',
      category: 'Automotive',
      rating: 4.6,
      reviews: 78
    },
     {
      id: 5,
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Auto Repair Pro',
      category: 'Automotive',
      rating: 4.6,
      reviews: 78
    },
 {
      id: 6,
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Auto Repair Pro',
      category: 'Automotive',
      rating: 4.6,
      reviews: 78
    },


    
  ];


  return (
    <>
    <Navbar/>
<div className='app'>
  
          {/* <section className='hero'>
        <div className="hero-background"></div>
        <div className='container'>
          <div className='hero-content'>
             <h1>Find Local Services Near You</h1>
             <p>Discover and connect with trusted service providers in your area</p>

             <div className='search-container'>
                  <div className='search-box'>
                    <Search size={20} className="search-icon" />
               <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for businesses, services, or locations..."
          />
          <button
            onClick={handleSearch}
            className="search-btn"
          >
            Search
          </button>
                  </div>
             </div>
          </div>
        </div>
    </section> */}
       <section className="hero">
      <div className="hero-background"></div>
      <div className="container">
          <div className="hero-content">
              <h1>Discover Amazing Local Businesses</h1>
              <p>Get restaurants, services, and businesses delivered in your area with verified reviews and trusted recommendations</p> 
          
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for businesses, services, or locations..."
              />
              <button
                onClick={handleSearch}
                className="search-btn"
              >
               <Search size={20} className="search-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

</div>
<>
  <ServiceList />
</>
  <div className='service-sections'>
    <section className="popular-services">
        <div className="container">
          <div className="section-header">
            <h2>Popular Services</h2>
          </div>
          <br/>
          <div className="services-grid">
            {popularServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-image-container">
                  <img src={service.image} alt={service.title} className="service-image" />
                  <button className="favorite-btn">
                    <Heart size={20} />
                  </button>
                </div>
                <div className="service-info">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-category">{service.category}</p>
                  <div className="service-rating">
                    <span className="rating">★ {service.rating}</span>
                    <span className="reviews">({service.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
<Footer/>
</>

    // <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    //   {/* Banner Section */}
    //   <div style={{ 
    //     textAlign: 'center', 
    //     marginBottom: '2rem',
    //     padding: '2rem',
    //     backgroundColor: '#f8f9fa',
    //     borderRadius: '10px'
    //   }}>
    //     <h1 style={{ 
    //       fontSize: '2.5rem', 
    //       color: '#2c3e50',
    //       marginBottom: '1rem'
    //     }}>
    //       Find Local Services Near You
    //     </h1>
    //     <p style={{ 
    //       color: '#6c757d',
    //       fontSize: '1.2rem'
    //     }}>
    //       Discover and connect with trusted service providers in your area
    //     </p>

    //     {/* Simple Search Bar */}
    //     <div style={{ 
    //       maxWidth: '600px', 
    //       margin: '2rem auto 0',
    //       display: 'flex',
    //       gap: '1rem',
    //       padding: '0.5rem',
    //       backgroundColor: 'white',
    //       borderRadius: '8px',
    //       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    //     }}>
    //       <input
    //         type="text"
    //         value={searchText}
    //         onChange={(e) => setSearchText(e.target.value)}
    //         onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    //         placeholder="Search for businesses, services, or locations..."
    //         style={{
    //           flex: 1,
    //           padding: '0.8rem',
    //           border: '1px solid #e2e8f0',
    //           borderRadius: '6px',
    //           fontSize: '1rem'
    //         }}
    //       />
    //       <button
    //         onClick={handleSearch}
    //         style={{
    //           backgroundColor: '#3498db',
    //           color: 'white',
    //           padding: '0.8rem 2rem',
    //           borderRadius: '6px',
    //           border: 'none',
    //           cursor: 'pointer'
    //         }}
    //       >
    //         Search
    //       </button>
    //     </div>
    //   </div>

    //   {/* Service List */}
    //   <div>
    //     <h2 style={{ 
    //       fontSize: '1.8rem', 
    //       color: '#2c3e50',
    //       marginBottom: '1.5rem',
    //       textAlign: 'center'
    //     }}>
    //       Popular Services
    //     </h2>
    //   
    //   </div>
    // </div>
  );
};

export default HomePage;
