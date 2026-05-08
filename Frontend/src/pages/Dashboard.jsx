import { useState, useEffect, useRef, useContext } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import axios from "axios";

/* ─── static mock data (replace with real API) ───── */
const WEEK_DATA = [
  { d: "MON", v: 55 }, { d: "TUE", v: 80 }, { d: "WED", v: 62 },
  { d: "THU", v: 95 }, { d: "FRI", v: 72 }, { d: "SAT", v: 45 }, { d: "SUN", v: 38 },
];
const MONTH_DATA = [
  { d: "W1", v: 60 }, { d: "W2", v: 85 }, { d: "W3", v: 70 }, { d: "W4", v: 92 },
];

const ACTIVITY = [
  { icon: "🎙️", type: "VOICE", label: "Set reminder for standup", time: "2 min ago", color: "#00cfff" },
  { icon: "💬", type: "CHAT",  label: "Draft project proposal email", time: "1 hr ago", color: "#5aefb8" },
  { icon: "🔍", type: "SEARCH", label: "Latest AI developments 2026", time: "3 hr ago", color: "#c47fff" },
  { icon: "📋", type: "TASK",  label: "Summarise quarterly report", time: "5 hr ago", color: "#f0a060" },
];

const METRICS = [
  { label: "TOTAL_SESSIONS", value: "284", delta: "↑ 12% this week",  color: "#00cfff" },
  { label: "VOICE_QUERIES",  value: "1.2K", delta: "↑ 8% this week",  color: "#5aefb8" },
  { label: "AVG_RESPONSE",   value: "0.8s", delta: "↓ 0.2s faster",   color: "#f0a060" },
  { label: "SATISFACTION",   value: "96%",  delta: "↑ 3% this month", color: "#c47fff" },
];

const SYSTEM = [
  { label: "CORE_ENGINE",   pct: 82, status: "ONLINE",   statusColor: "#5aefb8", barColor: ["#00cfff", "#5aefb8"] },
  { label: "VOICE_MODULE",  pct: 95, status: "ACTIVE",   statusColor: "#5aefb8", barColor: ["#5aefb8", "#00cfff"] },
  { label: "MEMORY_BANK",   pct: 67, status: "67% USED", statusColor: "#f0a060", barColor: ["#f0a060", "#ffcc80"] },
  { label: "API_LATENCY",   pct: 22, status: "0.8ms",    statusColor: "#00cfff", barColor: ["#00cfff", "#5aefb8"] },
];

const BREAKDOWN = [
  { label: "VOICE",  pct: 0.48, color: "#00cfff" },
  { label: "CHAT",   pct: 0.35, color: "#5aefb8" },
  { label: "SEARCH", pct: 0.17, color: "#c47fff" },
];

/* ─── donut canvas ─────────────────────────────────── */
function DonutChart() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 40, cy = 40, r = 30, inner = 18;
    let angle = -Math.PI / 2;
    BREAKDOWN.forEach((s) => {
      const end = angle + s.pct * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, end);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      angle = end;
    });
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
    ctx.fillStyle = "#060d1a";
    ctx.fill();
  }, []);
  return <canvas ref={ref} width={80} height={80} style={{ flexShrink: 0 }} />;
}

