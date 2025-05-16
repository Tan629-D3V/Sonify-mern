import React, { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SongContext } from "../Context/SongContext";
import playlist from "../assets/playlist.jpg";
import { CgPlayListAdd } from "react-icons/cg";
import { FiMusic } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";


const PlaylistCard = ({playlistName,playlistId,noSongs}) => {
    const {setFetchPlaylist} = useContext(FetchContext)
    const {song,songList,setSongList,__URL__} = useContext(SongContext)
    const {list,dispatchList} = useContext(QueueContext)

    const [loading,setLoading] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // Adding song to playlist
    const addSongToPlaylist = async () => {
        if(list.length === 0) return alert("Please select a song");
        setLoading(true)
        const headers = {
            "Content-Type": "application/json",
            "X-Auth-Token": localStorage.getItem("access_token"),
            };
        const {data,status} = await axios.post(`${__URL__}/api/v1/playlist/add/${playlistId}`,list,{headers})
        if(status === 200){
            alert("Song added to playlist")
            setFetchPlaylist(prev => !prev)
            dispatchList({type:"REMOVE_SONG",payload:list[0]['title']})
        }
        setLoading(false)
    }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card w-full h-full flex flex-col relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/playlist/${playlistId}`}
        className="flex flex-col flex-grow"
      >
        <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden shadow-md group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-card opacity-60"></div>
          <img src={playlist} alt={playlistName} className="w-full h-full object-cover" />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
              <FiMusic className="text-primary text-4xl" />
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-dark-card bg-opacity-80 rounded-full p-1.5">
            <p className="text-xs font-medium">{noSongs} songs</p>
          </div>
        </div>
        <h3 className="font-medium text-lg truncate">{playlistName}</h3>
      </Link>
      <div className="mt-2 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={addSongToPlaylist}
          className="p-2 rounded-full hover:bg-dark-lighter text-text-secondary hover:text-primary transition-colors"
          title="Add song to playlist"
        >
          <CgPlayListAdd size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
