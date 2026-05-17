// import User from "../models/user.js"
// import { uploadcloudinary } from "../config/cloudinary.js";
// import responseurl from "../gemini_api.js";
// import moment from "moment";

// export const getUser = async (req, res) => {
//     try {
//         const userId = req.userId
//         const user = await User.findById(userId).select("-password");

//         if (!user) {
//             return res.status(400).json({ message: "user not found" })
//         }

//         return res.status(200).json(user);
//     } catch (error) {
//         console.log("getUser error:", error);
//         return res.status(500).json({ message: "get user error" });
//     }
// }

// //update user 
// export const updateAssistant = async (req, res) => {
//     try {
//         const { assistantName } = req.body;
//         const imageurl = req.body.imageurl;
//         console.log("req.body:", req.body);
//         console.log("req.file:", req.file);

//         let assistantImage;
//         if (req.file) {
//             assistantImage = await uploadcloudinary(req.file.path);
//         } else {
//             assistantImage = imageurl;
//         }

//         const user = await User.findByIdAndUpdate(req.userId, {
//             Ainame: assistantName,
//             AIimg: assistantImage
//         }, { returnDocument: "after" }).select("-password");

//         return res.status(200).json(user);
//     } catch (error) {
//         console.log("updateAssistant error:", error);
//         return res.status(500).json({ message: "update assistant error" });
//     }
// }

// export const askToAssistant = async (req, res) => {
//     try {
//         console.log('askToAssistant - req.body:', req.body, 'userId:', req.userId);
//         const user = await User.findById(req.userId)
//         if (!user) {
//             console.log('askToAssistant error: authenticated user not found', req.userId);
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const userName = user.name;
//         const assistantName = user.Ainame || 'Assistant';
//         const { prompt: command } = req.body;

//         if (!command || typeof command !== 'string' || !command.trim()) {
//             return res.status(400).json({ message: 'Prompt is required' });
//         }

//         console.log('Sending to Gemini:', {command, assistantName, userName});

//         const result = await responseurl(command, assistantName, userName)
//         console.log('Gemini raw result:', result);

//         if (!result) {
//             return res.status(500).json({ message: "AI response error" });
//         }

//         const gemresult = result;
//         const type = gemresult.type

//         switch (type) {

//             case 'get_date':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: `current date is ${moment().format("YYYY-MM-DD")}`
//                 });

//             case 'get_time':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: `current time is ${moment().format("hh:mm A")}`
//                 });

//             case 'get_day':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: `today is ${moment().format("dddd")}`
//                 });

//             case 'get_month':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: `Today is ${moment().format("MMMM")}`
//                 });

//             case 'google_search':
//             case 'youtube_search':
//             case 'youtube_play':
//             case 'general':
//             case 'calculator_open':
//             case 'facebook_open':
//             case 'cmd_open':
//             case 'notepad_open':
//             case 'instagram_open':
//             case 'weather-show':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: gemresult.response
//                 });

//             default:
//                 return res.json({
//                     type: 'general',
//                     userInput: command,
//                     response: "I did not understand your question"
//                 })

//         }

//     } catch (error) {
//         console.log("askToAssistant error:", error)
//         return res.status(500).json({ message: "askToAssistant error" })
//     }
// }
// import User from "../models/user.js"
// import { uploadcloudinary } from "../config/cloudinary.js";
// import responseurl from "../gemini_api.js";
// import moment from "moment";

// export const getUser = async (req, res) => {
//     try {
//         const userId = req.userId
//         const user = await User.findById(userId).select("-password");

//         if (!user) {
//             return res.status(400).json({ message: "user not found" })
//         }

//         return res.status(200).json(user);
//     } catch (error) {
//         console.log('error', error);
//         return res.status(400).json({ message: "get user error" })
//     }
// }

// //update user 
// export const updateAssistant = async (req, res) => {
//     try {
//         console.log("req.body:", req.body)      
//         console.log("req.file:", req.file)      
//         const { assistantName, imageurl } = req.body;

//         let assistantImage;
//         if (req.file) {
//             assistantImage = await uploadcloudinary(req.file.path);
//         } else {
//             assistantImage = imageurl;
//         }

//         const user = await User.findByIdAndUpdate(req.userId, {
//             Ainame: assistantName,
//             AIimg: assistantImage
//         }, { returnDocument: "after" }).select("-password");

//         return res.status(200).json(user);
//     } catch (error) {
//         console.log("FULL ERROR:", error)  
//         return res.status(400).json({ message: "update assistantuser error" })
//     }
// }

