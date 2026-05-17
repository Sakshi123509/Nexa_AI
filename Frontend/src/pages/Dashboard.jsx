import { useState, useEffect, useRef, useContext } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import axios from "axios";
import Navbar from "../components/Navbar";

/* ── Donut Chart ─────────────────────────────────────── */
function DonutChart({ breakdown }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !breakdown?.length) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 80, 80);
    const cx = 40, cy = 40, r = 30, inner = 18;
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
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    ctx.fillStyle = dark ? "#151f2e" : "rgba(0,18,42,0.85)fff";
    ctx.fill();
  }, [breakdown]);
  return <canvas ref={ref} width={80} height={80} style={{ flexShrink: 0 }} />;
}

/* ── Bar Chart ───────────────────────────────────────── */
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.v), 1);
  const total = data.reduce((a, b) => a + b.v, 0);

  if (total === 0) {
    return (
      <p style={styles.emptyChart}>No activity yet — start chatting!</p>
    );
  }

  return (
    <div style={styles.barsWrap}>
      {data.map((item, i) => {
        const pct = Math.round((item.v / max) * 100);
        const isMax = item.v === max && item.v > 0;
        return (
          <div key={i} style={styles.barCol}>
            <span style={{ ...styles.barCount, color: isMax ? "#1a6cff" : "var(--ink4)" }}>
              {item.v > 0 ? item.v : ""}
            </span>
            <div
              style={{
                ...styles.bar,
                height: `${Math.max(pct, item.v > 0 ? 5 : 0)}%`,
                background: isMax
                  ? "linear-gradient(180deg,#1a6cff,#60a5fa66)"
                  : "rgba(26,108,255,0.2)",
              }}
            />
            <span style={styles.barLabel}>{item.d}</span>
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

/* ── CSS-in-JS styles ────────────────────────────────── */
const styles = {
  root: {
    display: "flex",
    height: "100vh",
    background: "var(--bg)",
    fontFamily: "'Space Grotesk', 'Segoe UI', system-ui, sans-serif",
  },
  main: {
    marginLeft: 224,
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    scrollbarWidth: "thin",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  h1: {
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: "-0.3px",
    color: " var(--text-primary)",
    margin: 0,
  },
  headerSub: {
    fontSize: 12,
    color: "var(--ink3, #4a5868)",
    marginTop: 3,
    fontFamily: "monospace",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(0,18,42,0.7)",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 999,
    padding: "6px 14px",
    fontSize: 12,
    fontFamily: "monospace",
    color: "var(--ink2, #2d3a47)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#00c896",
    animation: "breathe 2.2s ease-in-out infinite",
  },
  timeBadge: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "var(--ink3, #4a5868)",
    padding: "6px 10px",
    background: "rgba(0,18,42,0.85)",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },

  // Metric cards
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  metricCard: (accentBar, accentClr) => ({
    background: "rgba(0,18,42,0.85)",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 12,
    padding: "16px 18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)",
    position: "relative",
    overflow: "hidden",
    cursor: "default",
    transition: "transform .15s, box-shadow .15s",
  }),
  metricBar: (gradient) => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: gradient,
    borderRadius: "3px 3px 0 0",
  }),
  metricLabel: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "var(--accent)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  metricValue: (color) => ({
    fontSize: 28,
    fontWeight: 600,
    lineHeight: 1,
    color: color,
    margin: 0,
  }),
  metricSub: {
    fontSize: 11,
    color: "var(--ink4, #8a98a8)",
    marginTop: 6,
    fontFamily: "monospace",
  },

  // Cards
  card: {
    background: "rgba(0,18,42,0.85)",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "var(--ink3, #4a5868)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 14,
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  // Mid row
  midRow: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr 1fr",
    gap: 12,
  },

  // Bar chart
  barsWrap: {
    display: "flex",
    alignItems: "flex-end",
    gap: 5,
    height: 90,
  },
  barCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: "4px 4px 0 0",
    transition: "height .5s ease",
    minHeight: 3,
  },
  barCount: {
    fontSize: 9,
    fontFamily: "monospace",
  },
  barLabel: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "var(--ink4, #8a98a8)",
  },
  emptyChart: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "monospace",
    color: "var(--ink4, #8a98a8)",
    padding: "28px 0",
  },

  // Toggle group
  toggleGroup: {
    display: "flex",
    background: "var(--surface, #f4f6f8)",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 7,
    overflow: "hidden",
  },
  toggleBtn: (active) => ({
    padding: "4px 10px",
    fontSize: 10,
    fontFamily: "monospace",
    cursor: "pointer",
    color: active ? "var(--accent)" : "var(--ink3, #4a5868)",
    border: "none",
    background: active ? "rgba(0,18,42,0.85)" : "transparent",
    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
    letterSpacing: "0.3px",
    transition: "all .15s",
  }),

  // Donut
  donutWrap: { display: "flex", alignItems: "center", gap: 14 },
  legend: { display: "flex", flexDirection: "column", gap: 8, flex: 1 },
  legendItem: { display: "flex", alignItems: "center", gap: 8 },
  legendDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: 3,
    background: color,
    flexShrink: 0,
  }),
  legendPct: (color) => ({
    fontFamily: "monospace",
    fontSize: 12,
    color: color,
    marginLeft: "auto",
  }),

  // Assistant
  aiAvatarWrap: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    border: "2px solid #1a6cff",
    overflow: "hidden",
    marginBottom: 12,
    background: "linear-gradient(135deg,#1a6cff22,#00c89622)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },
  aiName: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 4,
    color: "var(--ink, #0f1923)",
  },
  aiStatus: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#00a876",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  tag: (bg, color) => ({
    display: "inline-block",
    fontSize: 10,
    fontFamily: "monospace",
    padding: "3px 8px",
    borderRadius: 6,
    marginRight: 5,
    marginTop: 4,
    background: bg,
    color: color,
  }),

  // Bottom row
  bottomRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  // Activity
  actItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 0",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  actIcon: (color) => ({
    width: 32,
    height: 32,
    borderRadius: 9,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    background: color + "18",
  }),
  actMain: {
    fontSize: 13,
    color: "",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    margin: 0,
  },
  actMeta: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "var(--ink4, #8a98a8)",
    marginTop: 2,
  },
  emptyState: {
    textAlign: "center",
    padding: "28px 0",
    fontSize: 12,
    fontFamily: "monospace",
    color: "var(--ink4, #8a98a8)",
  },

  // System status
  sysItem: { marginBottom: 14 },
  sysRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sysName: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "var(--ink2, #2d3a47)",
  },
  track: {
    height: 4,
    background: "rgba(0,0,0,0.07)",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: (w, color) => ({
    height: "100%",
    width: `${w}%`,
    borderRadius: 2,
    background: color,
    transition: "width .7s ease",
  }),

  // Voice config
  configRow: { marginBottom: 12 },
  configLabel: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "var(--ink3, #4a5868)",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    marginBottom: 6,
    display: "flex",
    justifyContent: "space-between",
  },
  configSelect: {
    width: "100%",
    padding: "8px 10px",
    background: "var(--surface, #f4f6f8)",
    border: "1px solid rgba(0,0,0,0.09)",
    borderRadius: 8,
    color: "var(--ink, #0f1923)",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  rangeWrap: { display: "flex", alignItems: "center", gap: 10 },
  rangeHint: {
    fontSize: 10,
    color: "var(--ink4, #8a98a8)",
    fontFamily: "monospace",
  },
  rangeVal: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#1a6cff",
    minWidth: 28,
    textAlign: "right",
  },
};

