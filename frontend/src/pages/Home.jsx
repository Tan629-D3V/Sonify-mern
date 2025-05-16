import React, { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../Context/SibebarContext";
import { SongContext } from "../Context/SongContext";
import { motion } from "framer-motion";
import bg from "../assets/bg4.jpg";
import musicbg from "../assets/musicbg.jpg";
import stereo from "../assets/stereo.jpg";
import '../utils/style.css';
import { Link } from "react-router-dom";
import { FiPlay, FiHeadphones, FiUpload, FiMusic, FiTrendingUp, FiHeart, FiClock } from "react-icons/fi";

const Home = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const { __URL__ } = useContext(SongContext);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([
    { id: 1, title: "Top Hits", image: musicbg, songs: 24 },
    { id: 2, title: "Chill Vibes", image: stereo, songs: 18 },
    { id: 3, title: "Workout Mix", image: musicbg, songs: 15 },
    { id: 4, title: "Study Focus", image: stereo, songs: 20 }
  ]);

  const [genres, setGenres] = useState([
    { id: 1, name: "Pop", color: "from-purple-500 to-pink-500" },
    { id: 2, name: "Rock", color: "from-red-500 to-orange-500" },
    { id: 3, name: "Hip Hop", color: "from-blue-500 to-teal-500" },
    { id: 4, name: "Electronic", color: "from-green-500 to-emerald-500" },
    { id: 5, name: "Jazz", color: "from-yellow-500 to-amber-500" },
    { id: 6, name: "Classical", color: "from-indigo-500 to-violet-500" }
  ]);

  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  const token = localStorage.getItem("access_token") || null;

  return (
    <div className="w-full min-h-screen bg-dark">
      {/* Hero Section */}
      <section
        className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/70 to-dark"></div>

        {/* Animated music notes (decorative) */}
        <div className="absolute inset-0 opacity-60">
          <div className="music-notes"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl text-white font-extrabold drop-shadow-lg hero-text">
              <span className="text-primary">Sonify</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
              Discover, stream, and share your favorite music. Anytime, anywhere.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              {token ? (
                <Link
                  to="/upload"
                  className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full text-lg"
                >
                  <FiUpload /> Upload Music
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full text-lg"
                >
                  <FiHeadphones /> Get Started
                </Link>
              )}
              <Link
                to="/explore"
                className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-full text-lg"
              >
                <FiPlay /> Browse Music
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-dark"></path>
          </svg>
        </div>
      </section>

      {/* Featured Playlists Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <FiTrendingUp className="text-primary" /> Featured Playlists
            </h2>
            <Link to="/playlists" className="text-primary hover:text-primary-light transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlaylists.map((playlist) => (
              <motion.div
                key={playlist.id}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="playlist-card bg-dark-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={playlist.image}
                    alt={playlist.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-70"></div>
                  <button className="absolute bottom-4 right-4 p-3 bg-primary rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110">
                    <FiPlay className="text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">{playlist.title}</h3>
                  <p className="text-text-secondary text-sm">{playlist.songs} songs</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-12 px-4 bg-dark-lighter">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <FiMusic className="text-primary" /> Browse Genres
            </h2>
            <Link to="/explore" className="text-primary hover:text-primary-light transition-colors">
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {genres.map((genre) => (
              <motion.div
                key={genre.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${genre.color} rounded-xl p-6 aspect-square flex items-center justify-center cursor-pointer shadow-lg`}
              >
                <h3 className="text-xl font-bold text-white">{genre.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recently Played */}
            <div className="bg-dark-card rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiClock className="text-primary" /> Recently Played
                </h2>
                <Link to="/explore" className="text-primary text-sm">View All</Link>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-2 hover:bg-dark-accent rounded-lg transition-colors"
                  >
                    <img src={item % 2 === 0 ? stereo : musicbg} alt="" className="w-12 h-12 rounded-md object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Song Title {item}</h4>
                      <p className="text-text-secondary text-sm">Artist Name</p>
                    </div>
                    <button className="p-2 text-text-secondary hover:text-primary transition-colors">
                      <FiPlay />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-dark-card rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiHeart className="text-primary" /> Your Favorites
                </h2>
                <Link to="/explore" className="text-primary text-sm">View All</Link>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-2 hover:bg-dark-accent rounded-lg transition-colors"
                  >
                    <img src={item % 2 === 0 ? musicbg : stereo} alt="" className="w-12 h-12 rounded-md object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Favorite Song {item}</h4>
                      <p className="text-text-secondary text-sm">Artist Name</p>
                    </div>
                    <button className="p-2 text-text-secondary hover:text-primary transition-colors">
                      <FiPlay />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
