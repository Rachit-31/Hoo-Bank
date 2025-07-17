import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import { API } from "../ApiUri"; // Make sure this contains your base URL
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/users/logout`,
        {},
        {
          withCredentials: true, // Important to send the cookie
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("_grecaptcha")

      setIsAuthenticated(false);
      toast.success("Logout successful")
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-zinc-900 text-white rounded-xl shadow-lg z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Bank Name */}
        <div className="text-xl font-bold text-white">Hoo Bank</div>

        {/* Center - Nav Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          {/* <Link to="/transfer" className="hover:text-blue-400 transition">Transfer</Link> */}
          <Link to="/dashboard" className="hover:text-blue-400 transition">Statements</Link>
        </div>

        {/* Right - Auth Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-400">Sign In</Link>
          )}
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="block hover:text-blue-400">Home</Link>
          {/* <Link to="/transfer" onClick={() => setIsOpen(false)} className="block hover:text-blue-400">Transfer</Link> */}
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block hover:text-blue-400">Statements</Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block hover:text-green-400">Dashboard</Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block text-red-400 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block hover:text-blue-400">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;