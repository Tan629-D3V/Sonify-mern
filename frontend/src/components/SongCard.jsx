// This component is used to display the song card in the home page and the playlist page.

import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

// Importing context
import { SongContext } from "../Context/SongContext";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";

// Importing components
import AddToPlaylistModal from "./AddToPlaylistModal";

// Importing icons
import {
  FiPlay, FiMoreVertical, FiTrash2, FiList, FiSkipForward
} from "react-icons/fi";
import musicbg from "../assets/musicbg.jpg";

const SongCard = ({ title, artistName, songSrc, userId, songId, file }) => {
  // Using context
  const { song, audio, __URL__ } = useContext(SongContext);
  const { setFetchSong } = useContext(FetchContext);
  const { dispatchQueue, dispatchList } = useContext(QueueContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  let decoded;
  if (token) { decoded = decodeToken(token) };

  const [showOptions, setShowOptions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  // Play the song when the user clicks on the song card
  const handlePlay = () => {
    song.setSongName(title);
    song.setArtistName(artistName);
    song.setSongUrl(`${__URL__}/api/v1/stream/${songSrc}`);
    audio.src = `${__URL__}/api/v1/stream/${songSrc}`;
    audio.load();
    audio.play();
    song.setIsPlaying(true);
  };

  // Delete the song
  const deleteSong = async () => {
    const headers = {
      "x-auth-token": localStorage.getItem("access_token"),
    };

    const { status } = await axios.delete(
      `${__URL__}/api/v1/song/delete/${songId}?file=${file}`,
      { headers }
    );

    if (status === 200) setFetchSong(prev => !prev);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      deleteSong();
    }
    setShowOptions(false);
  };

  // Add the song to the playlist
  const handleAddToPlaylist = () => {
    if (!token) {
      alert("Please login to add songs to playlists");
      return;
    }

    setShowPlaylistModal(true);
    setShowOptions(false);
  };

  // Play the song next
  const handlePlayNext = () => {
    dispatchQueue({ type: 'ADD_TO_QUEUE', payload: { title, artistName, songSrc } });
    setShowOptions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card flex relative justify-between items-center p-3 mb-3 lg:w-[70vw] mx-auto hover:bg-dark-accent transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4 cursor-pointer flex-1" onClick={handlePlay}>
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-md">
          <img src={musicbg} alt={title} className="w-full h-full object-cover" />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
              <FiPlay className="text-white text-2xl" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="font-medium text-lg truncate">{title}</h3>
          <p className="text-text-secondary text-sm">{artistName}</p>
        </div>
      </div>

      {/* Desktop Options */}
      <div className="hidden lg:flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToPlaylist}
          className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-primary transition-colors"
          title="Add to playlist"
        >
          <FiList size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayNext}
          className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-primary transition-colors"
          title="Play next"
        >
          <FiSkipForward size={20} />
        </motion.button>

        {decoded && decoded.id === userId && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-red-500 transition-colors"
            title="Delete song"
          >
            <FiTrash2 size={20} />
          </motion.button>
        )}
      </div>

      {/* Mobile Options */}
      <div className="relative lg:hidden">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-primary transition-colors"
        >
          <FiMoreVertical size={20} />
        </button>

        {showOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-0 top-full mt-1 z-10 w-48 bg-dark-card rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex flex-col py-1">
              <button
                onClick={handleAddToPlaylist}
                className="flex items-center gap-2 px-4 py-2 hover:bg-dark-accent text-left"
              >
                <FiList size={16} />
                <span>Add to playlist</span>
              </button>

              <button
                onClick={handlePlayNext}
                className="flex items-center gap-2 px-4 py-2 hover:bg-dark-accent text-left"
              >
                <FiSkipForward size={16} />
                <span>Play next</span>
              </button>

              {decoded && decoded.id === userId && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-dark-accent text-red-400 text-left"
                >
                  <FiTrash2 size={16} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Add to Playlist Modal */}
      {showPlaylistModal && (
        <AddToPlaylistModal
          song={{ title, artistName, songSrc }}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </motion.div>
  );
};

export default SongCard;
