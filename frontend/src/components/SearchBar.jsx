import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // store multiple users
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults([]);
      setError("");
      return;
    }

    try {
      // Call API with query
      const res = await axios.get(
        `http://localhost:5000/api/users/search?q=${trimmedQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.length === 0) {
        setError("User not found");
        setResults([]);
      } else {
        setResults(res.data); // store all results
        setError("");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed");
      setResults([]);
    }
  };

  const viewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="my-4">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by username"
          className="border p-2 rounded w-full max-w-md"
        />
        <button
          onClick={handleSearch}
          className="ml-0 md:ml-2 mt-2 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {results.length > 0 && (
        <div className="mt-2 space-y-2">
          {results.map((user) => (
            <div
              key={user._id}
              className="p-2 border rounded max-w-md flex justify-between items-center"
            >
              <span>{user.username} ({user.email})</span>
              <button
                onClick={() => viewProfile(user._id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
