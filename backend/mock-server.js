import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 1337;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock data
const mockSongs = [
  {
    _id: '1',
    title: 'Sonify Demo Song 1',
    artist: 'Sonify Artist',
    song: 'demo-song-1.mp3',
    uploadedBy: 'user1',
    file: 'demo-song-1.mp3'
  },
  {
    _id: '2',
    title: 'Sonify Demo Song 2',
    artist: 'Sonify Artist',
    song: 'demo-song-2.mp3',
    uploadedBy: 'user1',
    file: 'demo-song-2.mp3'
  },
  {
    _id: '3',
    title: 'Sonify Demo Song 3',
    artist: 'Sonify Artist',
    song: 'demo-song-3.mp3',
    uploadedBy: 'user1',
    file: 'demo-song-3.mp3'
  }
];

const mockPlaylists = [
  {
    _id: '1',
    playlistName: 'My Favorite Songs',
    songs: [
      {
        title: 'Sonify Demo Song 1',
        artistName: 'Sonify Artist',
        songSrc: 'demo-song-1.mp3'
      }
    ]
  },
  {
    _id: '2',
    playlistName: 'Workout Mix',
    songs: [
      {
        title: 'Sonify Demo Song 2',
        artistName: 'Sonify Artist',
        songSrc: 'demo-song-2.mp3'
      }
    ]
  }
];

// Routes
app.get('/api/v1/songs', (req, res) => {
  res.json({ songs: mockSongs });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (email && password) {
    res.json({
      status: 'success',
      token: 'mock-jwt-token-for-testing',
      user: {
        _id: 'user1',
        fullName: 'Test User',
        email: email
      }
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/v1/auth/register', (req, res) => {
  const { fullName, email, password } = req.body;
  
  // Simple validation
  if (fullName && email && password) {
    res.json({
      status: 'success',
      message: 'User registered successfully'
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'All fields are required'
    });
  }
});

app.get('/api/v1/playlist', (req, res) => {
  res.json({ playlists: mockPlaylists });
});

app.get('/api/v1/playlist/:id', (req, res) => {
  const playlist = mockPlaylists.find(p => p._id === req.params.id);
  
  if (playlist) {
    res.json({ playlist });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Playlist not found'
    });
  }
});

app.post('/api/v1/playlist/create', (req, res) => {
  const { playlistName } = req.body;
  
  if (playlistName) {
    const newPlaylist = {
      _id: Date.now().toString(),
      playlistName,
      songs: []
    };
    
    mockPlaylists.push(newPlaylist);
    
    res.json({
      status: 'success',
      message: 'Playlist created successfully',
      playlist: newPlaylist
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'Playlist name is required'
    });
  }
});

app.delete('/api/v1/playlist/delete/:id', (req, res) => {
  const playlistIndex = mockPlaylists.findIndex(p => p._id === req.params.id);
  
  if (playlistIndex !== -1) {
    mockPlaylists.splice(playlistIndex, 1);
    res.json({
      status: 'success',
      message: 'Playlist deleted successfully'
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Playlist not found'
    });
  }
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Sonify mock server running on port ${PORT}`);
});
