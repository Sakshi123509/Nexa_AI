// import { useContext, useEffect } from "react";
// import { UserDataContext } from "../contextAPI/Usercontext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// // import responseurl from "../../../Backend/gemini_api";
// // responseurl import NAHI karna frontend mein!

// const Home = () => {
//   const navigate = useNavigate();
//   const { userData, serverUrl, setuserData, getGeminiResponse } =
//     useContext(UserDataContext);

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, {
//         withCredentials: true,
//       });
//       setuserData(null);
//       navigate("/login");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (!userData) return;

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.log("SpeechRecognition is not supported by this browser.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = "en-US";
//     recognition.interimResults = false;

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       console.log("voice:", transcript);
//       console.log(e.results);

//       if (transcript.toLowerCase().includes(userData?.Ainame?.toLowerCase())) {
//         const data = await getGeminiResponse(transcript);
//         console.log("Gemini data:", data);
//         if (data?.response) {
//           const utterance = new SpeechSynthesisUtterance(data.response);
//           utterance.lang = "en-US";
//           utterance.rate = 0.9;
//           speechSynthesis.speak(utterance);
//         }
//       }
//     };

//     recognition.onerror = (e) => {
//       const ignoredErrors = ["no-speech", "aborted", "audio-capture"];
//       if (!ignoredErrors.includes(e.error)) {
//         console.log("SpeechRecognition error:", e.error, e.message || "");
//       }
//     };

//     recognition.onend = () => {
//       try {
//         recognition.start();
//       } catch (e) {
//         console.log("Restart error:", e);
//       }
//     };

//     recognition.start();

//     return () => {
//       recognition.onerror = null;
//       recognition.onresult = null;
//       recognition.onend = null;
//       try {
//         recognition.abort?.();
//         recognition.stop?.();
//       } catch (e) {
//         console.log("SpeechRecognition cleanup error:", e);
//       }
//     };
//   }, [userData]);
//   return (
//     <div>
//       <div className="w-full min-h-screen bg-linear-to-b from-black to-[#050353] flex flex-col justify-center items-center relative p-5 px-6 sm:px-16 md:px-24 lg:px-44 rounded-3xl">
//         <div className="absolute top-5 right-6 flex gap-3">
//           <button
//             onClick={() => navigate("/customize")}
//             className="px-4 py-2 text-sm text-white border border-purple-500 rounded-xl hover:bg-purple-500 transition-all duration-300 cursor-pointer"
//           >
//             Customize
//           </button>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 text-sm text-white bg-red-500/20 border border-red-500 rounded-xl hover:bg-red-500 transition-all duration-300 cursor-pointer"
//           >
//             Logout
//           </button>
//         </div>

//         {/* Image — fixed size */}
//         <div className="overflow-hidden w-[280px] h-[380px] rounded-3xl shadow-xl">
//           <img
//             src={userData?.AIimg}
//             alt=""
//             className="w-full h-full object-cover object-top"
//           />
//         </div>

//         <div className="flex mt-4 justify-center items-center flex-col">
//           <h1 className="text-white text-3xl font-bold mb-2">
//             Hello, I'm{" "}
//             <span className="text-purple-400">{userData?.Ainame}</span>
//           </h1>
//           <p className="text-white/60 text-sm mb-6">
//             Your AI Assistant — How can I help you?
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Home;

import { useContext, useEffect, useState, useRef } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { initNeuralBackground } from "../components/Animation.jsx";
import { RiFontFamily } from "react-icons/ri";
import Navbar from "../components/Navbar.jsx";

const handleAction = (data) => {
  const { type, userInput } = data;
  const query = encodeURIComponent(userInput || "");

  switch (type) {
    // ── Google search ────────────────────────────────────────
    case "google_search":
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
      break;

    // ── YouTube: best autoplay trick available without API key ──
    // youtube.com/results doesn't autoplay — but this search URL
    // lands on results and the user just hits the first video.
    // True autoplay needs the YouTube Data API (free quota).
    case "youtube_search":
    case "youtube_play":
      // Opens YouTube search — first result is always the song
      window.open(
        `https://open.spotify.com/search/${encodeURIComponent(userInput)}`,
        // `https://www.youtube.com/results?search_query=${query}`,
        "_blank",
      );

      break;
    // ── LinkedIn: opens specific person's profile search ────
    case "linkedin_open":
      if (userInput && userInput.toLowerCase() !== "linkedin") {
        // "open Elon Musk LinkedIn" → search for Elon Musk on LinkedIn
        window.open(
          `https://www.linkedin.com/search/results/people/?keywords=${query}`,
          "_blank",
        );
      } else {
        window.open("https://www.linkedin.com/feed/", "_blank");
      }
      break;

    // ── Instagram ───────────────────────────────────────────
    case "instagram_open":
      window.open("https://www.instagram.com", "_blank");
      break;

    // ── Facebook ────────────────────────────────────────────
    case "facebook_open":
      window.open("https://www.facebook.com", "_blank");
      break;

    // ── Weather: FIXED — was "weather-show", Gemini returns "weather_show"
    case "weather_show":
    case "weather-show": // keep both to be safe
      window.open(
        `https://www.google.com/search?q=weather+${query || "today"}`,
        "_blank",
      );
      break;

    // ── Calculator: NOW passes the equation to Google ───────
    // "what is 25 * 48" → Google shows the answer inline
    // "open calculator"  → just opens Google calculator
    case "calculator_open":
      if (userInput && userInput.trim().length > 0) {
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
      } else {
        window.open(`https://www.google.com/search?q=calculator`, "_blank");
      }
      break;

    // ── Maps ────────────────────────────────────────────────
    case "maps_open":
      window.open(`https://www.google.com/maps/search/${query}`, "_blank");
      break;

    // ── General: Gemini answered a question (binary search, etc.)
    // speakText is passed in from Home.jsx so TTS reads the answer
    case "general":
    default:
      if (response && speakText) {
        speakText(response);
      }
      break;
  }
};

const Home = () => {
  const navigate = useNavigate();
  //start listning
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const { userData, serverUrl, setuserData, getGeminiResponse } =
    useContext(UserDataContext);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      return initNeuralBackground(canvasRef.current);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setuserData(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser not supported");
      return;
    }

    const assistantName = userData?.Ainame?.toLowerCase() || "assistant";

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    const speakText = (text) => {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      console.log("You said:", transcript);

      // 🎯 assistant trigger
      if (!transcript.toLowerCase().includes(assistantName)) return;

      const cleanText = transcript
        .toLowerCase()
        .replace(assistantName, "")
        .trim();

      if (!cleanText) return;

      const data = await getGeminiResponse(cleanText);

      if (data) {
        handleAction(data);
      }

      if (data?.response) {
        speakText(data.response);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // useEffect(() => {
  //   if (!userData) return;

  //   const assistantName = userData?.Ainame?.trim() || "assistant";

  //   const speechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition;

  //   if (!speechRecognition) {
  //     console.log("SpeechRecognition not supported");
  //     return;
  //   }

  //   const speakText = (text) => {
  //     if (!text) return;
  //     speechSynthesis.cancel();
  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.lang = "en-US";
  //     utterance.rate = 0.95;
  //     speechSynthesis.speak(utterance);
  //   };

  //   const isAssistantTriggered = (transcript) => {
  //     const regex = new RegExp(`\\b(hey\\s+)?${assistantName}\\b`, "i");
  //     return regex.test(transcript.toLowerCase());
  //   };

  //   const stripAssistantName = (transcript) => {
  //     return transcript
  //       .replace(
  //         new RegExp(`\\b(hey\\s+)?${assistantName}\\b[,\\s]*`, "gi"),
  //         "",
  //       )
  //       .trim();
  //   };

  //   const openWebCommand = (target) => {
  //     const t = target.toLowerCase();

  //     if (t.includes("linkedin")) {
  //       window.open("https://www.linkedin.com", "_blank");
  //       return true;
  //     }
  //     if (t.includes("youtube")) {
  //       window.open("https://www.youtube.com", "_blank");
  //       return true;
  //     }
  //     if (t.includes("google")) {
  //       window.open("https://www.google.com", "_blank");
  //       return true;
  //     }
  //     if (t.includes("instagram")) {
  //       window.open("https://www.instagram.com", "_blank");
  //       return true;
  //     }
  //     if (t.includes("facebook")) {
  //       window.open("https://www.facebook.com", "_blank");
  //       return true;
  //     }
  //     if (t.includes("calculator")) {
  //       window.open("https://www.google.com/search?q=calculator", "_blank");
  //       return true;
  //     }
  //     if (t.includes("weather")) {
  //       window.open("https://www.google.com/search?q=weather", "_blank");
  //       return true;
  //     }

  //     return false;
  //   };

  //   const handlecommand = async (rawTranscript) => {
  //     if (!isAssistantTriggered(rawTranscript)) return;

  //     const commandText = stripAssistantName(rawTranscript);
  //     if (!commandText || commandText.length < 3) return;

  //     const openMatch = commandText.match(/^open\s+(.+)/i);
  //     if (openMatch) {
  //       const target = openMatch[1].trim();
  //       const opened = openWebCommand(target);
  //       if (opened) {
  //         speakText(`Opening ${target}`);
  //         return;
  //       }
  //     }

  //     const data = await getGeminiResponse(commandText);

  //     if (!data) {
  //       speakText("I couldn't connect. Please try again.");
  //       return;
  //     }

  //     handleAction(data);
  //     speakText(data.response || "Done!");
  //   };

  //   const recognition = new speechRecognition();
  //   recognition.continuous = true;
  //   recognition.lang = "en-US";
  //   recognition.interimResults = false;

  //   recognition.onresult = async (e) => {
  //     const transcript = e.results[e.results.length - 1][0].transcript.trim();
  //     await handlecommand(transcript);
  //   };

  //   recognition.onerror = (e) => {
  //     if (e.error === "not-allowed") {
  //       speakText("Please allow microphone access.");
  //     }
  //   };

  //   recognition.onend = () => {
  //     try {
  //       recognition.start();
  //     } catch (e) {
  //       console.log("Restart error:", e);
  //     }
  //   };

  //   recognition.start();

  //   return () => {
  //     recognition.onresult = null;
  //     recognition.onerror = null;
  //     recognition.onend = null;
  //     try {
  //       recognition.abort();
  //     } catch (_) {}
  //   };
  // }, [userData, getGeminiResponse]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#05070a",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Navbar />
      {/* Canvas FIXED */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: "20px 24px",
          borderRadius: "24px",
          zIndex: 10,
          flexDirection: "column",
        }}
      >
        {/* Center Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Image */}
          <div
            style={{
              width: "260px",
              height: "260px",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 30px rgba(0,255,255,0.2)", // optional glow
            }}
          >
            <img
              src={userData?.AIimg}
              alt="Assistant"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Text */}
          <div
            style={{
              marginTop: "16px",
              fontFamily: "var(--font-main)",
            }}
          >
            <h1 style={{ fontSize: "24px" }}>
              Hello, I'm <span>{userData?.Ainame}</span>
            </h1>

            <p style={{ marginTop: "8px", opacity: 0.8 }}>
              Your AI Assistant — How can I help you?
            </p>
          </div>
          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#00f2ff",
              border: "none",
              cursor: "pointer",
              color: "var(--bg-soft)",
            }}
            onClick={() => {
              isListening ? stopListening() : startListening();
            }}
          >
            {isListening ? "🛑 Stop Listening" : "🎤 Start Listening"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

// import { useEffect, useRef } from "react";
// import bgImage from "../assets/bg.jpg";
// import { initNeuralBackground } from "./HomeAnimation"; // Make sure path is correct

// export default function Home() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (canvasRef.current) {
//       // Start the canvas animation
//       return initNeuralBackground(canvasRef.current);
//     }
//   }, []);

//   // --- Inline Styles ---
//   const rootStyle = {
//     position: "relative",
//     width: "100%",
//     minHeight: "100vh",
//     backgroundColor: "#05070a",
//     overflow: "hidden",
//   };

//   const bgLayerStyle = {
//     position: "absolute",
//     inset: 0,
//     backgroundImage: `url(${bgImage})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     zIndex: 0,
//     opacity: 0.6, // Thoda kam taaki particles dikhein
//     animation: "bgSubtleZoom 20s ease-in-out infinite alternate",
//   };

//   const canvasStyle = {
//     position: "absolute",
//     inset: 0,
//     zIndex: 5, // Image ke upar par content ke niche
//     pointerEvents: "none",
//   };

//   return (
//     <div style={rootStyle}>
//       {/* Layer 1: The Circuit Image */}
//       <div style={bgLayerStyle} />

//       {/* Layer 2: The Neural Canvas Animation */}
//       <canvas ref={canvasRef} style={canvasStyle} />

//       {/* Layer 3: Moving Data Particles (Optional) */}
//       <div style={dataStreamStyle} />

//       {/* Layer 4: Content */}
//       <div style={{ position: "relative", zIndex: 10 }}>
//         {/* Your Page Content Goes Here */}
//       </div>

//       <style>
//         {`
//           @keyframes bgSubtleZoom {
//             0% { transform: scale(1); filter: brightness(0.8); }
//             100% { transform: scale(1.1); filter: brightness(1.1); }
//           }
//           @keyframes dataFlow {
//             0% { transform: translateY(-100%); }
//             100% { transform: translateY(400%); }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// const dataStreamStyle = {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   background: "linear-gradient(to bottom, transparent, rgba(0, 242, 255, 0.03), transparent)",
//   zIndex: 2,
//   animation: "dataFlow 8s linear infinite",
// };

// return (
//   <div className="home-root">
//     {/* Internal CSS Injection */}
//     <style>{`
//       .home-root {
//         width: 100vw;
//         height: 100vh;
//         position: fixed;
//         top: 0;
//         left: 0;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         background: #05070a url(${homebg}) no-repeat center center/cover;
//         font-family: 'Inter', sans-serif;
//       }

//       .top-nav {
//         position: absolute;
//         top: 20px;
//         right: 30px;
//         display: flex;
//         gap: 12px;
//         z-index: 100;
//       }

//       .btn {
//         padding: 8px 20px;
//         border-radius: 10px;
//         font-size: 0.85rem;
//         font-weight: 600;
//         cursor: pointer;
//         transition: 0.3s ease;
//         border: 1px solid transparent;
//       }

//       .btn-customize {
//         background: rgba(168, 85, 247, 0.1);
//         color: #d8b4fe;
//         border-color: #a855f7;
//       }

//       .btn-customize:hover {
//         background: #a855f7;
//         color: white;
//         box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
//       }

//       .btn-logout {
//         background: rgba(239, 68, 68, 0.1);
//         color: #fca5a5;
//         border-color: #ef4444;
//       }

//       .btn-logout:hover {
//         background: #ef4444;
//         color: white;
//       }

//       .main-card {
//         background: rgba(10, 15, 30, 0.7);
//         backdrop-filter: blur(20px);
//         -webkit-backdrop-filter: blur(20px);
//         border: 1px solid rgba(255, 255, 255, 0.1);
//         border-radius: 35px;
//         padding: 40px;
//         text-align: center;
//         box-shadow: 0 20px 40px rgba(0,0,0,0.6);
//         animation: float 5s ease-in-out infinite;
//         max-width: 400px;
//         width: 85%;
//       }

//       @keyframes float {
//         0%, 100% { transform: translateY(0); }
//         50% { transform: translateY(-15px); }
//       }

//       .avatar-box {
//         width: 220px;
//         height: 300px;
//         margin: 0 auto 25px;
//         border-radius: 20px;
//         overflow: hidden;
//         border: 2px solid rgba(0, 242, 255, 0.3);
//         box-shadow: 0 0 20px rgba(0, 242, 255, 0.15);
//       }

//       .avatar-img {
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//         object-position: top;
//       }

//       .title {
//         color: white;
//         font-size: 2rem;
//         margin: 0;
//         font-weight: 700;
//       }

//       .highlight {
//         color: #00f2ff;
//         text-shadow: 0 0 10px rgba(0, 242, 255, 0.3);
//       }

//       .subtitle {
//         color: rgba(255, 255, 255, 0.5);
//         font-size: 0.95rem;
//         margin-top: 10px;
//       }
//     `}</style>

//     <div className="top-nav">
//       <button onClick={() => navigate("/customize")} className="btn btn-customize">Customize</button>
//       <button onClick={handleLogout} className="btn btn-logout">Logout</button>
//     </div>

//     <div className="main-card">
//       <div className="avatar-box">
//         <img src={userData?.AIimg} alt="AI" className="avatar-img" />
//       </div>
//       <h1 className="title">
//         Hello, I'm <span className="highlight">{userData?.Ainame}</span>
//       </h1>
//       <p className="subtitle">Your Intelligence Assistant</p>
//     </div>
//   </div>
// );
