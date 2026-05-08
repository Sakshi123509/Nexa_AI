import { useState, useRef, useEffect, useContext } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import axios from "axios";

/* ─── quick-reply suggestions ─────────────────────── */
const SUGGESTIONS = [
  "Explain in detail",
  "Give me an example",
  "Summarise this",
  "Write code for this",
];

/* ─── helpers ──────────────────────────────────────── */
function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const Chat = () => {
  const { userData, serverUrl } = useContext(UserDataContext);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hello! I'm ${userData?.assistantName || "your assistant"} — ready to help. What's on your mind?`,
      time: timestamp(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* auto-resize textarea */
  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const sendMessage = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", text: trimmed, time: timestamp() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/chat`,
        { message: trimmed },
        { withCredentials: true }
      );
      const reply = res.data?.reply || "...";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply, time: timestamp() },
      ]);
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

  const clearChat = () =>
    setMessages([
      {
        role: "assistant",
        text: `Session cleared. How can I help?`,
        time: timestamp(),
      },
    ]);

  return (
    <div style={S.page}>
      {/* grid bg */}
      <div style={S.gridBg} />

      {/* ── TOP BAR ── */}
      <div style={S.topbar}>
        <div style={S.topbarLeft}>
          <div style={S.avatarSmall}>
            {userData?.assistantImage ? (
              <img
                src={userData.assistantImage}
                alt="assistant"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <span style={{ fontSize: 16 }}>🤖</span>
            )}
          </div>
          <div>
            <p style={S.topbarName}>
              {userData?.assistantName?.toUpperCase() || "ASSISTANT"}
            </p>
            <div style={S.statusRow}>
              <div style={{ ...S.statusDot, background: loading ? "#f0a060" : "#00cfff" }} />
              <span style={S.statusText}>
                {loading ? "THINKING..." : "ONLINE · READY"}
              </span>
            </div>
          </div>
        </div>
        <div style={S.topbarRight}>
          <button onClick={clearChat} style={S.clearBtn}>CLR</button>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={S.messageArea}>
        {/* session label */}
        <div style={S.sessionLabel}>
          <span style={S.sessionPill}>SESSION_STARTED · TODAY</span>
        </div>

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...S.msgRow,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            {/* avatar */}
            <div
              style={{
                ...S.msgAvatar,
                background:
                  msg.role === "user"
                    ? "rgba(0,100,180,0.2)"
                    : "rgba(0,207,255,0.08)",
                borderColor:
                  msg.role === "user"
                    ? "rgba(0,150,255,0.3)"
                    : "rgba(0,207,255,0.25)",
              }}
            >
              {msg.role === "user" ? (
                <span style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "#5ab8ff" }}>
                  {userData?.username?.slice(0, 2).toUpperCase() || "U"}
                </span>
              ) : (
                <span style={{ fontSize: 14 }}>🤖</span>
              )}
            </div>

            {/* bubble + time */}
            <div style={{ maxWidth: "75%" }}>
              <div
                style={{
                  ...S.bubble,
                  background:
                    msg.role === "user"
                      ? "rgba(0,60,120,0.45)"
                      : "rgba(0,25,55,0.75)",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(0,150,255,0.2)"
                      : "1px solid rgba(0,229,255,0.12)",
                  borderRadius:
                    msg.role === "user"
                      ? "10px 0 10px 10px"
                      : "0 10px 10px 10px",
                  color: msg.isError ? "#ff6080" : "#c8e8f0",
                }}
              >
                {/* code block detection — simple: if text contains \n and starts with spaces */}
                {msg.text.includes("```") ? (
                  <FormattedMessage text={msg.text} />
                ) : (
                  <span style={{ fontFamily: "var(--font-main)", fontSize: 14, lineHeight: 1.6 }}>
                    {msg.text}
                  </span>
                )}
              </div>
              <p
                style={{
                  ...S.msgTime,
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {/* typing indicator */}
        {loading && (
          <div style={{ ...S.msgRow, alignSelf: "flex-start" }}>
            <div style={{ ...S.msgAvatar, background: "rgba(0,207,255,0.08)", borderColor: "rgba(0,207,255,0.25)" }}>
              <span style={{ fontSize: 14 }}>🤖</span>
            </div>
            <div style={{ ...S.bubble, background: "rgba(0,25,55,0.75)", border: "1px solid rgba(0,229,255,0.12)", borderRadius: "0 10px 10px 10px" }}>
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── SUGGESTIONS ── */}
      <div style={S.suggestions}>
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => sendMessage(s)} style={S.suggestionChip}>
            {s}
          </button>
        ))}
      </div>

      {/* ── INPUT BAR ── */}
      <div style={S.inputBar}>
        <div style={S.inputWrap}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            rows={1}
            style={S.textarea}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(0,207,255,0.5)";
              e.target.style.boxShadow = "0 0 10px rgba(0,207,255,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0,229,255,0.18)";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            style={{
              ...S.sendBtn,
              opacity: loading || !input.trim() ? 0.4 : 1,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            {/* right-arrow icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        {/* voice toggle */}
        <button
          onClick={() => setVoiceActive((v) => !v)}
          aria-label="Toggle voice input"
          style={{
            ...S.voiceBtn,
            background: voiceActive ? "rgba(0,207,255,0.18)" : "rgba(0,207,255,0.06)",
            borderColor: voiceActive ? "rgba(0,207,255,0.5)" : "rgba(0,229,255,0.18)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={voiceActive ? "#00cfff" : "rgba(0,207,255,0.5)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

/* ─── Formatted message (code blocks) ─────────────── */
function FormattedMessage({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div style={{ fontFamily: "var(--font-main)", fontSize: 14, lineHeight: 1.6 }}>
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre key={i} style={{
              background: "rgba(0,10,30,0.8)",
              border: "1px solid rgba(0,229,255,0.15)",
              borderRadius: 6,
              padding: "10px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "#7fd4ff",
              overflowX: "auto",
              margin: "8px 0",
              whiteSpace: "pre-wrap",
            }}>
              {code}
            </pre>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

/* ─── Typing dots ──────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#00cfff", opacity: 0.7,
            animation: `typingDot 1.2s ${i * 0.2}s infinite ease-in-out`,
          }}
        />
      ))}
      <style>{`
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── STYLES ─────────────────────────────────────────── */
const S = {
  page: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg)",
    position: "relative",
    overflow: "hidden",
  },

  gridBg: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(0,207,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,207,255,0.025) 1px,transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
    zIndex: 0,
  },

  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    borderBottom: "1px solid rgba(0,229,255,0.12)",
    background: "rgba(4,12,28,0.9)",
    zIndex: 10,
    flexShrink: 0,
    backdropFilter: "blur(8px)",
  },

  topbarLeft: { display: "flex", alignItems: "center", gap: 12 },

  avatarSmall: {
    width: 38, height: 38, borderRadius: "50%",
    background: "rgba(0,207,255,0.08)",
    border: "1px solid rgba(0,207,255,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, overflow: "hidden",
  },

  topbarName: {
    fontFamily: "var(--font-display)",
    fontSize: 11, color: "var(--text-primary)",
    letterSpacing: "2px", margin: 0,
  },

  statusRow: { display: "flex", alignItems: "center", gap: 5, marginTop: 2 },

  statusDot: {
    width: 6, height: 6, borderRadius: "50%",
    transition: "background 0.3s",
  },

  statusText: {
    fontFamily: "var(--font-mono)",
    fontSize: 9, color: "var(--text-muted)", letterSpacing: "1px",
  },

  topbarRight: { display: "flex", gap: 8, alignItems: "center" },

  clearBtn: {
    background: "transparent",
    border: "1px solid rgba(0,229,255,0.15)",
    borderRadius: 6,
    padding: "5px 10px",
    color: "rgba(0,207,255,0.5)",
    fontFamily: "var(--font-mono)",
    fontSize: 9, letterSpacing: "1px", cursor: "pointer",
  },

  messageArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    zIndex: 1,
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(0,207,255,0.2) transparent",
  },

  sessionLabel: { textAlign: "center", margin: "4px 0" },

  sessionPill: {
    fontFamily: "var(--font-mono)",
    fontSize: 9, color: "rgba(0,207,255,0.25)",
    letterSpacing: "2px",
    background: "rgba(0,207,255,0.04)",
    border: "1px solid rgba(0,229,255,0.08)",
    borderRadius: 20,
    padding: "3px 14px",
  },

  msgRow: {
    display: "flex",
    gap: 10,
    maxWidth: "85%",
    animation: "fadeUp 0.25s ease",
  },

  msgAvatar: {
    width: 30, height: 30, borderRadius: "50%",
    border: "1px solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginTop: 2, overflow: "hidden",
  },

  bubble: {
    padding: "10px 14px",
    wordBreak: "break-word",
  },

  msgTime: {
    fontFamily: "var(--font-mono)",
    fontSize: 9, color: "var(--text-muted)",
    marginTop: 4, letterSpacing: "1px",
  },

  suggestions: {
    padding: "0 20px 10px",
    display: "flex", gap: 7, flexWrap: "wrap",
    zIndex: 10, flexShrink: 0,
  },

  suggestionChip: {
    background: "rgba(0,207,255,0.05)",
    border: "1px solid rgba(0,229,255,0.15)",
    borderRadius: 20,
    padding: "5px 13px",
    color: "rgba(0,207,255,0.6)",
    fontFamily: "var(--font-mono)",
    fontSize: 9, letterSpacing: "1px",
    cursor: "pointer", whiteSpace: "nowrap",
    transition: "all 0.2s",
  },

  inputBar: {
    padding: "10px 20px 14px",
    borderTop: "1px solid rgba(0,229,255,0.1)",
    background: "rgba(4,12,28,0.7)",
    zIndex: 10, display: "flex", gap: 8, alignItems: "flex-end",
    flexShrink: 0,
  },

  inputWrap: { flex: 1, position: "relative" },

  textarea: {
    width: "100%",
    padding: "11px 40px 11px 14px",
    background: "rgba(0,20,50,0.6)",
    border: "1px solid rgba(0,229,255,0.18)",
    borderRadius: "var(--radius)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-main)",
    fontSize: 14, lineHeight: 1.5,
    resize: "none", outline: "none",
    maxHeight: 120,
    transition: "border-color 0.3s, box-shadow 0.3s",
  },

  sendBtn: {
    position: "absolute", right: 8, bottom: 8,
    width: 28, height: 28,
    background: "rgba(0,207,255,0.15)",
    border: "1px solid rgba(0,207,255,0.35)",
    borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
  },

  voiceBtn: {
    width: 42, height: 42,
    border: "1px solid",
    borderRadius: "var(--radius)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
    transition: "all 0.3s",
  },
};

/* global animation */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(style);
}

export default Chat;