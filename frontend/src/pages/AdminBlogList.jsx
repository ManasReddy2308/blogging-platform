// src/pages/AdminBlogList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blogsData = Array.isArray(res.data.items) ? res.data.items : res.data;
      setBlogs(blogsData);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  const toggleLike = async (blogId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${blogId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlogs();
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Blogs (Admin)</h1>
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <div className="text-center text-gray-500">No blogs found.</div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="mb-2">{blog.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">By {blog.author.username}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleLike(blog._id)}
                    className={`px-3 py-1 rounded ${
                      blog.likes.includes(user.id)
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-300 hover:bg-gray-400"
                    } text-white`}
                  >
                    {blog.likes.includes(user.id) ? "Unlike" : "Like"}
                  </button>
                  <span>{blog.likes.length} Likes</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBlogList;
