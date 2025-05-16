import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiMusic, FiPlus, FiCheck, FiSearch } from 'react-icons/fi';
import { SongContext } from '../Context/SongContext';
import { FetchContext } from '../Context/FetchContext';
import LoadingSpinner from './LoadingSpinner';

const AddSongModal = ({ playlistId, onClose }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [addingSongs, setAddingSongs] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { __URL__ } = useContext(SongContext);
  const { setFetchPlaylist } = useContext(FetchContext);
  
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    'X-Auth-Token': token,
  };
  
  // Fetch available songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!token) {
          setError('You need to be logged in to add songs to playlists');
          setLoading(false);
          return;
        }
        
        const { data } = await axios.get(`${__URL__}/api/v1/songs`);
        setSongs(data.songs || []);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSongs();
  }, [__URL__, token]);
  
  // Handle song selection
  const toggleSongSelection = (song) => {
    if (selectedSongs.some(s => s._id === song._id)) {
      setSelectedSongs(selectedSongs.filter(s => s._id !== song._id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };
  
  // Handle adding songs to playlist
  const handleAddSongsToPlaylist = async () => {
    if (selectedSongs.length === 0) {
      setError('Please select at least one song to add');
      return;
    }
    
    try {
      setAddingSongs(true);
      setError(null);
      setSuccess(null);
      
      if (!token) {
        setError('You need to be logged in to add songs to playlists');
        return;
      }
      
      // Format the song data as expected by the API
      const songsToAdd = selectedSongs.map(song => ({
        title: song.title,
        artistName: song.artist,
        songSrc: song.song
      }));
      
      // Add songs one by one to the playlist
      for (const songData of songsToAdd) {
        await axios.post(
          `${__URL__}/api/v1/playlist/add/${playlistId}`,
          [songData], // API expects an array with one song
          { headers }
        );
      }
      
      setSuccess(`Added ${selectedSongs.length} song${selectedSongs.length > 1 ? 's' : ''} to playlist`);
      
      // Update the playlist context to refresh playlists
      if (setFetchPlaylist) {
        setFetchPlaylist(prev => !prev);
      }
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error adding songs to playlist:', err);
      setError('Failed to add songs to playlist. Please try again.');
    } finally {
      setAddingSongs(false);
    }
  };
  
  // Filter songs based on search term
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-card p-6 rounded-xl shadow-xl max-w-md w-full mx-auto max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-display">Add Songs to Playlist</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-primary transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Search input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-lighter border-none rounded-lg focus:ring-1 focus:ring-primary"
          />
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
        
        {/* Songs list */}
        <div className="flex-grow overflow-y-auto mb-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="md" color="primary" />
            </div>
          ) : filteredSongs.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              {searchTerm ? (
                <p>No songs found matching "{searchTerm}"</p>
              ) : (
                <p>No songs available to add</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSongs.map((song) => (
                <button
                  key={song._id}
                  onClick={() => toggleSongSelection(song)}
                  disabled={addingSongs}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedSongs.some(s => s._id === song._id)
                      ? 'bg-primary bg-opacity-20 text-primary'
                      : 'hover:bg-dark-lighter'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-dark-accent rounded-md flex items-center justify-center flex-shrink-0">
                      <FiMusic className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[180px]">{song.title}</p>
                      <p className="text-text-secondary text-xs truncate max-w-[180px]">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                  
                  {selectedSongs.some(s => s._id === song._id) ? (
                    <FiCheck className="text-primary text-xl" />
                  ) : (
                    <FiPlus className="text-text-secondary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={addingSongs}
            className="px-4 py-2 rounded-lg bg-dark-lighter hover:bg-dark-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSongsToPlaylist}
            disabled={addingSongs || selectedSongs.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedSongs.length === 0
                ? 'bg-dark-accent text-text-secondary cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-light'
            } transition-colors`}
          >
            {addingSongs && <LoadingSpinner size="sm" color="white" />}
            {addingSongs ? 'Adding...' : `Add ${selectedSongs.length ? `(${selectedSongs.length})` : ''}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddSongModal;
