import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { askToAssistant, getUser, updateAssistant } from "../controller/usercontroler.js";
const userRouter = express.Router();

userRouter.get("/current", isAuth, getUser);
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);
userRouter.post("/asktoassistant", isAuth, askToAssistant);//command needed from frontend

export default userRouter;


// import { getUser, updateAssistant, askToAssistant } from "../controller/usercontroler.js";

// existing routes you already have:
// router.get("/current", isAuth, getUser);
// router.post("/asktoassistant", isAuth, askToAssistant);
// router.put("/update", isAuth, upload.single("image"), updateAssistant);

// ── ADD THESE THREE NEW ROUTES ──
// router.post("/savechat",       isAuth, saveChat);
// router.get("/history",         isAuth, getHistory);
// router.get("/dashboardstats",  isAuth, getDashboardStats);

// // Full example router file:
// import express from "express";
// import multer from "multer";
// import isAuth from "../middleware/isAuth.js";
// import {
//   getUser,
//   askToAssistant,
//   updateAssistant,
//   saveChat,
//   getHistory,
//   getDashboardStats
// } from "../controllers/usercontroler.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router.get("/current", isAuth, getUser);
// router.post("/asktoassistant", isAuth, askToAssistant);
// router.put("/update", isAuth, upload.single("image"), updateAssistant);

// // NEW
// router.post("/savechat", isAuth, saveChat);
// router.get("/history", isAuth, getHistory);
// router.get("/dashboardstats", isAuth, getDashboardStats);

// export default router;