// export const askToAssistant = async (req, res) => {
//     try {
//         console.log('askToAssistant - req.body:', req.body, 'userId:', req.userId);
//         const user = await User.findById(req.userId)

//         const userName = user.name
//         const assistantName = user.Ainame
//         const { prompt: command } = req.body
//         console.log('Sending to Gemini:', {command, assistantName, userName});

//         const result = await responseurl(command, assistantName, userName)
//         console.log('Gemini raw result:', result);

//         if (!result) {
//             return res.status(500).json({ message: "AI response error" });
//         }

//         // Already parsed JSON
//         const gemresult = result;
//         const type = gemresult.type

//         switch (type) {

//             case 'get_date':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: `current date is ${moment().format("YYYY-MM-DD")}`
//                 });

//             case 'get_time':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: `current time is ${moment().format("hh:mm A")}`
//                 });

//             case 'get_day':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: `today is ${moment().format("dddd")}`
//                 });

//             case 'get_month':
//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: `Today is ${moment().format("MMMM")}`
//                 });

//             case 'google_search':
//             case 'youtube_search':
//             case 'youtube_play':
//             case 'general':
//             case 'calculator_open':
//             case 'facebook_open':
//             case 'cmd_open':
//             case 'notepad_open':
//             case 'instagram_open':
//             case 'weather-show':

//                 return res.json({
//                     type,
//                     userInput: gemresult.userInput,
//                     response: gemresult.response
//                 });

//             default:
//                 return res.json({
//                     type: 'general',
//                     userInput: command,
//                     response: "I did not understand your question"
//                 })

//         }

//     } catch (error) {
//         console.log('askToAssistant error:', error)
//         return res.status(500).json({ message: "askAssistant error" })
//     }
// }





//without history handle

// import User from "../models/user.js"
// import { uploadcloudinary } from "../config/cloudinary.js";
// import responseurl from "../gemini_api.js";
// import moment from "moment";

// export const getUser = async (req, res) => {
//     try {
//         const userId = req.userId
//         const user = await User.findById(userId).select("-password");
//         if (!user) return res.status(400).json({ message: "user not found" })
//         return res.status(200).json(user);
//     } catch (error) {
//         return res.status(500).json({ message: "get user error" });
//     }
// }

// export const updateAssistant = async (req, res) => {
//     try {
//         const { assistantName } = req.body;
//         const imageurl = req.body.imageurl;
//         let assistantImage;
//         if (req.file) {
//             assistantImage = await uploadcloudinary(req.file.path);
//         } else {
//             assistantImage = imageurl;
//         }
//         const user = await User.findByIdAndUpdate(req.userId, {
//             Ainame: assistantName,
//             AIimg: assistantImage
//         }, { returnDocument: "after" }).select("-password");
//         return res.status(200).json(user);
//     } catch (error) {
//         return res.status(500).json({ message: "update assistant error" });
//     }
// }

// // ── NEW: Save a chat message to history ──────────────────────────
// export const saveChat = async (req, res) => {
//     try {
//         const { userMessage, aiResponse, type = "CHAT" } = req.body;
//         if (!userMessage) return res.status(400).json({ message: "userMessage required" });

//         const historyEntry = {
//             userMessage,
//             aiResponse: aiResponse || "",
//             type,                          // "CHAT" | "VOICE"
//             timestamp: new Date(),
//         };

//         await User.findByIdAndUpdate(req.userId, {
//             $push: {
//                 history: {
//                     $each: [historyEntry],
//                     $slice: -200          // keep last 200 entries only
//                 }
//             }
//         });

//         return res.status(200).json({ success: true });
//     } catch (error) {
//         console.log("saveChat error:", error);
//         return res.status(500).json({ message: "saveChat error" });
//     }
// }

// // ── NEW: Get user history ────────────────────────────────────────
// export const getHistory = async (req, res) => {
//     try {
//         const user = await User.findById(req.userId).select("history");
//         if (!user) return res.status(404).json({ message: "User not found" });
//         // Return newest first
//         const sorted = [...(user.history || [])].reverse();
//         return res.status(200).json({ history: sorted });
//     } catch (error) {
//         return res.status(500).json({ message: "getHistory error" });
//     }
// }

// // ── NEW: Get dashboard stats ─────────────────────────────────────
// export const getDashboardStats = async (req, res) => {
//     try {
//         const user = await User.findById(req.userId).select("history createdAt");
//         if (!user) return res.status(404).json({ message: "User not found" });

//         const history = user.history || [];

