import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import SearchBar from "../components/SearchBar";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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
      console.error("Error toggling like", err);
    }
  };

  const addComment = async (blogId) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/blogs/${blogId}/comments`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText("");
      fetchBlogs();
    } catch (err) {
      console.error("Error adding comment", err);
      setError("Failed to add comment.");
    }
  };

  const deleteComment = async (blogId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/blogs/${blogId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

  const canDeleteComment = (comment) => {
    if (!comment.user || !user) return false;
    // Either _id matches or username matches
    return (
      (comment.user._id && comment.user._id === user.id) ||
      (comment.user.username && comment.user.username === user.username)
    );
  };

  return (
    <div className="p-4">
      <SearchBar />

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4 mt-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
            <p className="mb-2">{blog.content}</p>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-1">
                <button onClick={() => toggleLike(blog._id)}>
                  {blog.likes.includes(user?.id) ? (
                    <FaHeart className="text-blue-600 cursor-pointer" />
                  ) : (
                    <FaRegHeart className="text-black cursor-pointer" />
                  )}
                </button>
                <span>{blog.likes.length}</span>
              </div>
              <span className="text-sm text-gray-600">
                By {blog.author.username}
              </span>
            </div>

            {/* Comments Section */}
            <div className="mt-2">
              <h3 className="text-sm font-semibold">Comments:</h3>
              {blog.comments.map((comment) => (
                <div key={comment._id} className="border p-2 mt-1 rounded">
                  <p className="text-sm">
                    <strong>{comment.user?.username || "Unknown"}:</strong>{" "}
                    {comment.text}
                  </p>
                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => deleteComment(blog._id, comment._id)}
                      className="text-red-600 text-xs hover:underline mt-1"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}

              <div className="flex mt-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="border rounded px-2 py-1 w-full"
                />
                <button
                  onClick={() => addComment(blog._id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded ml-2 hover:bg-blue-700"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
