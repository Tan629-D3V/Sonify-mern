import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogIn, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import { SongContext } from "../Context/SongContext";

const Login = () => {
  const navigate = useNavigate();
  const { __URL__ } = useContext(SongContext);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${__URL__}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs)
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("access_token", data.token);
        navigate('/');
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-dark-card p-8 rounded-xl shadow-xl"
      >
        <div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mx-auto flex justify-center text-primary"
          >
            <FiLogIn size={40} />
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Or{" "}
            <Link to="/register" className="text-primary hover:text-primary-light">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900 bg-opacity-20 text-red-400 p-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                  <FiMail />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input pl-10 w-full"
                  placeholder="Email address"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                  <FiLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input pl-10 w-full"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 accent-primary rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-primary hover:text-primary-light">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`btn-primary w-full flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <FiLogIn />
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:text-primary-light flex items-center justify-center gap-1 mt-2">
              <FiUserPlus />
              <span>Create an account</span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;