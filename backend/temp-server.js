/**
 * Music Groovo - Temporary Backend Server
 * Developed by Tan629
 * A temporary server for testing purposes
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(path.resolve(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Simple JWT middleware for protected routes
const userJwtMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // In a real app, we would verify the token
  // For our simplified backend, we'll just check if it exists
  req.userId = "user1"; // Mock user ID
  next();
};

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(path.resolve(), 'public')));

// Mock data for songs
const mockSongs = [
  {
    _id: "1",
    title: "Sample Song 1",
    artist: "Artist 1",
    album: "Album 1",
    song: "sample1.mp3", // This is the field used by the frontend for streaming
    file: "sample1.mp3", // This is used for file operations
    uploadedBy: "user1"  // Changed from userId to match frontend expectations
  },
  {
    _id: "2",
    title: "Sample Song 2",
    artist: "Artist 2",
    album: "Album 2",
    song: "sample2.mp3", // This is the field used by the frontend for streaming
    file: "sample2.mp3", // This is used for file operations
    uploadedBy: "user2"  // Changed from userId to match frontend expectations
  }
];

// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Get all songs
app.get('/api/v1/songs', (req, res) => {
  res.json({ songs: mockSongs });
});

// Auth routes
app.post('/api/v1/auth/login', (req, res) => {
  // Match the expected response format from the original backend
  res.json({
    message: 'User logged in',
    status: 'success',
    token: "mock-token-12345"
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  // Match the expected response format from the original backend
  res.json({
    message: "user registered",
    status: "success"
  });
});

// Stream song (serves the actual audio file)
app.get('/api/v1/stream/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(path.resolve(), 'uploads', filename);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    // Set appropriate content type
    res.setHeader('Content-Type', 'audio/mpeg');
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // If file doesn't exist, return a 404
    res.status(404).json({
      message: 'File not found',
      requestedFile: filename
    });
  }
});

// Mock playlists data
const mockPlaylists = [
  {
    _id: "playlist1",
    playlistName: "My Favorite Songs", // Changed from 'name' to 'playlistName' to match frontend expectations
    userId: "user1",
    songs: [
      {
        title: "Sample Song 1",
        artistName: "Artist 1",
        songSrc: "sample1.mp3"
      },
      {
        title: "Sample Song 2",
        artistName: "Artist 2",
        songSrc: "sample2.mp3"
      }
    ]
  }
];

// Playlist routes
app.post('/api/v1/playlist/create', userJwtMiddleware, (req, res) => {
  const { playlistName } = req.body;

  // Create a new playlist object
  const newPlaylist = {
    _id: `playlist${Date.now()}`,
    playlistName: playlistName, // Changed from 'name' to 'playlistName' to match frontend expectations
    userId: req.userId,
    songs: []
  };

  // Add the new playlist to the mockPlaylists array
  mockPlaylists.push(newPlaylist);

  console.log('Created new playlist:', newPlaylist);
  console.log('Updated playlists:', mockPlaylists);

  // Return success response with status 200 to match frontend expectation
  res.status(200).json({
    message: 'Playlist created successfully',
    status: 'success',
    playlist: newPlaylist
  });
});

app.get('/api/v1/playlist', userJwtMiddleware, (req, res) => {
  res.json({
    playlists: mockPlaylists
  });
});

app.get('/api/v1/playlist/:id', userJwtMiddleware, (req, res) => {
  const playlist = mockPlaylists.find(p => p._id === req.params.id);
  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }
  res.json({
    playlist
  });
});

// Remove song from playlist endpoint
app.delete('/api/v1/playlist/remove/:id', userJwtMiddleware, (req, res) => {
  try {
    // Get the playlist ID from the URL params
    const playlistId = req.params.id;

    // Get the song title from query params
    const songTitle = req.query.song;

    if (!songTitle) {
      return res.status(400).json({
        message: 'Song title is required',
        status: 'error'
      });
    }

    // Find the playlist in our mock data
    const playlistIndex = mockPlaylists.findIndex(p => p._id === playlistId);

    // If playlist not found, return 404
    if (playlistIndex === -1) {
      return res.status(404).json({
        message: 'Playlist not found',
        status: 'error'
      });
    }

    // Find the song index in the playlist
    const songIndex = mockPlaylists[playlistIndex].songs.findIndex(
      song => song.title === songTitle
    );

    // If song not found in playlist, return 404
    if (songIndex === -1) {
      return res.status(404).json({
        message: 'Song not found in playlist',
        status: 'error'
      });
    }

    // Remove the song from the playlist
    mockPlaylists[playlistIndex].songs.splice(songIndex, 1);

    console.log(`Removed song "${songTitle}" from playlist "${mockPlaylists[playlistIndex].playlistName}"`);

    // Return success response
    return res.status(200).json({
      message: 'Song removed from playlist successfully',
      status: 'success',
      playlist: mockPlaylists[playlistIndex]
    });
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    return res.status(500).json({
      message: 'Server error',
      status: 'error'
    });
  }
});

// Add song to playlist endpoint
app.post('/api/v1/playlist/add/:id', userJwtMiddleware, (req, res) => {
  try {
    // Get the playlist ID from the URL params
    const playlistId = req.params.id;

    // Find the playlist in our mock data
    const playlistIndex = mockPlaylists.findIndex(p => p._id === playlistId);

    // If playlist not found, return 404
    if (playlistIndex === -1) {
      return res.status(404).json({
        message: 'Playlist not found',
        status: 'error'
      });
    }

    // Get the song data from the request body
    const songData = req.body[0]; // The frontend sends an array with one song

    // Validate song data
    if (!songData || !songData.title || !songData.artistName || !songData.songSrc) {
      return res.status(400).json({
        message: 'Invalid song data. Title, artist name, and song source are required.',
        status: 'error'
      });
    }

    // Check if song already exists in the playlist
    const songExists = mockPlaylists[playlistIndex].songs.some(
      song => song.title === songData.title && song.songSrc === songData.songSrc
    );

    if (songExists) {
      return res.status(400).json({
        message: 'This song is already in the playlist',
        status: 'error'
      });
    }

    // Add the song to the playlist
    mockPlaylists[playlistIndex].songs.push(songData);

    console.log(`Added song "${songData.title}" to playlist "${mockPlaylists[playlistIndex].playlistName}"`);

    // Return success response
    return res.status(200).json({
      message: 'Song added to playlist successfully',
      status: 'success',
      playlist: mockPlaylists[playlistIndex]
    });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    return res.status(500).json({
      message: 'Server error',
      status: 'error'
    });
  }
});

// Song upload endpoint
app.post('/api/v1/song/upload', userJwtMiddleware, upload.single('file'), (req, res) => {
  try {
    // Extract data from request
    const { title, artist, album, description } = req.body;

    // Validate required fields
    if (!title || !artist || !album || !description || !req.file) {
      return res.status(400).json({
        message: 'Please provide all required fields',
        status: 'error'
      });
    }

    // In a real app, we would save this to a database
    // For our simplified backend, we'll just add it to our mockSongs array
    const newSong = {
      _id: Date.now().toString(),
      title,
      artist,
      album,
      description,
      song: req.file.filename, // This is the field used by the frontend for streaming
      file: req.file.filename, // This is used for file operations
      uploadedBy: req.userId,  // Changed from userId to match frontend expectations
      uploadedAt: new Date().toISOString()
    };

    mockSongs.push(newSong);

    // Return success response
    return res.status(201).json({
      message: 'Song uploaded successfully',
      status: 'success',
      song: newSong
    });
  } catch (error) {
    console.error('Error uploading song:', error);
    return res.status(500).json({
      message: 'Server error',
      status: 'error'
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Fallback to index.html for SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Start the server
app.listen(1337, () => {
  console.log(`Server is running at localhost:1337`);
});
