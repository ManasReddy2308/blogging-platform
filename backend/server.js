import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";
import userProfileRoutes from "./routes/userprofile.js";
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userProfileRoutes);
app.get("/", (req, res) => {
  res.send("Blogging Platform API is running...");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch(err => console.error(err));
