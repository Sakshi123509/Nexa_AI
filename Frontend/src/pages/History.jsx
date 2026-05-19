import { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import axios from "axios";
import Navbar from "../components/Navbar";
import img from "../assets/Gemini_Generated.png";
// import { serverUrl } from "../config.js";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(dateStr).toLocaleDateString("en", {
    day: "numeric",
    month: "short",
  });
}
{
  /* Background layer */
}

const TYPE_META = {
  VOICE: {
    color: "#00f2ff",
    bg: "rgba(0,242,255,0.1)",
    icon: "🎙️",
    label: "Voice",
  },
  CHAT: {
    color: "#5aefb8",
    bg: "rgba(90,239,184,0.1)",
    icon: "💬",
    label: "Chat",
  },
};
const S = {
  root: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflowX: "hidden",
    background: "#05070a",
    fontFamily: "'Space Grotesk','Segoe UI',system-ui,sans-serif",
  },
  main: {
    marginLeft: window.innerWidth <= 768 ? 0 : 224,
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    scrollbarWidth: "thin",
    width: "100%",
  },

  // Header area
  headerWrap: {
    padding: window.innerWidth <= 768 ? "70px 14px 0" : "20px 24px 0",
    background: "#05070a",
    position: "sticky",
    top: 0,
    zIndex: 10,
    borderBottom: "1px solid rgba(0,242,255,0.08)",
  },
  pageLabel: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "rgba(0,207,255,0.4)",
    letterSpacing: "3px",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: window.innerWidth <= 768 ? 18 : 22,
    fontWeight: 600,
    color: "#e0f4ff",
    letterSpacing: "-0.5px",
    margin: "0 0 16px",
  },

  // Stat pills
  statsRow: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  statPill: () => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(0,242,255,0.05)",
    border: "1px solid rgba(0,242,255,0.12)",
    borderRadius: 999,
    padding: "6px 14px",
  }),
  statLabel: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "rgba(0,207,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  statValue: (color) => ({ fontSize: 16, fontWeight: 600, color: color }),

  // Search + filter
  searchRow: {
    display: "flex",
    gap: 8,
    paddingBottom: 14,
    flexWrap: "wrap",
  },
  searchWrap: { flex: 1, position: "relative" },
  searchInput: {
    width: "100%",
    padding: "9px 12px 9px 36px",
    background: "rgba(0,242,255,0.04)",
    border: "1px solid rgba(0,242,255,0.1)",
    borderRadius: 10,
    color: "#e0f4ff",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "monospace",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.3,
    pointerEvents: "none",
  },
  filterBtn: (active) => ({
    flex: window.innerWidth <= 768 ? "1" : "unset",
    padding: "9px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "monospace",
    letterSpacing: "0.5px",
    border: "1px solid",
    borderColor: active ? "#00f2ff" : "rgba(0,242,255,0.1)",
    background: active ? "rgba(0,242,255,0.1)" : "rgba(0,242,255,0.03)",
    color: active ? "#00f2ff" : "rgba(0,207,255,0.4)",
    transition: "all .15s",
  }),

  // Content
  content: {
    flex: 1,
    padding: window.innerWidth <= 768 ? "16px 12px 24px" : "20px 24px 32px",
  },
  // Day group
  dayLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    marginTop: 4,
  },
  dayText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "rgba(0,207,255,0.35)",
    letterSpacing: "1.5px",
    whiteSpace: "nowrap",
  },
  dayLine: { flex: 1, height: 1, background: "rgba(0,242,255,0.07)" },
  dayCount: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "rgba(0,207,255,0.25)",
  },

  // History item card
  itemCard: (isOpen, color) => ({
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${isOpen ? color + "40" : "rgba(0,242,255,0.08)"}`,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    cursor: "pointer",
    transition: "border-color .2s, box-shadow .2s",
    boxShadow: isOpen ? `0 0 0 3px ${color}10` : "none",
  }),
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: window.innerWidth <= 768 ? "10px" : "12px 14px",
  },
  itemIcon: (bg) => ({
    width: 34,
    height: 34,
    borderRadius: 9,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    flexShrink: 0,
  }),
  itemMsg: {
    fontSize: window.innerWidth <= 768 ? 12 : 13,
    color: "#c8dff0",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemMeta: (color) => ({
    fontSize: 11,
    fontFamily: "monospace",
    color: color + "70",
    marginTop: 3,
    letterSpacing: "0.3px",
  }),
  chevron: (isOpen) => ({
    transition: "transform .2s",
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
    flexShrink: 0,
  }),

  // Expanded area
  expandedWrap: (color) => ({
    borderTop: `1px solid ${color}15`,
    padding: "14px 14px 16px",
    background: "rgba(0,0,0,0.2)",
  }),
  expandedLabel: (color) => ({
    fontSize: 10,
    fontFamily: "monospace",
    color: color + "70",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: 8,
  }),
  expandedText: {
    fontSize: 13,
    color: "#8ab4cc",
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  expandedTime: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "rgba(0,207,255,0.25)",
    marginTop: 10,
  },

  // Skeleton
  skeleton: {
    background: "rgba(0,242,255,0.05)",
    borderRadius: 12,
    height: 62,
    marginBottom: 8,
    animation: "shimmer 1.4s ease infinite",
  },

  // Empty state
  emptyWrap: { textAlign: "center", padding: "64px 20px" },
  emptyIcon: { fontSize: 44, marginBottom: 14 },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "rgba(0,207,255,0.5)",
    letterSpacing: "-0.2px",
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "rgba(0,207,255,0.25)",
  },
};

const History = () => {
  const { serverUrl } = useContext(UserDataContext);
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [expanded, setExpanded] = useState(null);

  // Inject shimmer keyframe once
  useEffect(() => {
    const id = "hist-kf";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = `@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.45}}`;
      document.head.appendChild(s);
    }
  }, []);

  // Fetch
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/user/history`, {
          withCredentials: true,
        });
        setHistory(res.data.history || []);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serverUrl]);

  // Filter
  useEffect(() => {
    let out = [...history];
    if (typeFilter !== "ALL") out = out.filter((h) => h.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (h) =>
          h.userMessage?.toLowerCase().includes(q) ||
          h.aiResponse?.toLowerCase().includes(q),
      );
    }
    setFiltered(out);
  }, [history, search, typeFilter]);

  // Group by calendar date
  const grouped = filtered.reduce((acc, item) => {
    const day = new Date(item.timestamp).toLocaleDateString("en", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  const voiceCount = history.filter((h) => h.type === "VOICE").length;
  const chatCount = history.filter((h) => h.type === "CHAT").length;

  return (
    <div style={S.root}>
      <Navbar />
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.09,
          filter: "brightness(60%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div style={S.main}>
        {/* ── STICKY HEADER ── */}
        <div style={S.headerWrap}>
          <p style={S.pageLabel}>// history</p>
          <h1 style={S.pageTitle}>Interaction Log</h1>

          {/* Stats */}
          <div style={S.statsRow}>
            {[
              { label: "Total", value: history.length, color: "#00f2ff" },
              { label: "Voice", value: voiceCount, color: "#00f2ff" },
              { label: "Chat", value: chatCount, color: "#5aefb8" },
            ].map((s) => (
              <div key={s.label} style={S.statPill(s.color)}>
                <span style={S.statLabel}>{s.label}</span>
                <span style={S.statValue(s.color)}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Search + filter */}
          <div style={S.searchRow}>
            <div style={S.searchWrap}>
              <svg
                style={S.searchIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a5868"
                strokeWidth="2.2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                style={S.searchInput}
              />
            </div>
            {["ALL", "VOICE", "CHAT"].map((f) => (
              <button
                key={f}
                style={S.filterBtn(typeFilter === f)}
                onClick={() => setTypeFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={S.content}>
          {/* Skeletons */}
          {loading &&
            [1, 2, 3, 4].map((i) => <div key={i} style={S.skeleton} />)}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div style={S.emptyWrap}>
              <div style={S.emptyIcon}>
                {search || typeFilter !== "ALL" ? "🔍" : "🕓"}
              </div>
              <p style={S.emptyTitle}>
                {search || typeFilter !== "ALL"
                  ? "No results found"
                  : "No history yet"}
              </p>
              <p style={S.emptySub}>
                {search || typeFilter !== "ALL"
                  ? "Try a different search term or filter"
                  : "Start chatting or use voice commands!"}
              </p>
            </div>
          )}

          {/* Grouped list */}
          {!loading &&
            Object.entries(grouped).map(([day, items]) => (
              <div key={day} style={{ marginBottom: 24 }}>
                {/* Day separator */}
                <div style={S.dayLabel}>
                  <span style={S.dayText}>{day.toUpperCase()}</span>
                  <div style={S.dayLine} />
                  <span style={S.dayCount}>
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items */}
                {items.map((item, i) => {
                  const cfg = TYPE_META[item.type] || TYPE_META.CHAT;
                  const key = `${day}-${i}`;
                  const isOpen = expanded === key;

                  return (
                    <div
                      key={key}
                      style={S.itemCard(isOpen, cfg.color)}
                      onClick={() => setExpanded(isOpen ? null : key)}
                    >
                      {/* Collapsed row */}
                      <div style={S.itemRow}>
                        <div style={S.itemIcon(cfg.bg)}>{cfg.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={S.itemMsg}>
                            {item.userMessage || "(no message)"}
                          </p>
                          <p style={S.itemMeta(cfg.color)}>
                            {cfg.label} · {timeAgo(item.timestamp)}
                          </p>
                        </div>
                        {/* Type badge */}
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: "monospace",
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: cfg.bg,
                            color: cfg.color,
                            flexShrink: 0,
                            marginRight: 6,
                          }}
                        >
                          {item.type}
                        </span>
                        {/* Chevron */}
                        <svg
                          style={S.chevron(isOpen)}
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#b0bbc8"
                          strokeWidth="2.5"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>

                      {/* Expanded: AI response */}
                      {isOpen && (
                        <div style={S.expandedWrap(cfg.color)}>
                          {item.aiResponse ? (
                            <>
                              <p style={S.expandedLabel(cfg.color)}>
                                AI Response
                              </p>
                              <p style={S.expandedText}>{item.aiResponse}</p>
                            </>
                          ) : (
                            <p
                              style={{
                                fontSize: 12,
                                fontFamily: "monospace",
                                color: "#b0bbc8",
                              }}
                            >
                              No response recorded.
                            </p>
                          )}
                          <p style={S.expandedTime}>
                            {new Date(item.timestamp).toLocaleString("en", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default History;
