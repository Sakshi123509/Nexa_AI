import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken?.userId) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        req.userId = verifyToken.userId;
        console.log("Cookies:", req.cookies);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default isAuth;