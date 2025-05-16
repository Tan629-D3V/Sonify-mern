import React, { useEffect, useState, useContext } from 'react';
import { SongContext } from '../Context/SongContext';
import { checkBackendStatus } from '../utils/checkBackendStatus';
import BackendSettings from './BackendSettings';
import LoadingSpinner from './LoadingSpinner';

const BackendStatus = () => {
  const { __URL__ } = useContext(SongContext);
  const [isBackendRunning, setIsBackendRunning] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      const status = await checkBackendStatus(__URL__);
      setIsBackendRunning(status);
      setIsChecking(false);
    };

    checkStatus();

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, [__URL__]);

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  if (isChecking) {
    return (
      <div className="fixed bottom-5 left-5 bg-dark-card p-3 rounded-lg shadow-lg z-50 text-sm">
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" color="primary" />
          <span className="text-text-secondary">Checking backend connection...</span>
        </div>
        <button
          onClick={openSettings}
          className="mt-2 text-primary text-xs hover:underline"
        >
          Configure Backend
        </button>
        {showSettings && <BackendSettings onClose={closeSettings} />}
      </div>
    );
  }

  if (isBackendRunning === false) {
    return (
      <div className="fixed bottom-5 left-5 bg-dark-card p-3 rounded-lg shadow-lg z-50 text-sm">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <span className="text-red-400">
            Backend server is not running at {__URL__}
          </span>
        </div>
        <div className="mt-2 text-text-secondary text-xs">
          Please start the backend server to enable uploads and other features.
        </div>
        <button
          onClick={openSettings}
          className="mt-2 text-primary text-xs hover:underline"
        >
          Configure Backend
        </button>
        {showSettings && <BackendSettings onClose={closeSettings} />}
      </div>
    );
  }

  // Show a minimal indicator when backend is running
  return (
    <div className="fixed bottom-5 left-5 bg-dark-card p-2 rounded-lg shadow-lg z-50 text-sm opacity-70 hover:opacity-100 transition-opacity">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <button
          onClick={openSettings}
          className="text-text-secondary text-xs hover:text-primary"
        >
          Backend Connected
        </button>
      </div>
      {showSettings && <BackendSettings onClose={closeSettings} />}
    </div>
  );
};

export default BackendStatus;