const METRIC_CONFIGS = [
  {
    key: "totalQueries",
    label: "Total queries",
    sub: "all time",
    bar: "linear-gradient(90deg,#1a6cff,#60a5fa)",
    color: "#1a6cff",
    format: (v) => String(v || 0),
  },
  {
    key: "voiceCount",
    label: "Voice commands",
    sub: "via microphone",
    bar: "linear-gradient(90deg,#00c896,#34d399)",
    color: "#00a876",
    format: (v) => String(v || 0),
  },
  {
    key: "chatCount",
    label: "Chat messages",
    sub: "typed messages",
    bar: "linear-gradient(90deg,#f59e0b,#fcd34d)",
    color: "#d97706",
    format: (v) => String(v || 0),
  },
  {
    key: "memberSince",
    label: "Member since",
    sub: "account age",
    bar: "linear-gradient(90deg,#e040fb,#c084fc)",
    color: "#c026d3",
    format: (v) =>
      v
        ? new Date(v).toLocaleDateString("en", { month: "short", year: "numeric" })
        : "—",
    smallValue: true,
  },
];

const SYSTEM_ITEMS = (stats) => [
  { name: "Core engine", pct: 82, badge: "ONLINE", badgeType: "green", color: "#1a6cff" },
  { name: "Voice module", pct: 95, badge: "ACTIVE", badgeType: "green", color: "#00c896" },
  {
    name: "Memory bank",
    pct: stats ? Math.min(Math.round((stats.totalQueries / 200) * 100), 100) : 0,
    badge: stats ? `${Math.min(Math.round((stats.totalQueries / 200) * 100), 100)}% used` : "0%",
    badgeType: "amber",
    color: "#f59e0b",
  },
  { name: "API latency", pct: 22, badge: "~0.8s", badgeType: "blue", color: "#1a6cff" },
];

