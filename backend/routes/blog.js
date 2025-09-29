import express from "express";
import Blog from "../models/Blog.js";
import auth from "../middleware/auth.js";
import notBlocked from "../middleware/notBlocked.js";  // ✅ import middleware

const router = express.Router();

// ✅ Create Blog (only if not blocked)
router.post("/", auth, notBlocked, async (req, res) => {
  try {
    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id
    });
    const savedBlog = await newBlog.save();
    res.json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Blogs (public)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
  .populate("author", "username")
  .populate("comments.user", "username");  // ✅ populate user in comments
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Blog (public)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
  .populate("author", "username")
  .populate("comments.user", "username");  // ✅ populate user in comments

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Blog (only owner + not blocked)
router.put("/:id", auth, notBlocked, async (req, res) => {
  try {
    const updated = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Blog (only owner + not blocked)
router.delete("/:id", auth, notBlocked, async (req, res) => {
  try {
    await Blog.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    res.json({ msg: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add Comment (only if not blocked)
router.post("/:id/comments", auth, notBlocked, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      createdAt: new Date()
    };

    blog.comments.push(newComment);
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Comment (only if owner of comment + not blocked)
router.delete("/:id/comments/:commentId", auth, notBlocked, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== req.params.commentId || c.user.toString() !== req.user.id
    );

    await blog.save();
    res.json({ msg: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Like / Unlike Blog (only if not blocked)
router.put("/:id/like", auth, notBlocked, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.likes.includes(req.user.id)) {
      // Already liked → remove
      blog.likes = blog.likes.filter((u) => u.toString() !== req.user.id);
    } else {
      // Not liked → add
      blog.likes.push(req.user.id);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get My Blogs (only for logged-in user)
router.get("/me/blogs", auth, async (req, res) => {
  try {
    const myBlogs = await Blog.find({ author: req.user.id })
      .populate("author", "username")
      .populate("comments.user", "username"); // populate comments' users

    res.json(myBlogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
