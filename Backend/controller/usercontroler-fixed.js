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
        console.log('error', error);
        return res.status(400).json({ message: "get user error" })
    }
}

//update user 
export const updateAssistant = async (req, res) => {
    try {
        console.log("req.body:", req.body)      
        console.log("req.file:", req.file)      
        const { assistantName, imageurl } = req.body;

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
        console.log("FULL ERROR:", error)  
        return res.status(400).json({ message: "update assistantuser error" })
    }
}

export const askToAssistant = async (req, res) => {
    try {
        console.log('askToAssistant - req.body:', req.body, 'userId:', req.userId);
        const user = await User.findById(req.userId)

        const userName = user.name
        const assistantName = user.Ainame
        const { prompt: command } = req.body
        console.log('Sending to Gemini:', {command, assistantName, userName});

        const result = await responseurl(command, assistantName, userName)
        console.log('Gemini raw result:', result);

        if (!result) {
            return res.status(500).json({ message: "AI response error" });
        }

        // Already parsed JSON
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
        console.log('askToAssistant error:', error)
        return res.status(500).json({ message: "askAssistant error" })
    }
}
