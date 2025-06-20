import React from 'react';
import Sidebar from './Sidebar';
const WelcomeAdmin = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa, #e1bee7, #fce4ec)',
      }}
    >
        <Sidebar/>
        <div className='sm-content-wrapper'>
                <div
        style={{
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          transform: 'translateY(0)',
          transition: 'transform 0.5s ease, box-shadow 0.5s ease',
          ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1a202c',
            marginBottom: '1rem',
          }}
        >
          Welcome to Administrator
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#4a5568',
          }}
        >
          Manage your services with ease and efficiency
        </p>
      </div>
        </div>
  
    </div>
  );
};

export default WelcomeAdmin;