import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { askToAssistant, getUser, updateAssistant } from "../controller/usercontroler.js";
const userRouter = express.Router();

userRouter.get("/current", isAuth, getUser);
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);
userRouter.post("/asktoassistant", isAuth, askToAssistant);//command needed from frontend

export default userRouter;