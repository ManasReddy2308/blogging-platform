import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isAdmin = user && user.role === "admin";

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold">
            <Link to={isAdmin ? "/admin" : "/"}>Blogging Platform</Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center">
            {isAdmin ? (
              <>
                <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
                <Link to="/admin/users" className="hover:text-gray-300">Admin Users</Link>
                <Link to="/admin/blogs" className="hover:text-gray-300">Admin Blogs</Link>
                <Link to="/admin/allblogs" className="hover:text-gray-300">Admin All Blogs</Link>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-gray-300">Home</Link>
                <Link to="/blog" className="hover:text-gray-300">Create Blog</Link>
                <Link to="/myblogs" className="hover:text-gray-300">My Blogs</Link>
              </>
            )}
            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1">
          {isAdmin ? (
            <>
              <Link to="/admin" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Admin Users</Link>
              <Link to="/admin/blogs" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Admin Blogs</Link>
              <Link to="/admin/allblogs" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Admin All Blogs</Link>
            </>
          ) : (
            <>
              <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/blog" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Create Blog</Link>
              <Link to="/myblogs" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>My Blogs</Link>
            </>
          )}
          <Link to="/profile" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Profile</Link>
          <button
            onClick={() => { handleLogout(); setIsOpen(false); }}
            className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar
