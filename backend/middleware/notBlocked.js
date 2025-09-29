import User from "../models/User.js";
export default async function notBlocked(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("isBlocked");
    if (!user) return res.status(401).json({ msg: "Unauthorized" });
    if (user.isBlocked) return res.status(403).json({ msg: "Account is blocked" });
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
