import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PlaylistCard from "../components/PlaylistCard";
import LoadingSpinner from "../components/LoadingSpinner";

//Importing Context
import { SidebarContext } from "../Context/SibebarContext";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import { QueueContext } from "../Context/QueueContex";

import { GrFormAdd } from "react-icons/gr";


const CreatePlaylist = () => {
  const {fetchPlaylist, setFetchPlaylist} = useContext(FetchContext)
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const {__URL__} = useContext(SongContext)
  const {list} = useContext(QueueContext)
  console.log(list)
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState(null);
  const [loading, setLoading] = useState(false);

  // Open Create playlist modal
  const openModal = () => {
    console.log("Opening create playlist modal");
    setShowModal(true);
  };

  // Close create playlist modal
  const closeModal = () => {
    console.log("Closing create playlist modal");
    setShowModal(false);
  };

  let token = localStorage.getItem("access_token") || null;
  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Token": localStorage.getItem("access_token"),
  };

  // Create a playlist
  const handleCreatePlaylist = async () => {
    try {
      if(!token) {
        alert("Please login to create a playlist");
        return;
      }

      const playlistName = document.getElementById("playlistName").value;
      if (playlistName === "") {
        alert("Please enter a playlist name");
        return;
      }

      console.log("Creating playlist:", playlistName);
      console.log("Sending request to:", `${__URL__}/api/v1/playlist/create`);
      console.log("With headers:", headers);

      const response = await axios.post(
        `${__URL__}/api/v1/playlist/create`,
        { playlistName },
        { headers }
      );

      console.log("Create playlist response:", response);

      if(response.status === 200){
        console.log("Playlist created successfully:", response.data);
        alert("Playlist created successfully");

        // Update the FetchContext to trigger a refresh
        if (setFetchPlaylist) {
          console.log("Toggling fetchPlaylist state to refresh playlists");
          setFetchPlaylist(prev => !prev);
        } else {
          console.log("setFetchPlaylist not available, manually fetching playlists");
          // Fallback: manually fetch playlists
          fetchPlaylists();
        }

        // Close the modal
        closeModal();
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Error creating playlist: " + (error.response?.data?.message || error.message || "Unknown error"));
    }
  };

  // fetching playlists
  const fetchPlaylists = async () => {
    try {
      console.log("Fetching playlists from:", `${__URL__}/api/v1/playlist`);
      setLoading(true);

      const { data } = await axios.get(`${__URL__}/api/v1/playlist`, {
        headers,
      });

      console.log("Playlists received:", data["playlists"]);
      setPlaylists(data["playlists"]);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      alert("Error fetching playlists: " + (error.response?.data?.message || error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showMenu) setShowMenu(false);
    fetchPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPlaylist, __URL__]);

  return (
    <div className="bg-dark text-text-primary flex justify-start flex-col p-5 space-y-6 min-h-screen pb-32">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display">My Playlists</h2>

        {/* <---------------------------Create playlist button-----------------> */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            console.log("Button clicked");
            openModal();
          }}
          className="btn-primary flex items-center gap-2 shadow-md px-4 py-2 rounded-lg"
        >
          <GrFormAdd className="text-white" size={20} />
          <span>Create Playlist</span>
        </motion.button>
      </div>

      {/* <---------------------------Playlist cards-----------------> */}
      {loading && playlists == null ? (
        <div className="py-10">
          <LoadingSpinner size="lg" text="Loading playlists..." />
        </div>
      ) : !loading && playlists && playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="aspect-square">
              <PlaylistCard
                playlistName={playlist.playlistName}
                playlistId={playlist._id}
                noSongs={playlist.songs.length}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-20 text-2xl text-text-secondary">
          No Playlists Found
        </div>
      )}
      {/* <---------------------------Card modal-----------------> */}

      {/* Create PlayList Card */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-card p-8 flex flex-col space-y-6 rounded-xl relative shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display">Create New Playlist</h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              id="playlistName"
              placeholder="Playlist Name"
              className="input w-full"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreatePlaylist}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              Create Playlist
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;
