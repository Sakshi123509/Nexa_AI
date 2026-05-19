import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { gettoken } from "../config/token.js";

export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existedemail = await User.findOne({ email })

        //check done
        if (existedemail) {
            return res.status(400).json({ message: "email already exist!!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Enter password with atleast 6 character" });
        }

        //hashed password
        const hashedpassword = await bcrypt.hash(password, 10);

        //user stored int mongodb
        const user = await User.create({
            name: name,
            password: hashedpassword,
            email: email
        })

        //create token(cookie me store krna h isko)
        const token = gettoken(user._id);
  
        //store in cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        })

        //send to frontend
        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({ message: `Register Error,${error}` })
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const RegisteredUser = await User.findOne({ email })

        //check done
        if (!RegisteredUser) {
            return res.status(400).json({ message: "email Not Found exist!!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Enter password with atleast 6 character" });
        }

        //check
        const isMatch = await bcrypt.compare(password, RegisteredUser.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        //create token(cookie me store krna h isko)
        const token = gettoken(RegisteredUser._id);
       
        //store in cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });
        //send to frontend
        return res.status(201).json(RegisteredUser);

    } catch (error) {
        return res.status(500).json({ message: `Login Error,${error}` })
    }
}

export const Logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch {
        return res.status(400).json({ message: `Logout Error ${error}` })
    }
}