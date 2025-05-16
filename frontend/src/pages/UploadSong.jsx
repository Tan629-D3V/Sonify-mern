import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SidebarContext } from "../Context/SibebarContext";
import { useNavigate } from "react-router-dom";
import { SongContext } from "../Context/SongContext";
import LoadingSpinner from "../components/LoadingSpinner";
const UploadSong = () => {
  const navigate = useNavigate();
  // we are using this to close the sidebar when we land on this page
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const {__URL__} = useContext(SongContext)

  // we are using this to upload the file
  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState(null);
  const [title, setTitle] = useState();
  const [artist, setArtist] = useState();
  const [album, setAlbum] = useState();
  const [description, setDescription] = useState();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (showMenu) setShowMenu(false);

    // Cleanup function to revoke object URL when component unmounts
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [showMenu, filePreview]);

  // we are using this to handle the file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a preview for audio files
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFilePreview(fileURL);

      // Auto-fill title field based on filename if title is not already set
      if (!title) {
        // Remove file extension and replace hyphens/underscores with spaces
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
        setTitle(fileName);
      }
    } else {
      setFilePreview(null);
    }
  };

  // we are using this to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Check if file is selected
      if (!file) {
        alert("Please select an audio file to upload");
        setIsUploading(false);
        return;
      }

      console.log("Uploading file:", file.name);
      console.log("Title:", title);
      console.log("Artist:", artist);

      // Check backend connection before attempting upload
      try {
        console.log("Testing backend connection at:", __URL__);
        await axios.get(`${__URL__}/api/v1/health`, { timeout: 5000 });
      } catch (connectionError) {
        console.error("Backend connection test failed:", connectionError);
        alert(`Cannot connect to the backend server at ${__URL__}. Please make sure the server is running.`);
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("album", album);
      formData.append("description", description);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
          "x-auth-token": localStorage.getItem("access_token"),
        },
        timeout: 30000 // 30 seconds timeout for large files
      };

      console.log("Sending request to:", `${__URL__}/api/v1/song/upload`);

      const result = await axios.post(
        `${__URL__}/api/v1/song/upload`,
        formData,
        config
      );

      // if the file is uploaded successfully, we will redirect the user to the home page with alert message
      if (result.status === 201) {
        alert("File uploaded successfully");
        navigate("/explore");
      }
    } catch (error) {
      console.error("Error uploading song:", error);

      if (error.message === "Network Error") {
        alert(`Network Error: Cannot connect to the backend server at ${__URL__}. Please make sure the server is running on port 1337.`);
      } else {
        alert("Error uploading song: " + (error.response?.data?.message || error.message || "Unknown error"));
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-dark text-text-primary px-5">
      <div className="container max-w-4xl">
        <h1 className="text-2xl font-bold text-center lg:text-3xl font-display mb-4">Upload Song</h1>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-dark-card p-5 rounded-xl shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="input w-full py-1.5"
                  placeholder="Enter the song title"
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1" htmlFor="artist">
                  Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  id="artist"
                  className="input w-full py-1.5"
                  placeholder="Enter the artist name"
                  onChange={(e) => setArtist(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1" htmlFor="album">
                  Album
                </label>
                <input
                  type="text"
                  name="album"
                  id="album"
                  className="input w-full py-1.5"
                  placeholder="Enter the album name"
                  onChange={(e) => setAlbum(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="input w-full py-1.5 h-[60px] resize-none"
                  placeholder="Enter a description for the song"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <label className="text-sm font-medium block mb-1" htmlFor="audioFile">
                  Audio File
                </label>
                <div className="bg-dark-lighter border border-dark-accent rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-dark-accent transition-colors h-[180px]">
                  <input
                    onChange={handleFileChange}
                    type="file"
                    id="audioFile"
                    name="file"
                    accept="audio/*"
                    className="hidden"
                    required
                  />
                  {filePreview ? (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="bg-dark-card p-2 rounded-lg mb-2 w-full">
                        <audio controls className="w-full h-8" src={filePreview}>
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-text-primary text-sm truncate max-w-[80%]">{file.name}</span>
                        <label htmlFor="audioFile" className="text-primary text-xs hover:underline">Change</label>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="audioFile" className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-text-primary text-center px-2">Click to select audio file</span>
                      <span className="text-text-secondary text-xs mt-1">MP3, WAV, OGG, etc.</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-2 flex items-center justify-center gap-2"
                  type="submit"
                  disabled={!localStorage.getItem("access_token") || isUploading}
                >
                  {isUploading && <LoadingSpinner size="sm" color="white" />}
                  {localStorage.getItem("access_token")
                    ? isUploading ? "Uploading..." : "Upload Song"
                    : "Login to Upload"}
                </motion.button>

                {!localStorage.getItem("access_token") && (
                  <p className="text-text-secondary text-center text-xs mt-2">You need to be logged in to upload songs</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadSong;
