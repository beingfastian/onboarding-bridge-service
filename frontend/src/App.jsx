import React, { useEffect, useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import { checkHealth } from './api/onboard';

/**
 * Main App Component
 * Checks API health and renders registration form
 */
function App() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    // Check if backend API is available
    const checkApi = async () => {
      try {
        await checkHealth();
        setApiStatus('connected');
        console.log('✓ Backend API is connected');
      } catch (error) {
        setApiStatus('disconnected');
        console.warn('⚠ Backend API is unavailable:', error.message);
      }
    };

    checkApi();
  }, []);

  return (
    <div>
      {apiStatus === 'disconnected' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px',
          background: '#fee2e2',
          color: '#991b1b',
          textAlign: 'center',
          fontSize: '14px',
          zIndex: 1000,
        }}>
          ⚠️ Backend API is unavailable. Please start the backend server.
        </div>
      )}

      <RegistrationForm />
    </div>
  );
}

export default App;
