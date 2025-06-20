import React, { createContext, useEffect, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('user_token'));
  const [error, setError] = useState(null);
  const [locationFetched, setLocationFetched] = useState(!!token);

  useEffect(() => {
    if (token) return;

    const generateToken = async () => {
      const rawToken = crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      const encoder = new TextEncoder();
      const encoded = encoder.encode(rawToken);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    };

    const storeLocation = async (latitude, longitude) => {
      const encryptedToken = await generateToken();

      try {
        const res = await fetch('https://connectus.net.in/connectus-api/location/store-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude, longitude, token: encryptedToken }),
        });

        await res.json();
        sessionStorage.setItem('user_token', encryptedToken);
        setToken(encryptedToken);
        setLocationFetched(true);
        console.log('✅ Location stored:', latitude, longitude);
      } catch (err) {
        console.error('❌ Failed to store location:', err);
        setError('Failed to store location');
      }
    };

    const fallbackToIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          console.log('🌐 Fallback IP location:', data.latitude, data.longitude);
          await storeLocation(data.latitude, data.longitude);
        } else {
          setError('IP location unavailable');
        }
      } catch (err) {
        console.error('❌ IP fallback failed:', err);
        setError('Unable to get location');
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          await storeLocation(latitude, longitude);
        },
        async (err) => {
          console.warn('⚠️ Geolocation denied or failed. Falling back to IP.', err);
          await fallbackToIP();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn('⚠️ Geolocation not supported. Using IP fallback.');
      fallbackToIP();
    }
  }, [token]);

  return (
    <LocationContext.Provider value={{ token, error, locationFetched }}>
      {children}
    </LocationContext.Provider>
  );
};
