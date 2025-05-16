import React, { useState, useContext, useEffect } from 'react';
import { SongContext } from '../Context/SongContext';
import { checkBackendStatus } from '../utils/checkBackendStatus';

const BackendSettings = ({ onClose }) => {
  const { __URL__, updateBackendUrl } = useContext(SongContext);
  const [newUrl, setNewUrl] = useState(__URL__);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleCheck = async () => {
    setIsChecking(true);
    setCheckResult(null);
    
    try {
      const isRunning = await checkBackendStatus(newUrl);
      setCheckResult({
        success: isRunning,
        message: isRunning 
          ? `Successfully connected to ${newUrl}` 
          : `Could not connect to ${newUrl}. Please make sure the server is running.`
      });
    } catch (error) {
      setCheckResult({
        success: false,
        message: `Error checking connection: ${error.message}`
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    updateBackendUrl(newUrl);
    onClose();
    // Reload the page to apply the new URL
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-dark-card p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-display mb-4">Backend Settings</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="backendUrl">
            Backend Server URL
          </label>
          <input
            type="text"
            id="backendUrl"
            className="input w-full"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="http://localhost:1337"
          />
          <p className="text-text-secondary text-xs mt-1">
            Default: http://localhost:1337
          </p>
        </div>
        
        {checkResult && (
          <div className={`p-3 rounded-lg mb-4 ${
            checkResult.success ? 'bg-green-900 bg-opacity-20 text-green-400' : 'bg-red-900 bg-opacity-20 text-red-400'
          }`}>
            {checkResult.message}
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="btn-secondary"
          >
            {isChecking ? 'Checking...' : 'Test Connection'}
          </button>
          
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="btn-primary"
              disabled={isChecking}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendSettings;
