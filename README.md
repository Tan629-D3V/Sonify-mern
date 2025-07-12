# Music Groovo - Music Streaming App

Music Groovo is a modern, full-stack music streaming web application built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to register, log in, upload and stream songs, create and manage playlists, and enjoy music through a responsive and interactive interface.

---

## Features

- User registration and login with JWT authentication
- Upload, stream, and delete songs
- Create, view, and manage playlists
- Add or remove songs from playlists
- Persistent music player with play/pause/skip
- Responsive design for desktop and mobile
- Backend status and configuration from frontend
- Modern UI with Tailwind CSS and Framer Motion animations

---

## Tech Stack

**Frontend:**
- React.js
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- React Context API

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (file uploads)
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

---

## Folder Structure

```
Music/
├── backend/
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   ├── uploads/
│   └── public/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   ├── Context/
│   │   ├── pages/
│   │   └── utils/
│   └── public/
└── uploads/
```

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)

### Backend Setup
1. Navigate to the backend folder:
   ```pwsh
   cd backend
   ```
2. Install dependencies:
   ```pwsh
   npm install
   ```
3. Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/musicapp
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```pwsh
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```pwsh
   cd frontend
   ```
2. Install dependencies:
   ```pwsh
   npm install
   ```
3. Start the frontend development server:
   ```pwsh
   npm run dev
   ```
4. Open your browser and go to the URL shown in the terminal (usually http://localhost:5173).

---

## Usage
- Register a new account or log in.
- Upload songs from the Upload page.
- Create playlists and add songs to them.
- Play music using the persistent player at the bottom.
- Manage your playlists and songs from the dashboard.

---

## Project Structure Details

### Backend
- **server.js**: Main entry point, sets up Express, connects to MongoDB, loads routes.
- **controllers/**: Business logic for authentication, songs, and playlists.
- **models/**: Mongoose schemas for User, Song, Playlist.
- **routes/**: API endpoints for auth, songs, playlists.
- **middlewares/**: JWT authentication middleware.
- **uploads/**: Stores uploaded song files.

### Frontend
- **src/App.jsx**: Main React app, sets up routing and context providers.
- **src/components/**: UI components (Navbar, FooterNav, SongCard, PlaylistCard, etc.).
- **src/Context/**: React Contexts for global state (song, queue, sidebar, fetch triggers).
- **src/pages/**: Main screens/routes (Home, Songs, Playlist, CreatePlaylist, Login, Register, UploadSong).
- **src/utils/**: Utility components and functions (AudioPlayer, backend status checker, custom styles).

---

## Customization
- **Backend URL**: Can be configured from the frontend settings modal.
- **Styling**: Easily customizable via Tailwind CSS.
- **Component-based**: Add new features or pages as needed.

---

## License
This project is for educational and personal use. For commercial use, please contact the author.

---

## Credits
Developed by Tan628.

---

For any questions or issues, please open an issue or contact the maintainer.