const BADGE_STYLES = {
  green: { background: "rgba(0,200,150,.12)", color: "#00a876" },
  amber: { background: "rgba(245,158,11,.12)", color: "#b97a00" },
  blue: { background: "rgba(26,108,255,.12)", color: "#1a6cff" },
};

/* ── Dashboard ───────────────────────────────────────── */
const Dashboard = () => {
  const { userData, serverUrl } = useContext(UserDataContext);
  const [chartRange, setChartRange] = useState("week");
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString("en", { hour12: false }));
  const [voiceQuality, setVoiceQuality] = useState(90);
  const [aiCreativity, setAiCreativity] = useState(75);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clock
  useEffect(() => {
    const id = setInterval(
      () => setLiveTime(new Date().toLocaleTimeString("en", { hour12: false })),
      1000
    );
    return () => clearInterval(id);
  }, []);

  // Inject keyframes once
  useEffect(() => {
    const id = "dash-kf";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes breathe{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.75)}}
        [data-dash] input[type=range]{accent-color:#1a6cff}
        [data-dash] select:focus{outline:2px solid #1a6cff44;outline-offset:2px}
      `;
      document.head.appendChild(s);
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${serverUrl}/api/user/dashboardstats`, {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (e) {
        setError("Could not load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    { label: "VOICE", pct: 0.5, color: "#1a6cff" },
    { label: "CHAT", pct: 0.5, color: "#00c896" },
  ];
  const activity = stats?.recentActivity || [];
  const sysItems = SYSTEM_ITEMS(stats);

  return (
    <div style={styles.root} data-dash>
      <Navbar />
      <div style={styles.main}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>
              {userData?.name?.toUpperCase() || "USER"}_OVERVIEW
            </h1>
            <p style={styles.headerSub}>// dashboard · neural assistant v2.4</p>
          </div>
          <div style={styles.headerRight}>
            {loading && (
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#8a98a8" }}>
                LOADING...
              </span>
            )}
            <div style={styles.statusPill}>
              <div style={styles.dot} />
              LIVE
            </div>
            <div style={styles.timeBadge}>{liveTime}</div>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div style={styles.metricsGrid}>
          {METRIC_CONFIGS.map((m) => (
            <div key={m.key} style={styles.metricCard(m.bar, m.color)}>
              <div style={styles.metricBar(m.bar)} />
              <p style={styles.metricLabel}>{m.label}</p>
              <p
                style={{
                  ...styles.metricValue(m.color),
                  fontSize: m.smallValue ? 18 : 28,
                  paddingTop: m.smallValue ? 4 : 0,
                }}
              >
                {loading ? "—" : m.format(stats?.[m.key])}
              </p>
              <p style={styles.metricSub}>{m.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Mid Row: Bar chart + Donut + Assistant ── */}
        <div style={styles.midRow}>

          {/* Bar chart */}
          <div style={styles.card}>
            <div style={styles.cardTitleRow}>
              <span style={{ ...styles.cardTitle, marginBottom: 0 }}>Queries per day</span>
              <div style={styles.toggleGroup}>
                {["week", "month"].map((r) => (
                  <button
                    key={r}
                    style={styles.toggleBtn(chartRange === r)}
                    onClick={() => setChartRange(r)}
                  >
                    {r === "week" ? "Week" : "Month"}
                  </button>
                ))}
              </div>
            </div>
            <BarChart data={chartRange === "week" ? weekData : monthData} />
          </div>

          {/* Donut */}
          <div style={styles.card}>
            <p style={styles.cardTitle}>Query breakdown</p>
            <div style={styles.donutWrap}>
              <DonutChart breakdown={breakdown} />
              <div style={styles.legend}>
                {breakdown.map((b) => (
                  <div key={b.label} style={styles.legendItem}>
                    <div style={styles.legendDot(b.color)} />
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#4a5868" }}>
                      {b.label}
                    </span>
                    <span style={styles.legendPct(b.color)}>
                      {Math.round(b.pct * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assistant Profile */}
          <div style={{ ...styles.card, display: "flex", flexDirection: "column" }}>
            <p style={styles.cardTitle}>AI assistant</p>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
                padding: "8px 0",
              }}
            >
              <div style={styles.aiAvatarWrap}>
                {userData?.AIimg ? (
                  <img
                    src={userData.AIimg}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  "🤖"
                )}
              </div>
              <div style={styles.aiName}>{userData?.Ainame || "ARIA"}</div>
              <div style={styles.aiStatus}>
                <div style={{ ...styles.dot, background: "#00c896" }} />
                Online
              </div>
              <div>
                <span style={styles.tag("rgba(26,108,255,.1)", "#1a6cff")}>
                  Fast response
                </span>
                <span style={styles.tag("rgba(0,200,150,.1)", "#00a876")}>
                  Voice enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div style={styles.bottomRow}>

          {/* Recent Activity */}
          <div style={styles.card}>
            <p style={styles.cardTitle}>Recent activity</p>
            <div>
              {loading ? (
                <div style={styles.emptyState}>Loading activity...</div>
              ) : activity.length === 0 ? (
                <div style={styles.emptyState}>
                  No activity yet — start chatting!
                </div>
              ) : (
                activity.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.actItem,
                      ...(i === activity.length - 1 ? { borderBottom: "none" } : {}),
                    }}
                  >
                    <div style={styles.actIcon(a.color)}>{a.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={styles.actMain}>{a.label}</p>
                      <p style={styles.actMeta}>
                        {a.type} · {timeAgo(a.time)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* System Status */}
            <div style={styles.card}>
              <p style={styles.cardTitle}>System status</p>
              {sysItems.map((sys, i) => (
                <div
                  key={sys.name}
                  style={{ ...styles.sysItem, ...(i === sysItems.length - 1 ? { marginBottom: 0 } : {}) }}
                >
                  <div style={styles.sysRow}>
                    <span style={styles.sysName}>{sys.name}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        padding: "2px 7px",
                        borderRadius: 5,
                        ...BADGE_STYLES[sys.badgeType],
                      }}
                    >
                      {sys.badge}
                    </span>
                  </div>
                  <div style={styles.track}>
                    <div style={styles.fill(sys.pct, sys.color)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Voice Configuration */}
            <div style={styles.card}>
              <p style={styles.cardTitle}>Voice configuration</p>
              <div style={styles.configRow}>
                <div style={styles.configLabel}>Voice type</div>
                <select style={styles.configSelect}>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>
              <div style={styles.configRow}>
                <div style={styles.configLabel}>Language</div>
                <select style={styles.configSelect}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
              </div>
              <div style={styles.configRow}>
                <div style={styles.configLabel}>
                  <span>Voice quality</span>
                  <span style={styles.rangeVal}>{voiceQuality}</span>
                </div>
                <div style={styles.rangeWrap}>
                  <span style={styles.rangeHint}>LOW</span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={voiceQuality}
                    onChange={(e) => setVoiceQuality(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#1a6cff" }}
                  />
                  <span style={styles.rangeHint}>HD</span>
                </div>
              </div>
              <div style={{ ...styles.configRow, marginBottom: 0 }}>
                <div style={styles.configLabel}>
                  <span>AI creativity</span>
                  <span style={styles.rangeVal}>{aiCreativity}</span>
                </div>
                <div style={styles.rangeWrap}>
                  <span style={styles.rangeHint}>LOW</span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={aiCreativity}
                    onChange={(e) => setAiCreativity(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#1a6cff" }}
                  />
                  <span style={styles.rangeHint}>HIGH</span>
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