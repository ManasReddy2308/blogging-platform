import express from "express";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import auth from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

// 🔒 Helper: prevent admin from modifying themselves
const isSelf = (req, targetId) => req.user?.id?.toString() === targetId?.toString();

/* =========================
   USERS (Admin-only)
   ========================= */

// 📌 List users with search + pagination + filters
router.get("/users", auth, requireRole("admin"), async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10, role, isBlocked } = req.query;

    let query = {};
    if (q) {
      query.$or = [
        { username: new RegExp(q, "i") },
        { email: new RegExp(q, "i") }
      ];
    }
    if (role) query.role = role;
    if (isBlocked !== undefined) query.isBlocked = isBlocked === "true";

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-password"),
      User.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 📌 Change user role
router.put("/users/:id/role", auth, requireRole("admin"), async (req, res) => {
  try {
    const { role } = req.body; // "user" or "admin"
    const { id } = req.params;

    if (!["user", "admin"].includes(role)) return res.status(400).json({ msg: "Invalid role" });
    if (isSelf(req, id)) return res.status(400).json({ msg: "You cannot change your own role" });

    const updated = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Role updated", user: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 📌 Block / Unblock user
router.put("/users/:id/block", auth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    if (isSelf(req, id)) return res.status(400).json({ msg: "You cannot block yourself" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      msg: user.isBlocked ? "User blocked" : "User unblocked",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 📌 Delete user (and their blogs)
router.delete("/users/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    if (isSelf(req, id)) return res.status(400).json({ msg: "You cannot delete your own account" });

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await Blog.deleteMany({ author: id }); // cleanup blogs

    res.json({ msg: "User and their blogs deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   BLOGS (Admin-only)
   ========================= */

// 📌 List blogs with pagination + search
router.get("/blogs", auth, requireRole("admin"), async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10, author } = req.query;

    let query = {};
    if (q) query.title = new RegExp(q, "i");
    if (author) query.author = author;

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("author", "username email"),
      Blog.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 📌 Delete any blog
router.delete("/blogs/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    res.json({ msg: "Blog deleted by admin" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   DASHBOARD STATS (Admin-only)
   ========================= */

router.delete("/blogs/:blogId/comments/:commentId", auth, requireRole("admin"), async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    // Find the index of the comment to delete
    const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Remove the comment
    blog.comments.splice(commentIndex, 1);
    await blog.save();

    res.json({ msg: "Comment deleted by admin" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: error.message });
  }
});
export default router;
