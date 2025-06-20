import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './Admin/AdminLogin';
import ServiceTypes from './Admin/normalAdmin/ServiceTypes';
import BusinessManager from './Admin/normalAdmin/BusinessManager';
import RegisterUser from './Admin/developerAdmin/RegisterUser';
import AdminReviewLinks from './Admin/normalAdmin/AdminReviewLinks';
import AllReviews from './Admin/normalAdmin/AllReviews';
import AllComplaints from './Admin/normalAdmin/AllComplaints';
import ErrorPage from './error.js/error';
import ServiceList from './HomeDisplay/ServiceList';
import NearbyBusinesses from './HomeDisplay/NearbyBusinesses';
import SearchEngin from './HomeDisplay/SearchEngin';
import BusinessDetails from './HomeDisplay/BusinessDetails';
import BusinessReviews from './HomeDisplay/BusinessReviews';
import ComplaintForm from './HomeDisplay/ComplaintForm';
import HomePage from './HomeDisplay/HomePage';
import Userpro from  './HomeDisplay/UserProfile'
import  AdminHome from './Admin/AdminHome.js'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LocationProvider } from './LocationCapture';

function PublicDiscoveryPage() {
  const [selectedService, setSelectedService] = React.useState(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Find Nearby Services</h1>
      <ServiceList onSelect={setSelectedService} />
      {selectedService && (
        <NearbyBusinesses serviceId={selectedService._id} />
      )}
    </div>
  );
}

function App() {
  return (
    <LocationProvider>
      <Router>
        <div style={{ overflow: 'hidden' }}>
          
          <Routes>
            {/* 🔒 Admin routes */}
            <Route path="adm-ConnectUs/admin-home" element={<AdminHome />} />
            <Route path="adm-ConnectUs/admin-login" element={<AdminLogin />} />
            <Route path="adm-ConnectUs/register-user" element={<RegisterUser />} />
            <Route path="adm-ConnectUs/service-types" element={<ServiceTypes />} />
            <Route path="adm-ConnectUs/business-manager" element={<BusinessManager />} />
            <Route path="adm-ConnectUs/admin-review-links" element={<AdminReviewLinks />} />
            <Route path="adm-ConnectUs/all-reviews" element={<AllReviews />} />
            <Route path="adm-ConnectUs/all-complaints" element={<AllComplaints />} />

            {/* 🌍 Public route to auto-get location and show services */}
            
             <Route path="*" element={<ErrorPage />} />
            <Route path="/getlocation" element={<PublicDiscoveryPage />} />
            <Route path="/ServiceList" element={<ServiceList />} />
            <Route path="/nearby-businesses/:serviceId" element={<NearbyBusinesses />} />
            <Route path="/search-engine" element={<SearchEngin />} />
            <Route path="/business-details/:businessId" element={<BusinessDetails />} />
            <Route path="/complaint-form" element={<ComplaintForm />} />
            <Route path="/review-link/:code" element={<BusinessReviews />} />
            <Route path="/userpro" element={<Userpro/>} />
            <Route path="*" element={<ErrorPage />} />
            {/* 🏠 Default route */}
            <Route path="/" element={<HomePage />} />
           
          </Routes>
       
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;
