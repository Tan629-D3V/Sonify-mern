/**
 * Music Groovo - Mock Server
 * Developed by Tan629
 * A mock server for testing and development
 */

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
    title: 'Music Groovo Demo Song 1',
    artist: 'Music Groovo Artist',
    album: 'Demo Album 1',
    song: 'demo-song-1.mp3',
    description: 'A great demo song for testing'
  },
  {
    _id: '2',
    title: 'Music Groovo Demo Song 2',
    artist: 'Music Groovo Artist',
    album: 'Demo Album 2',
    song: 'demo-song-2.mp3',
    description: 'Another great demo song'
  },
  {
    _id: '3',
    title: 'Music Groovo Demo Song 3',
    artist: 'Music Groovo Artist',
    album: 'Demo Album 3',
    song: 'demo-song-3.mp3',
    description: 'The third demo song'
  }
];

const mockPlaylists = [
  {
    _id: '1',
    playlistName: 'My Favorites',
    songs: [
      {
        title: 'Music Groovo Demo Song 1',
        artistName: 'Music Groovo Artist',
        songSrc: 'demo-song-1.mp3'
      },
      {
        title: 'Music Groovo Demo Song 2',
        artistName: 'Music Groovo Artist',
        songSrc: 'demo-song-2.mp3'
      }
    ]
  }
];

// Routes
app.get('/api/v1/songs', (req, res) => {
  res.json({ songs: mockSongs });
});

app.get('/api/v1/playlist', (req, res) => {
  res.json({ playlists: mockPlaylists });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server is running' });
});

// Serve demo songs
app.get('/api/v1/stream/:filename', (req, res) => {
  const { filename } = req.params;
  const songPath = path.join(__dirname, 'uploads', filename);
  res.sendFile(songPath);
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Music Groovo mock server running on port ${PORT}`);
});
