export const requireRole = (role) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
    if (req.user.role !== role) return res.status(403).json({ msg: "Forbidden: Admins only" });
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
