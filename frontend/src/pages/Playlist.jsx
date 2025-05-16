import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import PlaylilstSong from "../components/PlaylilstSong";
import LoadingSpinner from "../components/LoadingSpinner";
import { MdDeleteForever } from "react-icons/md";
import { FiMusic, FiPlus } from "react-icons/fi";
import playlist from "../assets/playlist.jpg";
import AddSongModal from "../components/AddSongModal";

const Playlist = () => {
  const { id } = useParams();  //gettnig the id from the url
  const navigate = useNavigate(); // for navigation
  const [playList, setPlayList] = useState(null); // state for the playlist
  const [loading, setLoading] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const {fetchPlaylist} = useContext(FetchContext)
  const {__URL__} = useContext(SongContext)

  // headers for the api calls
  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Token": localStorage.getItem("access_token"),
  };

  // delete playlist
  const deletePlaylist = async () => {
    try {
      setLoading(true);
      const { data, status } = await axios.delete(
        `${__URL__}/api/v1/playlist/delete/${id}`,
        { headers }
      );
      if (status === 200) {
        alert("Playlist deleted successfully");
        navigate("/playlists");
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      alert('Error deleting playlist: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // confirm delete and handle delete
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist();
    }
  };

  // get playlist
  const getPlaylist = async () => {
    const { data } = await axios.get(
      `${__URL__}/api/v1/playlist/${id}`,
      { headers }
    );
    setPlayList(data["playlist"]);
  };

  // fetch playlist on load
  useEffect(() => {
    getPlaylist();
  }, [fetchPlaylist]);

  if (loading || playList === null) {
    return (
      <div className="min-h-screen bg-dark">
        <LoadingSpinner size="lg" text="Loading playlist..." fullScreen={true} />
      </div>
    );
  }

  if (!loading && playList !== null) {
    return (
      <>
        <div className="bg-dark text-text-primary p-5 min-h-screen">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
              {/* Playlist Cover and Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full md:w-64 flex-shrink-0"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg mb-4">
                  <img src={playlist} alt={playList.playlistName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <FiMusic className="text-primary text-xl" />
                    <span className="text-sm font-medium">{playList.songs.length} songs</span>
                  </div>
                </div>
              </motion.div>

              {/* Playlist Details */}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-display mb-2">{playList.playlistName}</h1>
                    <p className="text-text-secondary">
                      {playList.songs.length} {playList.songs.length === 1 ? 'song' : 'songs'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAddSongModal(true)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-light transition-colors"
                      title="Add song to playlist"
                    >
                      <FiPlus size={18} />
                      <span>Add Song</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDelete}
                      className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-red-500 transition-colors"
                      title="Delete playlist"
                    >
                      <MdDeleteForever size={24} />
                    </motion.button>
                  </div>
                </div>

                {/* Songs List */}
                <div className="space-y-2">
                  {playList.songs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-text-secondary">
                      <FiMusic size={48} className="mb-4 text-dark-accent" />
                      <p className="text-lg">This playlist is empty</p>
                      <p className="text-sm">Add songs to get started</p>
                    </div>
                  ) : (
                    <div className="bg-dark-lighter rounded-xl overflow-hidden">
                      {playList.songs.map((song, index) => (
                        <PlaylilstSong
                          key={index}
                          title={song.title}
                          artistName={song.artistName}
                          songSrc={song.songSrc}
                          playlistId={id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Song Modal */}
        {showAddSongModal && (
          <AddSongModal
            playlistId={id}
            onClose={() => setShowAddSongModal(false)}
          />
        )}
      </>
    );
  }

  return null;
};

export default Playlist;
