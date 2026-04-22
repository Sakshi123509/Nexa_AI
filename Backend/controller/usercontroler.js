import User from "../models/user.js"
import { uploadcloudinary } from "../config/cloudinary.js";
import responseurl from "../gemini_api.js";
import moment from "moment";

export const getUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log("getUser error:", error);
        return res.status(500).json({ message: "get user error" });
    }
}

//update user 
export const updateAssistant = async (req, res) => {
    try {
        const { assistantName } = req.body;
        const imageurl = req.body.imageurl;
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        let assistantImage;
        if (req.file) {
            assistantImage = await uploadcloudinary(req.file.path);
        } else {
            assistantImage = imageurl;
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            Ainame: assistantName,
            AIimg: assistantImage
        }, { returnDocument: "after" }).select("-password");

        return res.status(200).json(user);
    } catch (error) {
        console.log("updateAssistant error:", error);
        return res.status(500).json({ message: "update assistant error" });
    }
}

export const askToAssistant = async (req, res) => {
    try {
        console.log('askToAssistant - req.body:', req.body, 'userId:', req.userId);
        const user = await User.findById(req.userId)
        if (!user) {
            console.log('askToAssistant error: authenticated user not found', req.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        const userName = user.name;
        const assistantName = user.Ainame || 'Assistant';
        const { prompt: command } = req.body;

        if (!command || typeof command !== 'string' || !command.trim()) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        console.log('Sending to Gemini:', {command, assistantName, userName});

        const result = await responseurl(command, assistantName, userName)
        console.log('Gemini raw result:', result);

        if (!result) {
            return res.status(500).json({ message: "AI response error" });
        }

        const gemresult = result;
        const type = gemresult.type

        switch (type) {

            case 'get_date':
                return res.json({
                    type,
                    userInput: gemresult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });

            case 'get_time':
                return res.json({
                    type,
                    userInput: gemresult.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`
                });

            case 'get_day':
                return res.json({
                    type,
                    userInput: gemresult.userInput,
                    response: `today is ${moment().format("dddd")}`
                });

            case 'get_month':
                return res.json({
                    type,
                    userInput: gemresult.userInput,
                    response: `Today is ${moment().format("MMMM")}`
                });

            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'general':
            case 'calculator_open':
            case 'facebook_open':
            case 'cmd_open':
            case 'notepad_open':
            case 'instagram_open':
            case 'weather-show':
                return res.json({
                    type,
                    userInput: gemresult.userInput,
                    response: gemresult.response
                });

            default:
                return res.json({
                    type: 'general',
                    userInput: command,
                    response: "I did not understand your question"
                })

        }

    } catch (error) {
        console.log("askToAssistant error:", error)
        return res.status(500).json({ message: "askToAssistant error" })
    }
}
