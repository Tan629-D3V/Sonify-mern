import React, { useContext } from "react";
import { SidebarContext } from "../Context/SibebarContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome, FiMusic, FiUpload, FiList,
  FiMenu, FiX, FiLogOut, FiLogIn, FiUserPlus
} from "react-icons/fi";

import "../utils/style.css";

const Navbar = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const logOut = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-lighter backdrop-blur-md bg-opacity-80 shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-display font-bold text-primary hover:text-primary-light transition-colors"
        >
          <span className="flex items-center gap-2">
            <FiMusic className="text-primary" />
            Music Groovo
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 rounded-full text-text-primary hover:bg-dark-accent transition-colors"
          aria-label="Toggle Menu"
        >
          {showMenu ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <NavLink to="/" icon={<FiHome />} label="Home" />
          <NavLink to="/explore" icon={<FiMusic />} label="Songs" />
          <NavLink to="/upload" icon={<FiUpload />} label="Upload" />
          <NavLink to="/playlists" icon={<FiList />} label="Playlists" />

          {token ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logOut}
              className="btn-primary flex items-center gap-2"
            >
              <FiLogOut /> Log Out
            </motion.button>
          ) : (
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="btn-primary flex items-center gap-2">
                  <FiLogIn /> Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn-secondary flex items-center gap-2">
                  <FiUserPlus /> Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-y-0 right-0 w-64 bg-dark-card shadow-xl p-4 z-50 lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-primary">Menu</span>
              <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-dark-accent">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/" icon={<FiHome size={20} />} label="Home" onClick={toggleMenu} />
              <MobileNavLink to="/explore" icon={<FiMusic size={20} />} label="Songs" onClick={toggleMenu} />
              <MobileNavLink to="/upload" icon={<FiUpload size={20} />} label="Upload" onClick={toggleMenu} />
              <MobileNavLink to="/playlists" icon={<FiList size={20} />} label="Playlists" onClick={toggleMenu} />
            </div>

            <div className="mt-auto">
              {token ? (
                <button
                  onClick={() => { logOut(); toggleMenu(); }}
                  className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
                >
                  <FiLogOut /> Log Out
                </button>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link
                    to="/login"
                    className="w-full btn-primary flex items-center justify-center gap-2"
                    onClick={toggleMenu}
                  >
                    <FiLogIn /> Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                    onClick={toggleMenu}
                  >
                    <FiUserPlus /> Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

// Mobile Navigation Link
const MobileNavLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-accent text-text-secondary hover:text-primary transition-colors"
    onClick={onClick}
  >
    {icon}
    <span className="text-lg">{label}</span>
  </Link>
);

export default Navbar;
