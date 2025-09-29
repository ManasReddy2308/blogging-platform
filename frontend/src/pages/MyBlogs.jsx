import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchMyBlogs = async () => {
    try {
      // ✅ Updated API endpoint
      const res = await axios.get("http://localhost:5000/api/blogs/me/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to fetch your blogs.");
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyBlogs(); // Refresh after deletion
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError("Failed to delete blog.");
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">My Blogs</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {blogs.length === 0 ? (
        <p>You have no blogs yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="mt-2">{blog.content}</p>
              <button
                onClick={() => deleteBlog(blog._id)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
