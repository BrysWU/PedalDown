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

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({
    username: user.username,
    email: user.email,
    car: user.car,
    stats: user.stats,
  });
});

router.post("/car", auth, async (req, res) => {
  const { make, model, year, image, mods } = req.body;
  try {
    const user = await User.findById(req.userId);
    user.car = { make, model, year, image, mods };
    await user.save();
    res.json({ message: "Car profile updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/stats", auth, async (req, res) => {
  const { topSpeed, totalDistance, zeroToSixty } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (topSpeed) user.stats.topSpeed = topSpeed;
    if (totalDistance) user.stats.totalDistance = totalDistance;
    if (zeroToSixty) user.stats.zeroToSixty = zeroToSixty;
    await user.save();
    res.json({ message: "Stats updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;