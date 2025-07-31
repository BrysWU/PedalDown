import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const topSpeed = await User.find()
    .sort({ "stats.topSpeed": -1 })
    .limit(10)
    .select("username car stats.topSpeed");
  const totalDistance = await User.find()
    .sort({ "stats.totalDistance": -1 })
    .limit(10)
    .select("username car stats.totalDistance");
  const zeroToSixty = await User.find()
    .sort({ "stats.zeroToSixty": 1 })
    .limit(10)
    .select("username car stats.zeroToSixty");

  res.json({
    topSpeed,
    totalDistance,
    zeroToSixty,
  });
});

export default router;