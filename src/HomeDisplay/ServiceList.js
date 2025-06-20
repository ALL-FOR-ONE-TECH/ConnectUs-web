import { Section } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './servcelist.css'; 

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://connectus.net.in/connectus-api/homeDisplay/Get-service-types')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('Invalid service type response:', data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch services:', err);
      });
  }, []);

  const handleClick = (serviceId) => {
    navigate(`/nearby-businesses/${serviceId}`);
  };

  return (
    <>

    <div className='service-sections'>
               <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Categories</h2>
          </div>
          <div className="categories-grid">
            {services.map(service  => (
              <div key={service._id} className="category-card"  onClick={() => handleClick(service._id)}>
                <div className="category-icon" dangerouslySetInnerHTML={{ __html: service.icon }} >
                 
                </div>
                <span className="category-name">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

</div>

</>

    // <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
    //   {services.map(service => (
    //     <div
    //       key={service._id}
    //       onClick={() => handleClick(service._id)}
    //       className="cursor-pointer bg-white p-4 rounded-lg shadow hover:shadow-lg flex flex-col items-center justify-center transition"
    //     >
    //       <div
    //         className="w-16 h-16 mb-2"
    //         dangerouslySetInnerHTML={{ __html: service.icon }}
    //         style={{ width: '64px', height: '64px' }}
    //       />
    //       <div className="text-sm font-medium text-center">{service.name}</div>
    //     </div>
    //   ))}
    // </div>
  );
};

export default ServiceList;
