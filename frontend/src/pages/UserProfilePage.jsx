import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserProfilePage = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!token) {
      setError("You must be logged in.");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(res.data.user);
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error("Error fetching profile", err);
      setError("Failed to fetch profile. Please try again.");
    }
  };

  const handleFollow = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${id}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Toggle follow state based on response message
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Error following/unfollowing user", err);
      setError("Action failed. Please try again.");
    }
  };

  if (!token) {
    return <p className="text-red-500">You are not logged in.</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!userProfile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">{userProfile.username}</h2>
      <p><strong>Email:</strong> {userProfile.email}</p>
      <p><strong>Bio:</strong> {userProfile.bio || "No bio provided."}</p>
      <p><strong>Followers:</strong> {userProfile.followers.length}</p>
      <button
        onClick={handleFollow}
        className={`mt-4 px-4 py-2 rounded text-white ${
          isFollowing ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserProfilePage;
