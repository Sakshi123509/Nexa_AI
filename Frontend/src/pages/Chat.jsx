import { useState, useRef, useEffect, useContext } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import img from "../assets/Gemini_Generated.png";
// import { serverUrl } from "../config.js";

function timestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SUGGESTIONS = [
  "Explain binary search",
  "Write Python code for sorting",
  "What is machine learning?",
  "Tell me a fun fact",
];

// ── Voice settings available ──
const VOICES_CONFIG = {
  pitch: 1, // 0 to 2
  rate: 0.95, // 0.1 to 10
  lang: "en-US",
};

const Chat = () => {
  const { userData, serverUrl, getGeminiResponse } =
    useContext(UserDataContext);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hello! I'm ${userData?.Ainame || "your assistant"} — ready to help. What's on your mind?`,
      time: timestamp(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [transcript, setTranscript] = useState("");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  // ── Speak text with pitch/rate/lang controls ────────────────
  const speakText = (text) => {
    if (!text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = VOICES_CONFIG.lang;
    u.pitch = VOICES_CONFIG.pitch;
    u.rate = VOICES_CONFIG.rate;
    speechSynthesis.speak(u);
  };

  // ── Save to backend history ─────────────────────────────────
  const saveToHistory = async (userMessage, aiResponse, type = "CHAT") => {
    try {
      await axios.post(
        `/api/user/savechat`,
        { userMessage, aiResponse, type },
        { withCredentials: true },
      );
    } catch (_) {
      /* non-blocking */
    }
  };

  // ── Send text message → Gemini via backend ──────────────────
  const sendMessage = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", text: trimmed, time: timestamp() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      // Uses your existing getGeminiResponse (asktoassistant route)
      const data = await getGeminiResponse(trimmed);
      const reply =
        data?.response || "I'm not sure about that. Can you rephrase?";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply, time: timestamp() },
      ]);
      speakText(reply);

      // Save to DB history
      await saveToHistory(trimmed, reply, "CHAT");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠ CONNECTION_ERROR — please try again.",
          time: timestamp(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    speechSynthesis.cancel();
    setMessages([
      {
        role: "assistant",
        text: "Session cleared. How can I help?",
        time: timestamp(),
      },
    ]);
  };

  // ── Voice input in chat ─────────────────────────────────────
  const toggleVoice = () => {
    if (voiceActive) {
      recognitionRef.current?.stop();
      setVoiceActive(false);
      setTranscript("");
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Browser does not support voice input");
      return;
    }

    const rec = new SR();
    rec.continuous = true;
    rec.lang = "en-US";
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interim = "",
        final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(interim || final);
      if (final.trim()) {
        setTranscript("");
        sendMessage(final.trim());
      }
    };

    rec.onend = () => {
      setVoiceActive(false);
      setTranscript("");
    };
    rec.start();
    recognitionRef.current = rec;
    setVoiceActive(true);
  };

  // ── Sidebar offset ──────────────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#030f1a",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <div
        style={{
          marginLeft: window.innerWidth <= 768 ? 0 : 224,
          flex: 1,
          display: "flex",
          width: "100%",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid bg */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,207,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,207,255,0.025) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── TOP BAR ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: window.innerWidth <= 768 ? "10px 14px" : "12px 20px",
            borderBottom: "1px solid rgba(0,229,255,0.12)",
            background: "rgba(4,12,28,0.95)",
            zIndex: 10,
            flexShrink: 0,
            backdropFilter: "blur(8px)",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid rgba(0,207,255,0.4)",
                flexShrink: 0,
                background: "rgba(0,207,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {userData?.AIimg ? (
                <img
                  src={userData.AIimg}
                  alt="ai"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 18 }}>🤖</span>
              )}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 12,
                  color: "#00e5ff",
                  letterSpacing: "2px",
                  margin: 0,
                }}
              >
                {userData?.Ainame?.toUpperCase() || "ASSISTANT"}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: loading ? "#f0a060" : "#00cfff",
                    transition: "background 0.3s",
                  }}
                />
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: "rgba(0,207,255,0.5)",
                    letterSpacing: "1px",
                  }}
                >
                  {loading ? "THINKING..." : "ONLINE · READY"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            style={{
              background: "transparent",
              border: "1px solid rgba(0,229,255,0.15)",
              borderRadius: 6,
              padding: "5px 12px",
              color: "rgba(0,207,255,0.5)",
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            CLR
          </button>
        </div>

        {/* ── MESSAGES ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
         padding: window.innerWidth <= 768 ? "12px 10px" : "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            position: "relative",
            zIndex: 1,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,207,255,0.2) transparent",
          }}
        >
          {/* Background layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.18,
              filter: "brightness(35%)",
              zIndex: -1,
            }}
          />

          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: "rgba(0,207,255,0.25)",
                letterSpacing: "2px",
                background: "rgba(0,207,255,0.04)",
                border: "1px solid rgba(0,229,255,0.08)",
                borderRadius: 20,
                padding: "3px 14px",
              }}
            >
              SESSION_STARTED · {new Date().toLocaleDateString()}
            </span>
          </div>

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
              maxWidth: window.innerWidth <= 768 ? "94%" : "82%",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                animation: "fadeUp 0.25s ease",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `1px solid ${msg.role === "user" ? "rgba(0,150,255,0.3)" : "rgba(0,207,255,0.25)"}`,
                  background:
                    msg.role === "user"
                      ? "rgba(0,100,180,0.2)"
                      : "rgba(0,207,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                  overflow: "hidden",
                }}
              >
                {msg.role === "user" ? (
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      color: "#5ab8ff",
                      fontWeight: 700,
                    }}
                  >
                    {userData?.name?.slice(0, 2).toUpperCase() || "U"}
                  </span>
                ) : userData?.AIimg ? (
                  <img
                    src={userData.AIimg}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 14 }}>🤖</span>
                )}
              </div>
              {/* Bubble */}
              <div style={{ maxWidth: "100%" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    background:
                      msg.role === "user"
                        ? "rgba(0,60,120,0.45)"
                        : "rgba(0,25,55,0.85)",
                    border: `1px solid ${msg.role === "user" ? "rgba(0,150,255,0.2)" : "rgba(0,229,255,0.12)"}`,
                    borderRadius:
                      msg.role === "user"
                        ? "12px 2px 12px 12px"
                        : "2px 12px 12px 12px",
                    color: msg.isError ? "#ff6080" : "#c8e8f0",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text.includes("```") ? (
                    <FormattedMessage text={msg.text} />
                  ) : (
                    <span
                      style={{
                        fontFamily: "system-ui,sans-serif",
                        fontSize: 14,
                        lineHeight: 1.65,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.text}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: "rgba(0,207,255,0.3)",
                    marginTop: 4,
                    textAlign: msg.role === "user" ? "right" : "left",
                    letterSpacing: "1px",
                  }}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div
              style={{
                display: "flex",
                gap: 10,
                maxWidth: "82%",
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,207,255,0.25)",
                  background: "rgba(0,207,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                🤖
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(0,25,55,0.85)",
                  border: "1px solid rgba(0,229,255,0.12)",
                  borderRadius: "2px 12px 12px 12px",
                }}
              >
                <TypingDots />
              </div>
            </div>
          )}

          {/* Live voice transcript */}
          {voiceActive && transcript && (
            <div
              style={{
                alignSelf: "flex-end",
                background: "rgba(0,207,255,0.06)",
                border: "1px solid rgba(0,207,255,0.2)",
                borderRadius: 10,
                padding: "8px 14px",
                maxWidth: "82%",
                color: "rgba(0,207,255,0.7)",
                fontFamily: "system-ui",
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              🎤 {transcript}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── SUGGESTIONS ── */}
        <div
          style={{
            padding: "0 24px 10px",
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                background: "rgba(0,207,255,0.05)",
                border: "1px solid rgba(0,229,255,0.15)",
                borderRadius: 20,
                padding: "5px 13px",
                color: "rgba(0,207,255,0.6)",
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "1px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── INPUT BAR ── */}
        <div
          style={{
            padding: "10px 24px 16px",
            borderTop: "1px solid rgba(0,229,255,0.1)",
            background: "rgba(4,12,28,0.8)",
            zIndex: 10,
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKey}
              placeholder={
                voiceActive
                  ? "🎤 Listening — speak your question..."
                  : "Type a message... (Enter to send)"
              }
              rows={1}
              style={{
                width: "100%",
                padding: "12px 44px 12px 14px",
                background: "rgba(0,20,50,0.7)",
                border: "1px solid rgba(0,229,255,0.18)",
                borderRadius: 10,
                color: "#c8e8f0",
                fontFamily: "system-ui,sans-serif",
                fontSize: 14,
                lineHeight: 1.5,
                resize: "none",
                outline: "none",
                maxHeight: 120,
                transition: "border-color 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(0,207,255,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(0,229,255,0.18)")
              }
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
                width: 30,
                height: 30,
                background: "rgba(0,207,255,0.15)",
                border: "1px solid rgba(0,207,255,0.35)",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.4 : 1,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00cfff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Voice button */}
          <button
            onClick={toggleVoice}
            title={voiceActive ? "Stop listening" : "Voice input"}
            style={{
              width: 44,
              height: 44,
              border: `1px solid ${voiceActive ? "rgba(0,207,255,0.6)" : "rgba(0,229,255,0.18)"}`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              background: voiceActive
                ? "rgba(0,207,255,0.18)"
                : "rgba(0,207,255,0.06)",
              transition: "all 0.3s",
              animation: voiceActive ? "nexaPulse 1.5s infinite" : "none",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke={voiceActive ? "#00cfff" : "rgba(0,207,255,0.5)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes nexaPulse { 0%,100%{opacity:1}50%{opacity:0.5} }
        @keyframes typingDot { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
};

function FormattedMessage({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div
      style={{
        fontFamily: "system-ui,sans-serif",
        fontSize: 14,
        lineHeight: 1.65,
      }}
    >
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const lang = part.match(/```(\w*)/)?.[1] || "";
          const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre
              key={i}
              style={{
                background: "rgba(0,10,30,0.9)",
                border: "1px solid rgba(0,229,255,0.15)",
                borderRadius: 8,
                padding: "12px 14px",
                fontFamily: "'Courier New',monospace",
                fontSize: 12,
                color: "#7fd4ff",
                overflowX: "auto",
                margin: "8px 0",
                whiteSpace: "pre-wrap",
                position: "relative",
              }}
            >
              {lang && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 10,
                    fontSize: 9,
                    color: "rgba(0,207,255,0.35)",
                    letterSpacing: "1px",
                  }}
                >
                  {lang.toUpperCase()}
                </span>
              )}
              {code}
            </pre>
          );
        }
        return (
          <span key={i} style={{ whiteSpace: "pre-wrap" }}>
            {part}
          </span>
        );
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        alignItems: "center",
        padding: "2px 0",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#00cfff",
            opacity: 0.7,
            animation: `typingDot 1.2s ${i * 0.2}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

export default Chat;
