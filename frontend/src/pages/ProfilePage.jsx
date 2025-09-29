import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [followers, setFollowers] = useState([]);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setBio(res.data.bio || "");
    } catch (err) {
      console.error("Error fetching profile", err);
      alert("Please login again.");
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me/followers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowers(res.data);
    } catch (err) {
      console.error("Error fetching followers", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFollowers();
  }, []);

  const handleBioUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        { bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      alert("Bio updated successfully");
    } catch (err) {
      console.error("Error updating bio", err);
      alert("Failed to update bio");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/users/me/password",
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassword("");
      alert("Password updated successfully");
    } catch (err) {
      console.error("Error updating password", err);
      alert("Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted successfully");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error("Error deleting account", err);
      alert("Failed to delete account");
    }
  };

  const handleImageUpload = async () => {
    if (!profileImageFile) {
      alert("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", profileImageFile);

    try {
      const res = await axios.put("http://localhost:5000/api/users/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      alert("Profile image updated successfully");
    } catch (err) {
      console.error("Error uploading image", err);
      alert("Failed to upload image");
    }
  };

  const handleUnfollow = async (followerId) => {
    try {
      // Use the correct backend route
      await axios.put(
        `http://localhost:5000/api/users/${followerId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFollowers(); // Refresh followers list
    } catch (err) {
      console.error("Error unfollowing user", err);
      alert("Failed to unfollow user");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Profile</h1>

      <div className="text-center">
        {user.profileImage ? (
          <img
            src={`http://localhost:5000${user.profileImage}`}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 flex items-center justify-center">
            No Image
          </div>
        )}
        <input
          type="file"
          onChange={(e) => setProfileImageFile(e.target.files[0])}
          className="mt-2"
        />
        <button
          onClick={handleImageUpload}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Image
        </button>
      </div>

      <div className="text-center">
        <p className="text-lg font-medium">{user.username}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border p-2 rounded"
          rows="4"
        />
        <button
          onClick={handleBioUpdate}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Bio
        </button>
      </div>

      <div>
        <label className="block mb-1 font-semibold">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handlePasswordUpdate}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Password
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Followers ({followers.length})</h2>
        <ul className="space-y-1">
          {followers.map((follower) => (
            <li
              key={follower._id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <span>{follower.username}</span>
              <button
                onClick={() => handleUnfollow(follower._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Unfollow
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
