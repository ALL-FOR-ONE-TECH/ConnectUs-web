import React, { useState } from 'react';
import ServiceList from './ServiceList';
import NearbyBusinesses from './NearbyBusinesses';

const GetLocationPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div>
      <ServiceList onSelect={setSelectedService} />
      {selectedService && (
        <NearbyBusinesses serviceId={selectedService._id} />
      )}
    </div>
  );
};

export default GetLocationPage;
