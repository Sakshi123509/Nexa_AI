//final
// src/pages/Home.jsx
// NO SpeechContext needed — everything is self-contained here
// Voice settings (language, gender, volume) are stored in localStorage directly

import { useContext, useEffect, useState, useRef } from "react";
import { UserDataContext } from "../contextAPI/Usercontext.jsx";
import { useNavigate } from "react-router-dom";
// import { serverUrl } from "../config.js";
import axios from "axios";
import { initNeuralBackground } from "../components/Animation.jsx";
import Navbar from "../components/Navbar.jsx";

/* ── Load / Save voice settings from localStorage ───── */
const STORAGE_KEY = "ai_voice_settings";

function loadVoiceSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { language: "English", gender: "Female", volume: 1, rate: 1 };
  } catch {
    return { language: "English", gender: "Female", volume: 1, rate: 1 };
  }
}

function saveVoiceSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/* ── Language code map ───────────────────────────────── */
const LANG_CODES = { English: "en-US", Hindi: "hi-IN", Marathi: "mr-IN" };

/* ── Pick best matching browser voice ───────────────── */
function pickVoice(voices, langCode, gender) {
  const femaleHints = [
    "female",
    "woman",
    "zira",
    "susan",
    "hazel",
    "samantha",
    "google",
  ];
  const maleHints = ["male", "man", "david", "mark", "daniel", "james"];
  const hints = gender === "Female" ? femaleHints : maleHints;
  const matchGender = (v) =>
    hints.some((h) => v.name.toLowerCase().includes(h));

  const exact = voices.filter((v) => v.lang === langCode);
  const exactG = exact.filter(matchGender);
  if (exactG.length) return exactG[0];
  if (exact.length) return exact[0];

  const prefix = langCode.split("-")[0];
  const broad = voices.filter((v) => v.lang.startsWith(prefix));
  const broadG = broad.filter(matchGender);
  if (broadG.length) return broadG[0];
  if (broad.length) return broad[0];

  return null;
}

/* ── Action handler (open URLs) ─────────────────────── */
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
    case "linkedin_open":
      window.open(
        userInput?.toLowerCase() !== "linkedin"
          ? `https://www.linkedin.com/search/results/people/?keywords=${query}`
          : "https://www.linkedin.com/feed/",
        "_blank",
      );
      break;
    case "instagram_open":
      window.open("https://www.instagram.com", "_blank");
      break;
    case "facebook_open":
      window.open("https://www.facebook.com", "_blank");
      break;
    case "weather_show":
    case "weather-show":
      window.open(`https://www.google.com/search?q=weather+${query}`, "_blank");
      break;
    case "calculator_open":
      window.open("https://www.google.com/search?q=calculator", "_blank");
      break;
    case "maps_open":
      window.open(`https://www.google.com/maps/search/${query}`, "_blank");
      break;
    default:
      break;
  }
};

