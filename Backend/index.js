import dotenv from "dotenv"
dotenv.config();
import express from "express"
import connectdb from "./config/db.js";
import authRouter from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import responseurl from "./gemini_api.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

connectdb();

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})

// console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Found" : "❌ Missing");
// console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Found" : "❌ Missing");
// console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Missing");
// console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Found" : "❌ Missing");