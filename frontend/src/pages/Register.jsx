import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { SongContext } from "../Context/SongContext";
import logo from "../assets/icon.png";

const inputVariants = {
  focus: { borderColor: "#7c3aed", boxShadow: "0 0 0 2px #c4b5fd" },
  rest: { borderColor: "#e5e7eb", boxShadow: "none" },
};

const Register = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [focus, setFocus] = useState({});
  const navigate = useNavigate();
  const { backendUrl } = useContext(SongContext);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null);
    setSuccess(null);
  };

  const handleFocus = (e) => setFocus((f) => ({ ...f, [e.target.name]: true }));
  const handleBlur = (e) => setFocus((f) => ({ ...f, [e.target.name]: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setSuccess(null);
    try {
      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "Something went wrong. Please try again.");
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setErr("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 px-2">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col items-center border border-white/40"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        <img src={logo} alt="Music Groovo Logo" className="w-16 h-16 mb-2 rounded-full shadow-lg border-2 border-white/60 bg-white/80" />
        <h2 className="text-4xl font-extrabold text-purple-900 mb-2 tracking-tight text-center drop-shadow-lg">Create Account</h2>
        <p className="text-base text-gray-700 mb-6 text-center">Join Music Groovo and start your musical journey!</p>
        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off" aria-label="Register form">
          {/* Floating label input */}
          <motion.div animate={focus.fullName ? "focus" : "rest"} variants={inputVariants} className="relative">
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={inputs.fullName}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white/80 text-lg text-gray-900 focus:outline-none transition-all duration-200 placeholder-transparent shadow-sm`}
              required
              autoComplete="name"
              aria-label="Full Name"
            />
            <label htmlFor="fullName" className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-purple-700 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 pointer-events-none">
              Full Name
            </label>
          </motion.div>
          <motion.div animate={focus.email ? "focus" : "rest"} variants={inputVariants} className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={inputs.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white/80 text-lg text-gray-900 focus:outline-none transition-all duration-200 placeholder-transparent shadow-sm`}
              required
              autoComplete="email"
              aria-label="Email"
            />
            <label htmlFor="email" className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-purple-700 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 pointer-events-none">
              Email
            </label>
          </motion.div>
          <motion.div animate={focus.password ? "focus" : "rest"} variants={inputVariants} className="relative">
            <input
              type="password"
              name="password"
              id="password"
              value={inputs.password}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white/80 text-lg text-gray-900 focus:outline-none transition-all duration-200 placeholder-transparent shadow-sm`}
              required
              autoComplete="new-password"
              aria-label="Password"
            />
            <label htmlFor="password" className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-purple-700 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 pointer-events-none">
              Password
            </label>
          </motion.div>
          {err && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center text-red-600 font-semibold bg-red-50 border border-red-200 rounded-md py-2 px-3 animate-pulse shadow-sm"
              role="alert"
            >
              {err}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center text-green-700 font-semibold bg-green-50 border border-green-200 rounded-md py-2 px-3 shadow-sm"
              role="status"
            >
              {success}
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <LoadingSpinner size={22} color="#fff" /> : "Create Account"}
          </motion.button>
        </form>
        <div className="mt-8 text-center">
          <span className="text-gray-700">Already have an account?</span>{" "}
          <Link to="/login" className="text-purple-800 font-semibold hover:underline ml-1">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;