//         // Count by type
//         const totalQueries = history.length;
//         const voiceCount   = history.filter(h => h.type === "VOICE").length;
//         const chatCount    = history.filter(h => h.type === "CHAT").length;

//         // Sessions per day — last 7 days
//         const weekData = [];
//         for (let i = 6; i >= 0; i--) {
//             const d = new Date();
//             d.setDate(d.getDate() - i);
//             const dayStr = d.toLocaleDateString("en", { weekday: "short" }).toUpperCase();
//             const count = history.filter(h => {
//                 const hd = new Date(h.timestamp);
//                 return hd.toDateString() === d.toDateString();
//             }).length;
//             weekData.push({ d: dayStr, v: count });
//         }

//         // Sessions per week — last 4 weeks
//         const monthData = [];
//         for (let i = 3; i >= 0; i--) {
//             const weekStart = new Date();
//             weekStart.setDate(weekStart.getDate() - i * 7 - 6);
//             const weekEnd = new Date();
//             weekEnd.setDate(weekEnd.getDate() - i * 7);
//             const count = history.filter(h => {
//                 const hd = new Date(h.timestamp);
//                 return hd >= weekStart && hd <= weekEnd;
//             }).length;
//             monthData.push({ d: `W${4 - i}`, v: count });
//         }

//         // Recent 6 for activity feed
//         const recentActivity = [...history].reverse().slice(0, 6).map(h => ({
//             type:      h.type,
//             label:     h.userMessage?.slice(0, 55) || "",
//             time:      h.timestamp,
//             icon:      h.type === "VOICE" ? "🎙️" : "💬",
//             color:     h.type === "VOICE" ? "#00cfff" : "#5aefb8",
//         }));

//         // Breakdown percentages
//         const breakdown = [
//             { label: "VOICE", pct: totalQueries ? +(voiceCount / totalQueries).toFixed(2) : 0, color: "#00cfff" },
//             { label: "CHAT",  pct: totalQueries ? +(chatCount  / totalQueries).toFixed(2) : 0, color: "#5aefb8" },
//         ];

//         return res.status(200).json({
//             totalQueries,
//             voiceCount,
//             chatCount,
//             weekData,
//             monthData,
//             recentActivity,
//             breakdown,
//             memberSince: user.createdAt,
//         });
//     } catch (error) {
//         console.log("getDashboardStats error:", error);
//         return res.status(500).json({ message: "getDashboardStats error" });
//     }
// }

// export const askToAssistant = async (req, res) => {
//     try {
//         const user = await User.findById(req.userId)
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         const userName     = user.name;
//         const assistantName = user.Ainame || 'Assistant';
//         const { prompt: command } = req.body;

//         if (!command || typeof command !== 'string' || !command.trim()) {
//             return res.status(400).json({ message: 'Prompt is required' });
//         }

//         const result = await responseurl(command, assistantName, userName)
//         if (!result) return res.status(500).json({ message: "AI response error" });

//         const gemresult = result;
//         const type = gemresult.type;

//         let finalResponse = gemresult.response || "";

//         // Date/time overrides
//         if (type === 'get_date')  finalResponse = `current date is ${moment().format("YYYY-MM-DD")}`;
//         if (type === 'get_time')  finalResponse = `current time is ${moment().format("hh:mm A")}`;
//         if (type === 'get_day')   finalResponse = `today is ${moment().format("dddd")}`;
//         if (type === 'get_month') finalResponse = `Today is ${moment().format("MMMM")}`;

//         // ✅ Save to history array on User model
//         const historyEntry = {
//             userMessage: command,
//             aiResponse:  finalResponse,
//             type: "VOICE",                 // askToAssistant is called from voice
//             timestamp: new Date(),
//         };
//         await User.findByIdAndUpdate(req.userId, {
//             $push: { history: { $each: [historyEntry], $slice: -200 } }
//         });

//         return res.json({ type, userInput: gemresult.userInput, response: finalResponse });

//     } catch (error) {
//         console.log("askToAssistant error:", error)
//         return res.status(500).json({ message: "askToAssistant error" })
//     }
// }

import User from "../models/user.js";
import { uploadcloudinary } from "../config/cloudinary.js";
import responseurl from "../gemini_api.js";
import moment from "moment";

/* ── Get current user ───────────────────────────────── */
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(400).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "get user error" });
  }
};

/* ── Update assistant name/image ────────────────────── */
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName } = req.body;
    const imageurl = req.body.imageurl;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadcloudinary(req.file.path);
    } else {
      assistantImage = imageurl;
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { Ainame: assistantName, AIimg: assistantImage },
      { returnDocument: "after" }
    ).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "update assistant error" });
  }
};

