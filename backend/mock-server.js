import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 1337;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock server is running' });
});

app.get('/api/v1/songs', (req, res) => {
  res.json({ songs: mockSongs });
});

// Stream song endpoint
app.get('/api/v1/stream/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    // Set appropriate content type
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(500).json({ error: 'Error streaming file' });
    });
  } else {
    // If file doesn't exist, return a 404
    res.status(404).json({
      message: 'Audio file not found',
      requestedFile: filename
    });
  }
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

// Song upload endpoint
app.post('/api/v1/song/upload', upload.single('file'), (req, res) => {
  try {
    const { title, artist, album, description } = req.body;

    // Validate required fields
    if (!title || !artist || !req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, artist, and audio file are required'
      });
    }

    // Create new song object
    const newSong = {
      _id: Date.now().toString(),
      title,
      artist,
      album: album || 'Unknown Album',
      description: description || '',
      song: req.file.filename,
      file: req.file.filename,
      uploadedBy: 'user1', // Mock user ID
      uploadedAt: new Date().toISOString()
    };

    // Add to mock songs array
    mockSongs.push(newSong);

    res.status(201).json({
      status: 'success',
      message: 'Song uploaded successfully',
      song: newSong
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during upload'
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