/* ── Home ────────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setuserData, getGeminiResponse } =
    useContext(UserDataContext);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Voice settings — loaded from localStorage, saved on every change
  const [voiceSettings, setVoiceSettingsState] = useState(loadVoiceSettings);

  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const voicesRef = useRef([]); // browser voices list

  // Helper to update settings + auto-save
  const setVoiceSettings = (updater) => {
    setVoiceSettingsState((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      saveVoiceSettings(next);
      return next;
    });
  };

  // Init canvas
  useEffect(() => {
    if (canvasRef.current) return initNeuralBackground(canvasRef.current);
  }, []);

  // Load browser voices
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) voicesRef.current = v;
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Track speaking state
  useEffect(() => {
    const id = setInterval(
      () => setIsSpeaking(window.speechSynthesis.speaking),
      200,
    );
    return () => clearInterval(id);
  }, []);

  /* ── Speak text using current voice settings ─────── */
  const speakText = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = LANG_CODES[voiceSettings.language] || "en-US";
    const bestVoice = pickVoice(
      voicesRef.current,
      langCode,
      voiceSettings.gender,
    );

    if (bestVoice) utterance.voice = bestVoice;
    utterance.lang = langCode;
    utterance.volume = voiceSettings.volume;
    utterance.rate = voiceSettings.rate;

    window.speechSynthesis.speak(utterance);
  };

  /* ── Save interaction to backend ─────────────────────
     THIS is what makes History page and Dashboard work  */
  const saveChat = async (userMessage, aiText) => {
    try {
      await axios.post(
        `/api/user/savechat`,
        { userMessage, aiResponse: aiText, type: "VOICE" },
        { withCredentials: true },
      );
      console.log("✅ Saved to history");
    } catch (err) {
      console.log("saveChat error:", err.message);
    }
  };

  /* ── Logout ── */
  const handleLogout = async () => {
    try {
      window.speechSynthesis.cancel();
      await axios.get(`/api/auth/logout`, {
        withCredentials: true,
      });
      setuserData(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  /* ── Start listening ─────────────────────────────── */
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice not supported. Use Chrome.");
      return;
    }

    const assistantName = userData?.Ainame?.toLowerCase() || "assistant";
    const recogLang = LANG_CODES[voiceSettings.language] || "en-US";

    const recognition = new SR();
    recognition.continuous = true;
    recognition.lang = recogLang;
    recognition.interimResults = false;

    recognition.onresult = async (e) => {
      const said = e.results[e.results.length - 1][0].transcript.trim();
      console.log("🎤 You said:", said);
      setTranscript(said);

      // Only respond if assistant name is mentioned
      if (!said.toLowerCase().includes(assistantName)) return;

      // Strip assistant name from command
      const command = said
        .toLowerCase()
        .replace(new RegExp(assistantName, "gi"), "")
        .trim();
      if (!command) return;

      setIsProcessing(true);
      try {
        const data = await getGeminiResponse(command);

        if (!data) {
          const errMsg = "Sorry, I couldn't connect. Please try again.";
          setAiResponse(errMsg);
          speakText(errMsg);
          await saveChat(command, errMsg); // save even errors
          return;
        }

        const aiText = data.response || "";
        setAiResponse(aiText);

        // ✅ Save to history — this updates History page + Dashboard stats
        await saveChat(command, aiText);

        // Open URLs for google/youtube etc.
        handleAction(data);

        // Speak the response
        if (aiText) speakText(aiText);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = (e) => {
      const ignored = ["no-speech", "aborted", "audio-capture"];
      if (!ignored.includes(e.error))
        console.log("Recognition error:", e.error);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    setIsListening(false);
  };

  /* ── Render ─────────────────────────────────────────── */
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

      {/* ⚙ Settings button — top right */}
      <button
        onClick={() => setShowSettings(true)}
        style={{
          position: "fixed",
          top: 16,
          right: 20,
          zIndex: 20,
          background: "rgba(0,242,255,0.08)",
          border: "1px solid rgba(0,242,255,0.2)",
          color: "#00f2ff",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        ⚙
      </button>

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
          paddingLeft: window.innerWidth <= 768 ? "0px" : "224px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          padding: window.innerWidth <= 480 ? "20px 12px" : "20px 24px",
          zIndex: 10,
        }}
      >
        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: "50%",
              overflow: "hidden",
              transition: "box-shadow 0.4s ease",
              boxShadow: isListening
                ? "0 0 0 4px #00f2ff, 0 0 50px rgba(0,242,255,0.5)"
                : isSpeaking
                  ? "0 0 0 4px #5aefb8, 0 0 40px rgba(90,239,184,0.4)"
                  : "0 0 30px rgba(0,255,255,0.15)",
              width: window.innerWidth <= 480 ? 180 : 260,
              height: window.innerWidth <= 480 ? 180 : 260,
              margin: "0 auto",
            }}
          >
            <img
              src={userData?.AIimg}
              alt="Assistant"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <h1
            style={{
              fontSize: 26,
              margin: "16px 0 0",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Hello, I'm{" "}
            <span
              style={{
                color: "#00f2ff",
                textShadow: "0 0 12px rgba(0,242,255,0.4)",
              }}
            >
              {userData?.Ainame}
            </span>
          </h1>

          <p
            style={{
              marginTop: 8,
              opacity: 0.5,
              fontSize: 14,
              fontFamily: "monospace",
              color: "#fff",
            }}
          >
            Your AI Assistant — How can I help you?
          </p>

          {/* Active settings badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 10,
              padding: "4px 14px",
              borderRadius: 999,
              background: "rgba(0,242,255,0.08)",
              border: "1px solid rgba(0,242,255,0.2)",
              fontSize: 11,
              fontFamily: "monospace",
              color: "#00f2ff",
            }}
          >
            🌐 {voiceSettings.language} · {voiceSettings.gender} · Vol{" "}
            {Math.round(voiceSettings.volume * 100)}%
          </div>

          {/* Listen button */}
          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              marginTop: 24,
              padding: "12px 32px",
              borderRadius: 12,
              fontSize: 14,
              fontFamily: "monospace",
              letterSpacing: "0.5px",
              cursor: "pointer",
              border: `1px solid ${isListening ? "#ef4444" : "#00f2ff"}`,
              background: isListening
                ? "rgba(239,68,68,0.12)"
                : "rgba(0,242,255,0.1)",
              color: isListening ? "#ef4444" : "#00f2ff",
              transition: "all .2s",
            }}
          >
            {isListening ? "🛑 Stop Listening" : "🎤 Start Listening"}
          </button>

          {/* Status */}
          <div
            style={{
              marginTop: 10,
              height: 20,
              fontFamily: "monospace",
              fontSize: 11,
            }}
          >
            {isProcessing && (
              <span style={{ color: "#f0a060" }}>⏳ PROCESSING...</span>
            )}
            {isSpeaking && !isProcessing && (
              <span style={{ color: "#5aefb8" }}>● SPEAKING...</span>
            )}
            {isListening && !isProcessing && !isSpeaking && (
              <span style={{ color: "#00f2ff" }}>● LISTENING...</span>
            )}
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            maxWidth: 680,
            width: "100%",
            color: "#fff",
            fontSize: 14,

            borderRadius: 14,
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: transcript ? "#fff" : "rgba(255,255,255,0.3)",
              margin: 0,
            }}
          >
            {transcript ? `🎤 You: ${transcript}` : "Say something..."}
          </p>
          {aiResponse && (
            <p style={{ marginTop: 12, color: "#00f2ff", margin: "12px 0 0" }}>
              🤖 {userData?.Ainame}: {aiResponse}
            </p>
          )}
        </div>
        {/* Transcript + response box */}
        {/* <div
        >
          <p
            style={{
              color: transcript ? "#fff" : "rgba(255,255,255,0.3)",
              margin: 0,
            }}
          >
            {transcript
              ? `🎤 ${transcript}`
              : `Say "${userData?.Ainame}" to begin...`}
          </p>
          {aiResponse && (
            <p style={{ marginTop: 12, color: "#00f2ff", margin: "12px 0 0" }}>
              🤖 {aiResponse}
            </p>
          )}
        </div> */}
      </div>
      {/* ── Side Settings Drawer ── */}
      {showSettings && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowSettings(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 30,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Drawer panel */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: window.innerWidth <= 480 ? "100%" : 300,
              zIndex: 40,
              background: "#050e1a",
              borderLeft: "1px solid rgba(0,229,255,0.12)",
              padding: "24px 20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "rgba(0,207,255,0.5)",
                  letterSpacing: "2px",
                }}
              >
                VOICE SETTINGS
              </span>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: 18,
                  cursor: "pointer",
                  opacity: 0.5,
                }}
              >
                ✕
              </button>
            </div>

            {/* Language */}
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "rgba(0,207,255,0.4)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                LANGUAGE
              </label>
              <select
                value={voiceSettings.language}
                onChange={(e) =>
                  setVoiceSettings((s) => ({ ...s, language: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(0,229,255,0.15)",
                  borderRadius: 8,
                  color: "#e0f4ff",
                  fontSize: 13,
                  outline: "none",
                }}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "rgba(0,207,255,0.4)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                VOICE TYPE
              </label>
              <select
                value={voiceSettings.gender}
                onChange={(e) =>
                  setVoiceSettings((s) => ({ ...s, gender: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(0,229,255,0.15)",
                  borderRadius: 8,
                  color: "#e0f4ff",
                  fontSize: 13,
                  outline: "none",
                }}
              >
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>

            {/* Volume */}
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "rgba(0,207,255,0.4)",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span>VOLUME</span>
                <span style={{ color: "#00cfff" }}>
                  {Math.round(voiceSettings.volume * 100)}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(voiceSettings.volume * 100)}
                onChange={(e) =>
                  setVoiceSettings((s) => ({
                    ...s,
                    volume: Number(e.target.value) / 100,
                  }))
                }
                style={{ width: "100%", accentColor: "#00cfff" }}
              />
            </div>

            {/* Speed */}
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "rgba(0,207,255,0.4)",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span>SPEED</span>
                <span style={{ color: "#00cfff" }}>
                  {voiceSettings.rate.toFixed(1)}x
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(((voiceSettings.rate - 0.5) / 1.5) * 100)}
                onChange={(e) =>
                  setVoiceSettings((s) => ({
                    ...s,
                    rate: 0.5 + (Number(e.target.value) / 100) * 1.5,
                  }))
                }
                style={{ width: "100%", accentColor: "#00cfff" }}
              />
            </div>

            {/* Test button */}
            <button
              onClick={() =>
                speakText(
                  `Hello, I am ${userData?.Ainame || "your assistant"}. Voice settings applied.`,
                )
              }
              style={{
                padding: "9px 18px",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "monospace",
                cursor: "pointer",
                border: "1px solid rgba(0,207,255,0.2)",
                background: "rgba(0,207,255,0.08)",
                color: "#00cfff",
              }}
            >
              🔊 Test Voice
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
