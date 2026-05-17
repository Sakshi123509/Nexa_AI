
import express from "express";
import {
  getUser,
  updateAssistant,
  askToAssistant,
  saveChat,          // ← saves chat messages to history
  getHistory,        // ← returns history for History page
  getDashboardStats, // ← returns stats for Dashboard
} from "../controller/usercontroler.js"
import isAuth  from "../middleware/isAuth.js"; // your auth middleware
import upload from "../middleware/multer.js";     // your multer middleware

const router = express.Router();

// existing routes
router.get("/current",           isAuth, getUser);
router.post("/updateassistant",  isAuth, upload.single("image"), updateAssistant);
router.post("/asktoassistant",   isAuth, askToAssistant);

// ✅ NEW routes — these must exist for history + dashboard to work
router.post("/savechat",         isAuth, saveChat);
router.get("/history",           isAuth, getHistory);
router.get("/dashboardstats",    isAuth, getDashboardStats);

export default router;
