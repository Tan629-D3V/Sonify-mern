import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SongContext } from "../Context/SongContext";
import LoadingSpinner from "../components/LoadingSpinner";
import stereo from "../assets/stereo.jpg";
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumeX, FiMaximize, FiMinimize
} from "react-icons/fi";

const AudioPlayer = () => {
  const { song, audio } = useContext(SongContext);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (song.isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      cancelAnimationFrame(animationRef.current);
    };
  }, [audio, song.isPlaying]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (song.songUrl === "") return;

    if (audio.paused) {
      audio.play();
      song.setIsPlaying(true);
      animationRef.current = requestAnimationFrame(() => {
        setCurrentTime(audio.currentTime);
        animationRef.current = requestAnimationFrame(animationRef.current);
      });
    } else {
      audio.pause();
      song.setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Handle progress bar change
  const handleProgressChange = (e) => {
    const value = e.target.value;
    setCurrentTime(value);
    audio.currentTime = value;
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const value = e.target.value;
    setVolume(value);
    audio.volume = value;
  };

  // Toggle mute
  const toggleMute = () => {
    if (audio.volume > 0) {
      audio.volume = 0;
      setVolume(0);
    } else {
      audio.volume = 1;
      setVolume(1);
    }
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`fixed bottom-4 left-4 right-4 bg-dark-card border border-dark-accent backdrop-blur-lg bg-opacity-95 shadow-lg transition-all duration-300 rounded-lg ${
          expanded ? "h-48 md:h-40" : "h-20"
        }`}
      >
        <div className="container mx-auto h-full px-4">
          <div className="flex items-center justify-between h-20">
            {/* Song Info */}
            <div className="flex items-center space-x-3 w-1/3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md">
                <img
                  src={stereo}
                  alt="Album Cover"
                  className="w-full h-full object-cover"
                />
                {song.isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <LoadingSpinner size="sm" color="white" />
                  </div>
                )}
              </div>
              <div className="truncate">
                <h3 className="font-medium truncate">{song.songName || "No song playing"}</h3>
                <p className="text-text-secondary text-sm truncate">{song.songArtist || "Artist"}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 w-1/3">
              <button
                className="text-text-secondary hover:text-primary transition-colors"
                aria-label="Previous Song"
              >
                <FiSkipBack size={20} />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full bg-primary hover:bg-primary-hover text-white transition-all transform hover:scale-105 active:scale-95"
                aria-label={song.isPlaying ? "Pause" : "Play"}
              >
                {song.isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </button>

              <button
                className="text-text-secondary hover:text-primary transition-colors"
                aria-label="Next Song"
              >
                <FiSkipForward size={20} />
              </button>
            </div>

            {/* Volume & Expand */}
            <div className="flex items-center justify-end space-x-3 w-1/3">
              <div className="relative">
                <button
                  onClick={() => setShowVolumeControl(!showVolumeControl)}
                  className="text-text-secondary hover:text-primary transition-colors"
                  aria-label="Volume"
                >
                  {volume > 0 ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
                </button>

                {showVolumeControl && (
                  <div className="absolute bottom-full mb-2 -left-12 p-2 bg-dark-card rounded-lg shadow-lg">
                    <input
                      ref={volumeBarRef}
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 accent-primary"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="text-text-secondary hover:text-primary transition-colors"
                aria-label={expanded ? "Minimize" : "Expand"}
              >
                {expanded ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
              </button>

              <div className="hidden md:block text-text-secondary text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Expanded View with Progress Bar */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="w-full">
                <input
                  ref={progressBarRef}
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-dark-accent rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-text-secondary text-xs mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioPlayer;
