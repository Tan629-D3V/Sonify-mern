import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiMusic, FiPlus, FiCheck } from 'react-icons/fi';
import { SongContext } from '../Context/SongContext';
import { FetchContext } from '../Context/FetchContext';

const AddToPlaylistModal = ({ song, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { __URL__ } = useContext(SongContext);
  const { setFetchPlaylist } = useContext(FetchContext);
  
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    'X-Auth-Token': token,
  };
  
  // Fetch user's playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!token) {
          setError('You need to be logged in to view your playlists');
          setLoading(false);
          return;
        }
        
        const { data } = await axios.get(`${__URL__}/api/v1/playlist`, { headers });
        setPlaylists(data.playlists || []);
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError('Failed to load playlists. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaylists();
  }, [__URL__, token]);
  
  // Handle adding song to playlist
  const handleAddToPlaylist = async (playlistId) => {
    try {
      setAddingToPlaylist(true);
      setError(null);
      setSuccess(null);
      
      if (!token) {
        setError('You need to be logged in to add songs to playlists');
        return;
      }
      
      // Format the song data as expected by the API
      const songData = [{
        title: song.title,
        artistName: song.artistName,
        songSrc: song.songSrc
      }];
      
      const response = await axios.post(
        `${__URL__}/api/v1/playlist/add/${playlistId}`,
        songData,
        { headers }
      );
      
      if (response.status === 200) {
        setSuccess(`Added "${song.title}" to playlist`);
        setSelectedPlaylist(playlistId);
        
        // Update the playlist context to refresh playlists
        if (setFetchPlaylist) {
          setFetchPlaylist(prev => !prev);
        }
        
        // Close the modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error adding song to playlist:', err);
      setError('Failed to add song to playlist. Please try again.');
    } finally {
      setAddingToPlaylist(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-card p-6 rounded-xl shadow-xl max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-display">Add to Playlist</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-primary transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Song info */}
        <div className="flex items-center space-x-3 p-3 bg-dark-lighter rounded-lg mb-4">
          <div className="w-12 h-12 bg-dark-accent rounded-md flex items-center justify-center flex-shrink-0">
            <FiMusic className="text-primary text-xl" />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-medium truncate">{song.title}</h4>
            <p className="text-text-secondary text-sm truncate">{song.artistName}</p>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {/* Success message */}
        {success && (
          <div className="bg-green-900 bg-opacity-20 text-green-400 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        
        {/* Playlists list */}
        <div className="max-h-60 overflow-y-auto mb-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse-slow text-primary">Loading playlists...</div>
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <p>You don't have any playlists yet.</p>
              <p className="text-sm mt-2">Create a playlist first to add songs.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  disabled={addingToPlaylist || selectedPlaylist === playlist._id}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedPlaylist === playlist._id
                      ? 'bg-primary bg-opacity-20 text-primary'
                      : 'hover:bg-dark-lighter'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-dark-accent rounded-md flex items-center justify-center flex-shrink-0">
                      <FiMusic className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{playlist.playlistName}</p>
                      <p className="text-text-secondary text-xs">
                        {playlist.songs?.length || 0} songs
                      </p>
                    </div>
                  </div>
                  
                  {selectedPlaylist === playlist._id ? (
                    <FiCheck className="text-primary text-xl" />
                  ) : (
                    <FiPlus className="text-text-secondary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddToPlaylistModal;
