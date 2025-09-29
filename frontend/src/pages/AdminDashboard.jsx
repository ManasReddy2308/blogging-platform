// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = Array.isArray(res.data) ? res.data : res.data.items || [];
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const blockUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Failed to block/unblock user", err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 border-b">Username</th>
            <th className="py-2 border-b">Email</th>
            <th className="py-2 border-b">Role</th>
            <th className="py-2 border-b">Blocked</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id} className="text-center">
                <td className="py-2 border-b">{u.username}</td>
                <td className="py-2 border-b">{u.email}</td>
                <td className="py-2 border-b">{u.role}</td>
                <td className="py-2 border-b">{u.isBlocked ? "Yes" : "No"}</td>
                <td className="py-2 border-b space-x-2">
                  <button
                    onClick={() => blockUser(u._id)}
                    className={`px-3 py-1 rounded ${
                      u.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    } text-white`}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Delete
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

export default AdminDashboard;
