import React, { useState, useEffect, useContext } from "react";
import { LocationContext } from "../LocationCapture";
import "./userpro.css"; // Import your CSS file for styling
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
const UserProfile = () => {
  const { location, token, setLocationWithToken } = useContext(LocationContext);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [selectedLatLng, setSelectedLatLng] = useState(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [message, setMessage] = useState("");

  // Load existing profile if token exists
  useEffect(() => {
    if (!token) return;

    fetch(`https://connectus.net.in/connectus-api/userprofile/profile/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const profile = data.data;
          setName(profile.name);
          setMobile(profile.mobile);
          setAddress(profile.location?.address || "");
          if (profile.location) {
            setSelectedLatLng({
              latitude: profile.location.latitude,
              longitude: profile.location.longitude,
            });
            setGoogleMapsUrl(profile.location.googleMapsUrl);
          }
        }
      })
      .catch(console.error);
  }, [token]);

  // When location context changes, update map URL and coords
  useEffect(() => {
    if (!location) return;
    setSelectedLatLng(location);
    setGoogleMapsUrl(`https://www.google.com/maps/@${location.latitude},${location.longitude},17z?entry=ttu`);
  }, [location]);

  // Handle map click to update location
  const onMapClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // x within the map container
    const y = e.clientY - rect.top; // y within the map container

    // Assuming map canvas centered on location, you can extend this to convert x,y to lat/lng with proper map projection or approximation

    // For simplicity, just set location to current cursor lat/lng from existing location with small offsets
    if (!selectedLatLng) return;

    // Approximate offset in lat/lng per pixel (tune as needed)
    const latPerPixel = 0.00005;
    const lngPerPixel = 0.00005;

    const newLat = selectedLatLng.latitude + (rect.height / 2 - y) * latPerPixel;
    const newLng = selectedLatLng.longitude + (x - rect.width / 2) * lngPerPixel;

    setSelectedLatLng({ latitude: newLat, longitude: newLng });
    setGoogleMapsUrl(`https://www.google.com/maps/@${newLat},${newLng},17z?entry=ttu`);
  };

  // Submit profile
  const submitProfile = async () => {
    if (!token) {
      setMessage("Location token missing");
      return;
    }
    if (!name || !mobile || !selectedLatLng) {
      setMessage("Please fill all fields and select location");
      return;
    }

    const body = {
      token,
      name,
      mobile,
      location: {
        address,
        latitude: selectedLatLng.latitude,
        longitude: selectedLatLng.longitude,
      },
    };

    try {
      const res = await fetch("https://connectus.net.in/connectus-api/userprofile/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Profile saved successfully!");
      } else {
        setMessage("Failed to save profile");
      }
    } catch {
      setMessage("Network error");
    }
  };

  return (
    <>
    <Navbar/>
            <div className="up-container">
      <div className="up-form-card">
        <div className="up-header">
          <h2 className="up-title">Create / Update Profile</h2>
        </div>

        <div className="up-form-group">
          <input
            type="text"
            placeholder="Name"
            className="up-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="up-form-group">
          <input
            type="tel"
            placeholder="Mobile Number"
            className="up-input"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <div className="up-form-group">
          <input
            type="text"
            placeholder="Address (optional)"
            className="up-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="up-form-group">
          <div
            onClick={onMapClick}
            className="up-map-container"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onMapClick()}
          >
            {selectedLatLng ? (
              <iframe
                title="Selected Location Map"
                src={`https://maps.google.com/maps?q=${selectedLatLng.latitude},${selectedLatLng.longitude}&z=15&output=embed`}
                className="up-map-iframe"
                loading="lazy"
              />
            ) : (
              <div className="up-map-placeholder">
                Click on the map to select location
              </div>
            )}
          </div>

          <div className="up-location-info">
            <p className="up-location-text">
              Selected Location:{" "}
              {selectedLatLng ? (
                <span className="up-location-coords">
                  {selectedLatLng.latitude.toFixed(6)}, {selectedLatLng.longitude.toFixed(6)}
                </span>
              ) : (
                "None"
              )}
            </p>
          </div>

          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="up-maps-link"
            >
              View in Google Maps
            </a>
          )}
        </div>

        <button
          onClick={submitProfile}
          className="up-submit-button"
        >
          Save Profile
        </button>

        {message && (
          <div className={`up-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>

    // <div className="max-w-md mx-auto p-4 space-y-4">
    //   <h2 className="text-2xl font-bold">Create / Update Profile</h2>

    //   <input
    //     type="text"
    //     placeholder="Name"
    //     className="w-full p-2 border rounded"
    //     value={name}
    //     onChange={(e) => setName(e.target.value)}
    //   />

    //   <input
    //     type="tel"
    //     placeholder="Mobile Number"
    //     className="w-full p-2 border rounded"
    //     value={mobile}
    //     onChange={(e) => setMobile(e.target.value)}
    //   />

    //   <input
    //     type="text"
    //     placeholder="Address (optional)"
    //     className="w-full p-2 border rounded"
    //     value={address}
    //     onChange={(e) => setAddress(e.target.value)}
    //   />

    //   <div
    //     onClick={onMapClick}
    //     className="border rounded h-64 w-full bg-gray-100 cursor-pointer relative"
    //   >
    //     {/* Use an iframe embedding Google Maps with coordinates */}
    //     {selectedLatLng ? (
    //       <iframe
    //         title="Map"
    //         src={`https://maps.google.com/maps?q=${selectedLatLng.latitude},${selectedLatLng.longitude}&z=15&output=embed`}
    //         className="w-full h-full"
    //         style={{ border: 0 }}
    //         loading="lazy"
    //       />
    //     ) : (
    //       <p className="text-center mt-28 text-gray-500">Click on the map to select location</p>
    //     )}
    //   </div>

    //   <p>
    //     Selected Location:{" "}
    //     {selectedLatLng
    //       ? `${selectedLatLng.latitude.toFixed(6)}, ${selectedLatLng.longitude.toFixed(6)}`
    //       : "None"}
    //   </p>

    //   {googleMapsUrl && (
    //     <p>
    //       <a
    //         href={googleMapsUrl}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="text-blue-600 underline"
    //       >
    //         View in Google Maps
    //       </a>
    //     </p>
    //   )}

    //   <button
    //     onClick={submitProfile}
    //     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    //   >
    //     Save Profile
    //   </button>

    //   {message && <p className="text-red-600">{message}</p>}
    // </div>
  );
};

export default UserProfile;
