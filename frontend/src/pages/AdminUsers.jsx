// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 border-b">Username</th>
            <th className="py-2 border-b">Email</th>
            <th className="py-2 border-b">Role</th>
            <th className="py-2 border-b">Blocked</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
