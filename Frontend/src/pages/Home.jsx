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

import { useContext, useEffect } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Component ke bahar hai kyunki isko koi state nahi chahiye
const handleAction = (data) => {
  const { type, userInput } = data;
  const query = encodeURIComponent(userInput || "");

  switch (type) {
    case "google_search":
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
      break;
    case "youtube_search":
    case "youtube_play":
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank",
      );
      break;
    case "instagram_open":
      window.open("https://www.instagram.com", "_blank");
      break;
    case "facebook_open":
      window.open("https://www.facebook.com", "_blank");
      break;
    case "weather-show":
      window.open(`https://www.google.com/search?q=weather+${query}`, "_blank");
      break;
    case "calculator_open":
      window.open("https://www.google.com/search?q=calculator", "_blank");
      break;
    default:
      break; // general/get_time etc — sirf speakText handle karega
  }
};
const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setuserData, getGeminiResponse } =
    useContext(UserDataContext);

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

  useEffect(() => {
    if (!userData) return;

    //take assistname from db
    const assistantName = userData?.Ainame?.trim() || "assistant";

    //check if browser supports speech recognition
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!speechRecognition) {
      console.log("SpeechRecognition is not supported by this browser.");
      return;
    }

    //convert speech to text
    const speakText = (text) => {
      if (!text) return;
      speechSynthesis.cancel(); //stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text); //convert text to speech
      utterance.lang = "en-US"; //hi-IN //en-GB
      utterance.rate = 0.95;
      speechSynthesis.speak(utterance); //give command to browser to speak
    };

    //check wake words
    const isAssistantTriggered = (transcript) => {
      const lowerTranscript = transcript.toLowerCase();
      const regex = new RegExp(`\\b(hey\\s+)?${assistantName}\\b`, "i");
      return regex.test(lowerTranscript);
    };

    //remove assistant name from command
    const stripAssistantName = (transcript) => {
      return transcript
        .replace(
          new RegExp(`\\b(hey\\s+)?${assistantName}\\b[,\\s]*`, "gi"),
          "",
        )
        .trim();
    };

    //open commands handler
    const openWebCommand = (target) => {
      const t = target.toLowerCase();
      if (t.includes("linkedin")) {
        window.open("https://www.linkedin.com", "_blank");
        return true;
      }
      if (t.includes("youtube")) {
        window.open("https://www.youtube.com", "_blank");
        return true;
      }
      if (t.includes("google")) {
        window.open("https://www.google.com", "_blank");
        return true;
      }
      if (t.includes("instagram")) {
        window.open("https://www.instagram.com", "_blank");
        return true;
      }
      if (t.includes("facebook")) {
        window.open("https://www.facebook.com", "_blank");
        return true;
      }
      if (t.includes("calculator")) {
        window.open("https://www.google.com/search?q=calculator", "_blank");
        return true;
      }
      if (t.includes("weather")) {
        window.open("https://www.google.com/search?q=weather", "_blank");
        return true;
      }
      return false; // koi match nahi — Gemini handle karega
    };

    //handling function brain of speech recognition
    const handlecommand = async (rawTranscript) => {
      if (!isAssistantTriggered(rawTranscript)) return; //Wake word nahi hai toh ignore
      const commandText = stripAssistantName(rawTranscript); //Assistant name hata ke command
      if (!commandText || commandText.length < 3) return; //Garbage input check (noise/dot/single letter)
      console.log("Command to process:", commandText);

      const openMatch = commandText.match(/^open\s+(.+)/i); // "open" se shuru hota hai?
      if (openMatch) {
        const target = openMatch[1].trim();
        const opened = openWebCommand(target);
        if (opened) {
          speakText(`Opening ${target}`);
          return; // Gemini ki zaroorat nahi
        }
      }

      //final commmand jo bachi h vo gemini ko bhejenge
      const data = await getGeminiResponse(commandText);

      if (!data) {
        speakText("I couldn't connect. Please try again.");
        return;
      }

      // STEP 8 — URL kholo (agar applicable) + bolke batao
      handleAction(data);
      speakText(data.response || "Done!");
    };

    //recognition object
    const recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Voice input:", transcript);
      await handlecommand(transcript);
    };

    recognition.onerror = (e) => {
      const ignoredErrors = ["no-speech", "aborted", "audio-capture","network"];
      if (!ignoredErrors.includes(e.error)) {
        console.log("SpeechRecognition error:", e.error, e.message || "");
      }
      if (e.error === "not-allowed") {
        speakText("Please allow microphone access.");
      }
    };

    //restart
    recognition.onend = () => {
      try {
        recognition.start();
      } catch (e) {
        console.log("Restart error:", e);
      }
    };

    recognition.start();

    //cleanup
    return () => {
      recognition.onerror = null;
      recognition.onresult = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch (_) {}
    };
  }, [userData]);

  return (
    <div>
      <div className="w-full min-h-screen bg-linear-to-b from-black to-[#050353] flex flex-col justify-center items-center relative p-5 px-6 sm:px-16 md:px-24 lg:px-44 rounded-3xl">
        <div className="absolute top-5 right-6 flex gap-3">
          <button
            onClick={() => navigate("/customize")}
            className="px-4 py-2 text-sm text-white border border-purple-500 rounded-xl hover:bg-purple-500 transition-all duration-300 cursor-pointer"
          >
            Customize
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-white bg-red-500/20 border border-red-500 rounded-xl hover:bg-red-500 transition-all duration-300 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Assistant Image */}
        <div className="overflow-hidden w-[280px] h-[380px] rounded-3xl shadow-xl">
          <img
            src={userData?.AIimg}
            alt="Assistant"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="flex mt-4 justify-center items-center flex-col">
          <h1 className="text-white text-3xl font-bold mb-2">
            Hello, I'm{" "}
            <span className="text-purple-400">{userData?.Ainame}</span>
          </h1>
          <p className="text-white/60 text-sm mb-6">
            Your AI Assistant — How can I help you?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
