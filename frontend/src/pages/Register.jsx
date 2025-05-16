import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
const Register = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null);
  };

  // Always use the local backend server
  const __URL__ = "http://localhost:1337";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${__URL__}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (data.status === "error") {
        setErr(data.message);
      }

      if (data.status === "success") {
        alert("Registration Successful");
        navigate("/login");
      }

      setInputs({
        fullName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center  bg-purple-900">
      <form
        className=" bg-white flex flex-col px-5 py-10
      shadow-2xl rounded-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-purple-800 text-2xl -mt-5 underline underline-offset-2 font-mono">
          Register
        </h1>
        <div className="flex flex-col space-y-5 p-5 rounded-xl">
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            className="border border-b-blue-900 outline-none rounded-sm placeholder:px-1 h-8"
            required
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="border border-b-blue-900 outline-none rounded-sm placeholder:px-1 h-8"
            required
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="border border-b-blue-900 outline-none rounded-sm placeholder:px-1 h-8"
            required
            onChange={handleChange}
          />

          {err && <p className="text-red-500">{err}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`bg-purple-800 text-white py-2 rounded-sm shadow-md hover:bg-purple-900 font-mono flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : null}
            {loading ? 'Registering...' : 'Submit'}
          </motion.button>
          <div className="flex justify-center items-center">
            <p>already have an account?</p>
            <Link to="/login" className="text-gray-900">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;