import { createContext, useState, useRef, useEffect } from "react";

export const SongContext = createContext();

export const SongContextState = ({ children }) => {
  // Default backend URL - use environment variable if available
  const [backendUrl, setBackendUrl] = useState(
    import.meta.env.VITE_BACKEND_URL || "http://localhost:1337"
  );
  const audio = new Audio();

  // Try to load backend URL from localStorage
  useEffect(() => {
    const savedUrl = localStorage.getItem("backendUrl");
    if (savedUrl) {
      setBackendUrl(savedUrl);
    }
  }, []);

  // Function to update backend URL
  const updateBackendUrl = (newUrl) => {
    setBackendUrl(newUrl);
    localStorage.setItem("backendUrl", newUrl);
  };

  const song = {
    songUrl: "",
    songName: "",
    songArtist: "",
    songAlbum: "",
    isPlaying: false,

    setSongUrl: (url) => {
      song.songUrl = url;
    },
    setSongName: (name) => {
      song.songName = name;
    },
    setArtistName: (name) => {
      song.songArtist = name;
    },
    setAlbumName: (name) => song.songAlbum = name,
    setIsPlaying : ( val )=>{
      song.isPlaying = val
    },
  };

  return (
    <SongContext.Provider value={{
      audio,
      song,
      __URL__: backendUrl,
      updateBackendUrl
    }}>
      {children}
    </SongContext.Provider>
  );
};
