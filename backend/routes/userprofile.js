import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, req.user.id + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Get user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update bio or profile image
router.put("/me", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const updateData = { bio: req.body.bio };
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update password
router.put("/me/password", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete account
router.delete("/me", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get followers
router.get("/me/followers", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("followers", "username");
    res.json(user.followers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search users by username
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ msg: "Query is required" });

    const users = await User.find({ username: new RegExp(q, "i") })
      .select("username email");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get user profile by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username email bio profileImage followers");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const currentUser = await User.findById(req.user.id);
    const isFollowing = currentUser.followers.includes(req.params.id);

    res.json({ user, isFollowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get followers of a user
router.get("/:id/followers", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "username email");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
import Blog from "../models/Blog.js"; // ensure this is imported at the top

// Get blogs by user ID
router.get("/:id/blogs", auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.id }).populate("author", "username");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Follow/unfollow a user
// Follow/unfollow a user
router.put("/:id/follow", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ msg: "User not found" });

    // Prevent following/unfollowing yourself
    if (currentUser._id.equals(targetUser._id)) {
      return res.status(400).json({ msg: "You cannot follow/unfollow yourself" });
    }

    const isAlreadyFollowing = currentUser.followers.includes(targetUser._id);

    if (isAlreadyFollowing) {
      currentUser.followers = currentUser.followers.filter(
        (followerId) => !followerId.equals(targetUser._id)
      );
    } else {
      currentUser.followers.push(targetUser._id);
    }

    await currentUser.save();

    res.json({ msg: isAlreadyFollowing ? "Unfollowed successfully" : "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;