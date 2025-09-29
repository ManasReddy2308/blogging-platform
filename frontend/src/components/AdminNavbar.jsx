// src/components/AdminNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-xl font-bold">
            <Link to="/">Blogging Platform</Link>
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/blog" className="hover:text-gray-300">Create Blog</Link>
            <Link to="/myblogs" className="hover:text-gray-300">My Blogs</Link>
            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
            <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-gray-300">Admin Users</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-700">Home</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-700">Create Blog</Link>
          <Link to="/myblogs" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-700">My Blogs</Link>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-700">Profile</Link>
          <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</Link>
          <Link to="/admin/users" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-700">Admin Users</Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
