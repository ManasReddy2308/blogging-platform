// src/pages/AdminBlogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
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

  const deleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  const deleteComment = async (blogId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/blogs/${blogId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const createBlog = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/blogs",
        { title: newTitle, content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTitle("");
      setNewContent("");
      fetchBlogs();
    } catch (err) {
      console.error("Failed to create blog", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Blog Management</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Create New Blog</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full p-2 mb-2 border rounded-md"
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full p-2 mb-2 border rounded-md"
          rows="4"
        />
        <button
          onClick={createBlog}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Blog
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 border-b">Title</th>
            <th className="py-2 border-b">Author</th>
            <th className="py-2 border-b">Comments</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                No blogs found.
              </td>
            </tr>
          ) : (
            blogs.map((blog) => (
              <tr key={blog._id} className="text-center align-top">
                <td className="py-2 border-b">{blog.title}</td>
                <td className="py-2 border-b">{blog.author.username}</td>
                <td className="py-2 border-b text-left">
                  {blog.comments.length === 0 ? (
                    <div>No comments</div>
                  ) : (
                    blog.comments.map((comment) => (
                      <div key={comment._id} className="mb-2">
                        <strong>{comment.user.username}:</strong> {comment.text}
                        <button
                          onClick={() =>
                            deleteComment(blog._id, comment._id)
                          }
                          className="ml-2 text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </td>
                <td className="py-2 border-b space-x-2">
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Delete Blog
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogs;