/* ── Save a single chat/voice entry to history ──────── */
// Called from frontend Home.jsx after AI responds
export const saveChat = async (req, res) => {
  try {
    const { userMessage, aiResponse, type = "CHAT" } = req.body;
    if (!userMessage)
      return res.status(400).json({ message: "userMessage required" });

    await User.findByIdAndUpdate(req.userId, {
      $push: {
        history: {
          $each: [
            {
              userMessage,
              aiResponse: aiResponse || "",
              type,        // "CHAT" | "VOICE"
              timestamp: new Date(),
            },
          ],
          $slice: -200,  // keep last 200 entries
        },
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("saveChat error:", error);
    return res.status(500).json({ message: "saveChat error" });
  }
};

/* ── Get user history (newest first) ───────────────── */
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("history");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Reverse so newest is first
    const sorted = [...(user.history || [])].reverse();
    return res.status(200).json({ history: sorted });
  } catch (error) {
    console.log("getHistory error:", error);
    return res.status(500).json({ message: "getHistory error" });
  }
};

/* ── Dashboard stats ────────────────────────────────── */
export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("history createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    const history = user.history || [];
    const totalQueries = history.length;
    const voiceCount = history.filter((h) => h.type === "VOICE").length;
    const chatCount  = history.filter((h) => h.type === "CHAT").length;

    // Last 7 days
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d
        .toLocaleDateString("en", { weekday: "short" })
        .toUpperCase();
      const count = history.filter((h) => {
        const hd = new Date(h.timestamp);
        return hd.toDateString() === d.toDateString();
      }).length;
      weekData.push({ d: dayStr, v: count });
    }

    // Last 4 weeks
    const monthData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7 - 6);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      const count = history.filter((h) => {
        const hd = new Date(h.timestamp);
        return hd >= weekStart && hd <= weekEnd;
      }).length;
      monthData.push({ d: `W${4 - i}`, v: count });
    }

    // Recent 6 for activity feed
    const recentActivity = [...history]
      .reverse()
      .slice(0, 6)
      .map((h) => ({
        type:  h.type,
        label: h.userMessage?.slice(0, 55) || "",
        time:  h.timestamp,
        icon:  h.type === "VOICE" ? "🎙️" : "💬",
        color: h.type === "VOICE" ? "#00cfff" : "#5aefb8",
      }));

    const breakdown = [
      {
        label: "VOICE",
        pct: totalQueries ? +(voiceCount / totalQueries).toFixed(2) : 0,
        color: "#00cfff",
      },
      {
        label: "CHAT",
        pct: totalQueries ? +(chatCount / totalQueries).toFixed(2) : 0,
        color: "#5aefb8",
      },
    ];

    return res.status(200).json({
      totalQueries,
      voiceCount,
      chatCount,
      weekData,
      monthData,
      recentActivity,
      breakdown,
      memberSince: user.createdAt,
    });
  } catch (error) {
    console.log("getDashboardStats error:", error);
    return res.status(500).json({ message: "getDashboardStats error" });
  }
};

/* ── Ask AI assistant ───────────────────────────────── */
// ✅ NO history saving here — frontend's saveChat handles it
//    to avoid double-entries (askToAssistant was saving too)
export const askToAssistant = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userName      = user.name;
    const assistantName = user.Ainame || "Assistant";
    const { prompt: command } = req.body;

    if (!command || typeof command !== "string" || !command.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const result = await responseurl(command, assistantName, userName);
    if (!result) return res.status(500).json({ message: "AI response error" });

    const gemresult = result;
    const type = gemresult.type;
    let finalResponse = gemresult.response || "";

    // Date/time overrides
    if (type === "get_date")
      finalResponse = `current date is ${moment().format("YYYY-MM-DD")}`;
    if (type === "get_time")
      finalResponse = `current time is ${moment().format("hh:mm A")}`;
    if (type === "get_day")
      finalResponse = `today is ${moment().format("dddd")}`;
    if (type === "get_month")
      finalResponse = `Today is ${moment().format("MMMM")}`;

    // ✅ Do NOT save history here — Home.jsx calls /savechat separately
    // This prevents every voice command being saved TWICE

    return res.json({
      type,
      userInput: gemresult.userInput,
      response: finalResponse,
    });
  } catch (error) {
    console.log("askToAssistant error:", error);
    return res.status(500).json({ message: "askToAssistant error" });
  }
};