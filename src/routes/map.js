import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const auth = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.post("/location", auth, async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const user = await User.findById(req.userId);
    user.location = { lat, lng, updatedAt: new Date() };
    await user.save();
    res.json({ message: "Location updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/locations", auth, async (req, res) => {
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
  const users = await User.find(
    { "location.updatedAt": { $gte: tenMinAgo } },
    "username location car"
  );
  res.json({ users });
});

export default router;