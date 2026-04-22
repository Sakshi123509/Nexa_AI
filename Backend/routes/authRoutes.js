import express from "express";
import { Login, Logout, Register } from "../controller/authcontroller.js";
const authRouter = express.Router();

//get msg from frontend= post
authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.get("/logout", Logout);

export default authRouter;