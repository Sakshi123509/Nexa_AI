// src/pages/Dashboard.jsx
// No SpeechContext needed — reads voice settings from localStorage (same key as Home.jsx)

import { useState, useEffect, useRef, useContext } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import "../css/dashboard.css"
// import { serverUrl } from "../config.js";

/* ── Voice settings helpers (same localStorage key as Home.jsx) ── */
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

/* ── Donut Chart ─────────────────────────────────────── */
function DonutChart({ breakdown }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !breakdown?.length) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 80, 80);
    const cx = 40,
      cy = 40,
      r = 30,
      inner = 18;
    let angle = -Math.PI / 2;
    const total = breakdown.reduce((a, b) => a + b.pct, 0) || 1;
    breakdown.forEach((seg) => {
      const end = angle + (seg.pct / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      angle = end;
    });
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
    ctx.fillStyle = "#030f1a";
    ctx.fill();
  }, [breakdown]);
  return <canvas ref={ref} width={80} height={80} style={{ flexShrink: 0 }} />;
}

/* ── Bar Chart ───────────────────────────────────────── */
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.v), 1);
  const total = data.reduce((a, b) => a + b.v, 0);
  if (total === 0)
    return (
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          fontFamily: "monospace",
          color: "rgba(0,207,255,0.35)",
          padding: "28px 0",
        }}
      >
        No activity yet — start chatting!
      </p>
    );
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 90 }}
    >
      {data.map((item, i) => {
        const pct = Math.round((item.v / max) * 100);
        const isMax = item.v === max && item.v > 0;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                color: isMax ? "#00cfff" : "rgba(0,207,255,0.3)",
              }}
            >
              {item.v > 0 ? item.v : ""}
            </span>
            <div
              style={{
                width: "100%",
                borderRadius: "3px 3px 0 0",
                transition: "height .5s ease",
                minHeight: 3,
                height: `${Math.max(pct, item.v > 0 ? 5 : 0)}%`,
                background: isMax
                  ? "linear-gradient(180deg,#00cfff,rgba(0,207,255,0.3))"
                  : "rgba(0,207,255,0.15)",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                color: "rgba(0,207,255,0.3)",
              }}
            >
              {item.d}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Time ago ────────────────────────────────────────── */
function timeAgo(dateStr) {
  const m = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── Constants ───────────────────────────────────────── */
const C = {
  bg: "#030f1a",
  card: "rgba(0,18,42,0.85)",
  border: "rgba(0,229,255,0.1)",
  accent: "#00cfff",
  text: "#e0f4ff",
  muted: "rgba(0,207,255,0.35)",
  mono: "monospace",
};

const card = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
};

const METRIC_CONFIGS = [
  {
    key: "totalQueries",
    label: "Total queries",
    sub: "all time",
    bar: "linear-gradient(90deg,#00cfff,#60a5fa)",
    color: "#00cfff",
    format: (v) => String(v || 0),
  },
  {
    key: "voiceCount",
    label: "Voice commands",
    sub: "via microphone",
    bar: "linear-gradient(90deg,#5aefb8,#34d399)",
    color: "#5aefb8",
    format: (v) => String(v || 0),
  },
  {
    key: "chatCount",
    label: "Chat messages",
    sub: "typed messages",
    bar: "linear-gradient(90deg,#f0a060,#fcd34d)",
    color: "#f0a060",
    format: (v) => String(v || 0),
  },
  {
    key: "memberSince",
    label: "Member since",
    sub: "account age",
    bar: "linear-gradient(90deg,#c47fff,#e040fb)",
    color: "#c47fff",
    format: (v) =>
      v
        ? new Date(v).toLocaleDateString("en", {
            month: "short",
            year: "numeric",
          })
        : "—",
    small: true,
  },
];

const BADGE = {
  green: { background: "rgba(90,239,184,.15)", color: "#5aefb8" },
  amber: { background: "rgba(240,160,96,.15)", color: "#f0a060" },
  blue: { background: "rgba(0,207,255,.15)", color: "#00cfff" },
};

/* ── Dashboard ───────────────────────────────────────── */
const Dashboard = () => {
  const { userData, serverUrl } = useContext(UserDataContext);

  // ✅ Voice settings from localStorage — same key Home.jsx uses
  const [voiceSettings, setVoiceSettingsState] = useState(loadVoiceSettings);

  const setVoiceSettings = (updater) => {
    setVoiceSettingsState((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      saveVoiceSettings(next);
      return next;
    });
  };

  const [chartRange, setChartRange] = useState("week");
  const [liveTime, setLiveTime] = useState(
    new Date().toLocaleTimeString("en", { hour12: false }),
  );
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live clock
  useEffect(() => {
    const id = setInterval(
      () => setLiveTime(new Date().toLocaleTimeString("en", { hour12: false })),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  // Inject fonts
  useEffect(() => {
    const id = "dash-kf";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Space+Grotesk:wght@400;500;600&display=swap');
        @keyframes breathe{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
      `;
      document.head.appendChild(s);
    }
  }, []);

  // Fetch stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/user/dashboardstats`, {
        withCredentials: true,
      });
      setStats(res.data);
    } catch (err) {
      console.log("dashboardstats error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [serverUrl]);

  const weekData =
    stats?.weekData ||
    ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => ({ d, v: 0 }));
  const monthData = stats?.monthData || [
    { d: "W1", v: 0 },
    { d: "W2", v: 0 },
    { d: "W3", v: 0 },
    { d: "W4", v: 0 },
  ];
  const breakdown = stats?.breakdown || [
    { label: "VOICE", pct: 0.5, color: "#00cfff" },
    { label: "CHAT", pct: 0.5, color: "#5aefb8" },
  ];
  const activity = stats?.recentActivity || [];

  const sysItems = [
    {
      name: "Core engine",
      pct: 82,
      badge: "ONLINE",
      type: "green",
      color: "#00cfff",
    },
    {
      name: "Voice module",
      pct: 95,
      badge: "ACTIVE",
      type: "green",
      color: "#5aefb8",
    },
    {
      name: "Memory bank",
      pct: stats
        ? Math.min(Math.round((stats.totalQueries / 200) * 100), 100)
        : 0,
      badge: stats
        ? `${Math.min(Math.round((stats.totalQueries / 200) * 100), 100)}% used`
        : "0%",
      type: "amber",
      color: "#f0a060",
    },
    {
      name: "API latency",
      pct: 22,
      badge: "~0.8s",
      type: "blue",
      color: "#00cfff",
    },
  ];

  // Slider display values
  const volPct = Math.round(voiceSettings.volume * 100);
  const ratePct = Math.round(((voiceSettings.rate - 0.5) / 1.5) * 100);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: C.bg,
      }}
    >
      <Navbar />
      

      {/* Grid background */}
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

      <div
        style={{
          marginLeft: window.innerWidth <= 768 ? 0 : 224,
          flex: 1,
          overflowY: "auto",
          padding: window.innerWidth <= 768 ? "70px 12px 20px" : 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          position: "relative",
          zIndex: 1,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,207,255,0.2) transparent",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 9,
                fontFamily: C.mono,
                color: C.muted,
                letterSpacing: 3,
                marginBottom: 4,
              }}
            >
              // DASHBOARD
            </p>
            <h1
              style={{
                fontFamily: "'Orbitron',monospace",
                fontSize: "clamp(13px,2.2vw,17px)",
                fontWeight: 700,
                color: C.text,
                letterSpacing: 3,
                margin: 0,
              }}
            >
              {userData?.name?.toUpperCase() || "USER"}_OVERVIEW
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={fetchStats}
              style={{
                background: "rgba(0,207,255,0.08)",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "5px 12px",
                color: C.accent,
                fontFamily: C.mono,
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              ↻ REFRESH
            </button>
            {loading && (
              <span style={{ fontSize: 9, fontFamily: C.mono, color: C.muted }}>
                LOADING...
              </span>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(0,207,255,0.06)",
                border: `1px solid rgba(0,229,255,0.15)`,
                borderRadius: 999,
                padding: "5px 12px",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.accent,
                  animation: "breathe 2.2s ease-in-out infinite",
                }}
              />
              <span
                style={{ fontFamily: C.mono, fontSize: 9, color: C.accent }}
              >
                LIVE
              </span>
            </div>
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 11,
                color: C.muted,
                padding: "6px 10px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
              }}
            >
              {liveTime}
            </span>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              window.innerWidth <= 480
                ? "1fr"
                : window.innerWidth <= 768
                  ? "repeat(2,1fr)"
                  : "repeat(4,1fr)",
            gap: 12,
          }}
        >
          {METRIC_CONFIGS.map((m) => (
            <div
              key={m.key}
              style={{ ...card, overflow: "hidden", position: "relative" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: m.bar,
                }}
              />
              <p
                style={{
                  fontSize: 8,
                  fontFamily: C.mono,
                  color: C.muted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {m.label}
              </p>
              <p
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: m.small ? 18 : 26,
                  fontWeight: 600,
                  color: m.color,
                  margin: 0,
                  paddingTop: m.small ? 3 : 0,
                }}
              >
                {loading ? "—" : m.format(stats?.[m.key])}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: C.muted,
                  marginTop: 5,
                  fontFamily: C.mono,
                }}
              >
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Mid row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              window.innerWidth <= 768 ? "1fr" : "1.6fr 1fr 1fr",
            gap: 12,
          }}
        >
          {/* Bar chart */}
          <div style={card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontFamily: C.mono,
                  color: C.muted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Queries per day
              </span>
              <div
                style={{
                  display: "flex",
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                {["week", "month"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartRange(r)}
                    style={{
                      padding: "4px 10px",
                      fontSize: 9,
                      fontFamily: C.mono,
                      cursor: "pointer",
                      border: "none",
                      transition: "all .15s",
                      color: chartRange === r ? C.accent : C.muted,
                      background:
                        chartRange === r
                          ? "rgba(0,207,255,0.1)"
                          : "transparent",
                    }}
                  >
                    {r === "week" ? "WEEK" : "MONTH"}
                  </button>
                ))}
              </div>
            </div>
            <BarChart data={chartRange === "week" ? weekData : monthData} />
          </div>

          {/* Donut */}
          <div style={card}>
            <p
              style={{
                fontSize: 8,
                fontFamily: C.mono,
                color: C.muted,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Query breakdown
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <DonutChart breakdown={breakdown} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: 1,
                }}
              >
                {breakdown.map((b) => (
                  <div
                    key={b.label}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: b.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: C.mono,
                        color: C.muted,
                        flex: 1,
                      }}
                    >
                      {b.label}
                    </span>
                    <span
                      style={{
                        fontFamily: C.mono,
                        fontSize: 11,
                        color: b.color,
                      }}
                    >
                      {Math.round(b.pct * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assistant profile */}
          <div style={{ ...card, display: "flex", flexDirection: "column" }}>
            <p
              style={{
                fontSize: 8,
                fontFamily: C.mono,
                color: C.muted,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              AI assistant
            </p>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  border: "2px solid #00cfff",
                  overflow: "hidden",
                  marginBottom: 10,
                  background: "rgba(0,207,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {userData?.AIimg ? (
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
                  "🤖"
                )}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.text,
                  fontFamily: "'Orbitron',monospace",
                  marginBottom: 4,
                }}
              >
                {userData?.Ainame || "ARIA"}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "#5aefb8",
                  marginBottom: 8,
                  fontFamily: C.mono,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#5aefb8",
                  }}
                />{" "}
                Online
              </div>
              <div>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: C.mono,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: "rgba(0,207,255,0.1)",
                    color: "#00cfff",
                    marginRight: 4,
                  }}
                >
                  Fast response
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: C.mono,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: "rgba(90,239,184,0.1)",
                    color: "#5aefb8",
                  }}
                >
                  Voice enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
    <div
  style={{
    display: "grid",
    // Desktop par 4 columns banenge, choti screen par auto-adjust ho jayenge
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  }}
>
          {/* Recent activity */}
          <div style={card}>
            <p
              style={{
                fontSize: 8,
                fontFamily: C.mono,
                color: C.muted,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Recent activity
            </p>
            {loading ? (
              <p
                style={{
                  fontSize: 10,
                  fontFamily: C.mono,
                  color: C.muted,
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                Loading activity...
              </p>
            ) : activity.length === 0 ? (
              <p
                style={{
                  fontSize: 10,
                  fontFamily: C.mono,
                  color: C.muted,
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                No activity yet — start chatting!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {activity.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 0",
                      borderBottom:
                        i < activity.length - 1
                          ? `1px solid rgba(0,229,255,0.06)`
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 7,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        background: a.color + "18",
                      }}
                    >
                      {a.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#c8e8f0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: 0,
                        }}
                      >
                        {a.label}
                      </p>
                      <p
                        style={{
                          fontSize: 9,
                          fontFamily: C.mono,
                          color: a.color + "80",
                          marginTop: 2,
                        }}
                      >
                        {a.type} · {timeAgo(a.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* System status */}
            <div style={card}>
              <p
                style={{
                  fontSize: 8,
                  fontFamily: C.mono,
                  color: C.muted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                System status
              </p>
              {sysItems.map((sys, i) => (
                <div
                  key={sys.name}
                  style={{ marginBottom: i < sysItems.length - 1 ? 19 : 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: C.mono,
                        color: "rgba(0,207,255,0.5)",
                      }}
                    >
                      {sys.name}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: C.mono,
                        padding: "2px 7px",
                        borderRadius: 5,
                        ...BADGE[sys.type],
                      }}
                    >
                      {sys.badge}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 3,
                      background: "rgba(0,229,255,0.08)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${sys.pct}%`,
                        background: sys.color,
                        borderRadius: 2,
                        transition: "width .7s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Voice config — reads/writes same localStorage as Home.jsx */}
            <div style={card}>
              <p
                style={{
                  fontSize: 8,
                  fontFamily: C.mono,
                  color: C.muted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Voice configuration
              </p>

              {/* Gender */}
              <div style={{ marginBottom: 12 }}>
                <p
                  style={{
                    fontSize: 9,
                    fontFamily: C.mono,
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: 6,
                  }}
                >
                  Voice type
                </p>
                <select
                  value={voiceSettings.gender}
                  onChange={(e) =>
                    setVoiceSettings((s) => ({ ...s, gender: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.text,
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>

              {/* Language */}
              <div style={{ marginBottom: 12 }}>
                <p
                  style={{
                    fontSize: 9,
                    fontFamily: C.mono,
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: 6,
                  }}
                >
                  Language
                </p>
                <select
                  value={voiceSettings.language}
                  onChange={(e) =>
                    setVoiceSettings((s) => ({
                      ...s,
                      language: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.text,
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
              </div>

              {/* Volume */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontFamily: C.mono,
                      color: C.muted,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      margin: 0,
                    }}
                  >
                    Volume
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: C.mono,
                      color: C.accent,
                    }}
                  >
                    {volPct}%
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{ fontSize: 9, fontFamily: C.mono, color: C.muted }}
                  >
                    0
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={volPct}
                    onChange={(e) =>
                      setVoiceSettings((s) => ({
                        ...s,
                        volume: Number(e.target.value) / 100,
                      }))
                    }
                    style={{ flex: 1, accentColor: C.accent }}
                  />
                  <span
                    style={{ fontSize: 9, fontFamily: C.mono, color: C.muted }}
                  >
                    100
                  </span>
                </div>
              </div>

              {/* Speech rate */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontFamily: C.mono,
                      color: C.muted,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      margin: 0,
                    }}
                  >
                    Speech rate
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: C.mono,
                      color: C.accent,
                    }}
                  >
                    {voiceSettings.rate.toFixed(1)}x
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{ fontSize: 9, fontFamily: C.mono, color: C.muted }}
                  >
                    SLOW
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={ratePct}
                    onChange={(e) =>
                      setVoiceSettings((s) => ({
                        ...s,
                        rate: 0.5 + (Number(e.target.value) / 100) * 1.5,
                      }))
                    }
                    style={{ flex: 1, accentColor: C.accent }}
                  />
                  <span
                    style={{ fontSize: 9, fontFamily: C.mono, color: C.muted }}
                  >
                    FAST
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