/* ─── bar chart ────────────────────────────────────── */
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90, padding: "0 4px" }}>
      {data.map((item) => {
        const pct = Math.round((item.v / max) * 88);
        const isMax = item.v === max;
        return (
          <div key={item.d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%", justifyContent: "flex-end" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 8, color: isMax ? "#00cfff" : "rgba(0,207,255,0.35)" }}>
              {item.v}
            </span>
            <div
              style={{
                width: "100%", height: pct,
                background: isMax
                  ? "linear-gradient(180deg,#00cfff,rgba(0,207,255,0.3))"
                  : "linear-gradient(180deg,rgba(0,207,255,0.5),rgba(0,207,255,0.15))",
                borderRadius: "3px 3px 0 0",
                transition: "height 0.4s ease",
              }}
            />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-muted)" }}>{item.d}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Dashboard page ────────────────────────────────── */
const Dashboard = () => {
  const { userData } = useContext(UserDataContext);
  const [chartRange, setChartRange] = useState("week");
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());

  /* live clock */
  useEffect(() => {
    const id = setInterval(() => setLiveTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={S.page}>
      {/* grid bg */}
      <div style={S.gridBg} />

      {/* ── PAGE HEADER ── */}
      <div style={S.header}>
        <div>
          <p style={S.headerLabel}>// DASHBOARD.JSX</p>
          <h1 style={S.headerTitle}>SYSTEM_OVERVIEW</h1>
        </div>
        <div style={S.headerRight}>
          <div style={S.livePill}>
            <div style={S.liveDot} />
            <span style={S.liveText}>LIVE</span>
          </div>
          <span style={S.clockText}>{liveTime}</span>
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div style={S.metricGrid}>
        {METRICS.map((m) => (
          <div key={m.label} style={S.metricCard}>
            <div style={{ ...S.metricBar, background: `linear-gradient(90deg,${m.color},transparent)` }} />
            <p style={S.metricLabel}>{m.label}</p>
            <p style={{ ...S.metricValue, color: m.color }}>{m.value}</p>
            <p style={{ ...S.metricDelta, color: m.color + "80" }}>{m.delta}</p>
          </div>
        ))}
      </div>

      {/* ── MIDDLE ROW: bar chart + donut ── */}
      <div style={S.twoCol}>

        {/* bar chart */}
        <div style={S.panel}>
          <div style={S.panelHeader}>
            <p style={S.panelLabel}>SESSIONS_PER_DAY</p>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              style={S.select}
            >
              <option value="week">THIS_WEEK</option>
              <option value="month">THIS_MONTH</option>
            </select>
          </div>
          <BarChart data={chartRange === "week" ? WEEK_DATA : MONTH_DATA} />
        </div>

        {/* donut */}
        <div style={S.panel}>
          <p style={{ ...S.panelLabel, marginBottom: 14 }}>QUERY_BREAKDOWN</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutChart />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {BREAKDOWN.map((b) => (
                <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: b.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-secondary)", flex: 1 }}>
                    {b.label}
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 11, color: b.color }}>
                    {Math.round(b.pct * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: activity + system ── */}
      <div style={S.twoCol}>

        {/* recent activity */}
        <div style={S.panel}>
          <p style={{ ...S.panelLabel, marginBottom: 12 }}>RECENT_ACTIVITY</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={S.activityItem}>
                <div style={{ ...S.activityIcon, background: a.color + "14", borderColor: a.color + "30" }}>
                  <span style={{ fontSize: 13 }}>{a.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={S.activityLabel}>{a.label}</p>
                  <p style={{ ...S.activityMeta, color: a.color + "80" }}>
                    {a.type} · {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* system status */}
        <div style={S.panel}>
          <p style={{ ...S.panelLabel, marginBottom: 12 }}>ASSISTANT_STATUS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SYSTEM.map((sys) => (
              <div key={sys.label}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-secondary)", letterSpacing: "1px" }}>
                    {sys.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: sys.statusColor }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: sys.statusColor }}>
                      {sys.status}
                    </span>
                  </div>
                </div>
                <div style={S.progressTrack}>
                  <div
                    style={{
                      ...S.progressBar,
                      width: `${sys.pct}%`,
                      background: `linear-gradient(90deg,${sys.barColor[0]},${sys.barColor[1]})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── STYLES ─────────────────────────────────────────── */
const S = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "var(--bg)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    position: "relative",
    overflowY: "auto",
    fontFamily: "var(--font-main)",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(0,207,255,0.2) transparent",
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

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },

  headerLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 9, color: "rgba(0,207,255,0.35)",
    letterSpacing: "3px", marginBottom: 4,
  },

  headerTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(14px,2.5vw,18px)",
    fontWeight: 700, color: "var(--text-primary)",
    letterSpacing: "3px", margin: 0,
  },

  headerRight: { display: "flex", alignItems: "center", gap: 12 },

  livePill: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(0,207,255,0.06)",
    border: "1px solid rgba(0,229,255,0.15)",
    borderRadius: 20, padding: "5px 12px",
  },

  liveDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#00cfff",
    animation: "pulse 2s infinite",
  },

  liveText: {
    fontFamily: "var(--font-mono)",
    fontSize: 9, color: "#00cfff", letterSpacing: "1px",
  },

  clockText: {
    fontFamily: "var(--font-mono)",
    fontSize: 11, color: "var(--text-muted)", letterSpacing: "1px",
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    position: "relative",
    zIndex: 1,
  },

  metricCard: {
    background: "rgba(0,18,42,0.8)",
    border: "1px solid rgba(0,229,255,0.1)",
    borderRadius: 10,
    padding: 14,
    position: "relative",
    overflow: "hidden",
  },

  metricBar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 2,
  },

  metricLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 8, color: "var(--text-muted)",
    letterSpacing: "2px", marginBottom: 8,
  },

  metricValue: {
    fontFamily: "var(--font-display)",
    fontSize: 22, fontWeight: 500, margin: 0,
  },

  metricDelta: {
    fontSize: 10, marginTop: 3,
  },

  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    position: "relative",
    zIndex: 1,
  },

  panel: {
    background: "rgba(0,18,42,0.8)",
    border: "1px solid rgba(0,229,255,0.1)",
    borderRadius: 10,
    padding: 16,
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  panelLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 8, color: "var(--text-muted)", letterSpacing: "2px",
  },

  select: {
    background: "rgba(0,10,30,0.8)",
    border: "1px solid rgba(0,229,255,0.15)",
    borderRadius: 5,
    padding: "3px 8px",
    color: "#00cfff",
    fontFamily: "var(--font-mono)",
    fontSize: 8, letterSpacing: "1px",
    cursor: "pointer", outline: "none",
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 9,
    background: "rgba(0,10,28,0.5)",
    border: "1px solid rgba(0,229,255,0.07)",
    borderRadius: 7,
  },

  activityIcon: {
    width: 28, height: 28, borderRadius: 7,
    border: "1px solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },

  activityLabel: {
    fontSize: 12, color: "#c8e8f0",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    margin: 0,
  },

  activityMeta: {
    fontFamily: "var(--font-mono)",
    fontSize: 8, marginTop: 2, letterSpacing: "0.5px",
  },

  progressTrack: {
    height: 3,
    background: "rgba(0,229,255,0.08)",
    borderRadius: 2, overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.6s ease",
  },
};

/* pulse animation injected once */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`;
  document.head.appendChild(style);
}

export default Dashboard;