// components/Navbar.jsx
// ─────────────────────────────────────────────────────
// Fixed: dynamic user pulled directly from localStorage
// + improved font sizes, colors, logo glow
// ─────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/removed_logo.png";
import bg from "../assets/bgside.jpg";
import chat from "../pages/chat.jsx";
import Dashboard from "../pages/Dashboard";
import axios from "axios";

// ─── Icons ───────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  chat: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  apps: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="4" height="4" rx="0.5" />
      <rect x="10" y="3" width="4" height="4" rx="0.5" />
      <rect x="17" y="3" width="4" height="4" rx="0.5" />
      <rect x="3" y="10" width="4" height="4" rx="0.5" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" />
      <rect x="17" y="10" width="4" height="4" rx="0.5" />
      <rect x="3" y="17" width="4" height="4" rx="0.5" />
      <rect x="10" y="17" width="4" height="4" rx="0.5" />
      <rect x="17" y="17" width="4" height="4" rx="0.5" />
    </svg>
  ),
  history: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <polyline points="12 8 12 12 14 14" />
      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
  ),
  customize: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  chevron: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  mic: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  ),
  user: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14c-5 0-8 2-8 4v1h16v-1c0-2-3-4-8-4z" />
    </svg>
  ),
};

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "_INSIGHTS",
    path: "/dashboard",
    icon: Icons.dashboard,
  },
  { id: "chat", label: "_CHAT", path: "/chat", icon: Icons.chat, badge: true },
  { id: "apps", label: "_ASSITANT", path: "/", icon: Icons.apps },
  { id: "history", label: "_HISTORY", path: "/history", icon: Icons.history },
  {
    id: "customize",
    label: "_PERSONA",
    path: "/customize",
    icon: Icons.customize,
  },
];

// ─── helper: shorten email/id for display ────────────
function shortId(str = "") {
  if (!str) return "—";
  if (str.includes("@")) {
    // email → show first part, max 16 chars
    const part = str.split("@")[0];
    return part.length > 14 ? part.slice(0, 14) + "…" : part;
  }
  return str.length > 16 ? str.slice(0, 14) + "…" : str;
}

function getInitials(name = "", email = "") {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
}

// ─── Main Navbar Component ────────────────────────────
export default function Navbar({ unreadCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [logoutHov, setLogoutHov] = useState(false);
  const [sysTime, setSysTime] = useState(new Date());

  // ── Dynamic user — read from localStorage directly ──
  // This runs on mount AND updates if storage changes
  const [userData, setuserData] = useState(() => loadUserFromStorage());
  // Navbar mein logout function ko yeh se replace karo
  const handleLogout = async () => {
    try {
      window.speechSynthesis?.cancel();
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    } finally {
      // Sab kuch force clear karo
      localStorage.clear();
      sessionStorage.clear();
      setuserData(null);

      // Cookie manually delete karo browser se
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Hard redirect — navigate() nahi, window.location use karo
      window.location.href = "/login";
    }
  };

  function loadUserFromStorage() {
    try {
      // Try nexa_user first (set on login)
      const raw = localStorage.getItem("nexa_user");
      if (raw) return JSON.parse(raw);

      // Fallback: try nexa_token (JWT) and decode payload
      const token = localStorage.getItem("nexa_token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
          name: payload.name || payload.username || "",
          email: payload.email || payload.sub || "",
          id: payload.id || payload.userId || "",
        };
      }
    } catch (_) {}
    return null;
  }

  // Re-read user whenever the component mounts or route changes
  useEffect(() => {
    setuserData(loadUserFromStorage());
  }, [location.pathname]); // refresh on every route change

  // Also listen for localStorage changes (e.g. login in another tab)
  useEffect(() => {
    const onStorage = () => setuserData(loadUserFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setSysTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Inject keyframes once
  useEffect(() => {
    const id = "nexa-nav-kf";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        @keyframes nexaPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.3); }
        }
        @keyframes nexaGlow {
          0%,100% { box-shadow: 0 0 12px rgba(0,229,255,0.4); }
          50%      { box-shadow: 0 0 28px rgba(0,229,255,0.75), 0 0 8px rgba(0,229,255,0.3); }
        }
        @keyframes nexaRingPulse {
          0%   { box-shadow: 0 0 0 0 rgba(0,229,255,0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(0,229,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,229,255,0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const isActive = (path) => location.pathname === path;
  const chatBadge = unreadCount > 0 ? unreadCount : null;

  // Derived user display values
  const displayName = userData?.name || userData?.username || "";
  const displayEmail = userData?.email || "";
  const displayId = userData?.id || "";
  const initials = getInitials(displayName, displayEmail);
  // Primary label: prefer name, then email prefix, then id
  const primaryLabel = displayName
    ? shortId(displayName)
    : displayEmail
      ? shortId(displayEmail)
      : shortId(displayId) || "guest_user";
  // Secondary: show email if name is primary, else show id
  const secondaryLabel =
    displayName && displayEmail
      ? shortId(displayEmail)
      : displayId
        ? `id_${shortId(displayId)}`
        : "auth_status: ENCRYPTED";

  // ─── Styles ──────────────────────────────────────────
  const S = {
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: collapsed ? "56px" : "224px",
      backgroundImage: `linear-gradient(rgba(2,12,20,0.9), rgba(2,12,20,0.6)), url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRight: "1px solid rgba(0,229,255,0.18)",
      display: "flex",
      flexDirection: "column",
      zIndex: 1000,
      transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
    },

    logoBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 14px",
      borderBottom: "1px solid rgba(0,229,255,0.1)",
      flexShrink: 0,
      minHeight: 64,
    },

    logoOrb: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,229,255,0.1)",
      // ✅ IMPROVED: animated glow on logo
      animation: "nexaGlow 3s ease-in-out infinite",
      flexShrink: 0,
    },

    collapseBtn: {
      width: 22,
      height: 22,
      border: "1px solid rgba(0,229,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#4a8a9a",
      background: "transparent",
      flexShrink: 0,
      transition: "color 0.2s, border-color 0.2s, background 0.2s",
      borderRadius: 2,
    },

    nav: {
      flex: 1,
      padding: "8px 0",
      overflowY: "auto",
      overflowX: "hidden",
      scrollbarWidth: "none",
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#00ff88",
      flexShrink: 0,
      animation: "nexaPulse 2s ease-in-out infinite",
    },

    divider: {
      height: 1,
      background: "rgba(0,229,255,0.08)",
      margin: "6px 14px",
    },

    tooltip: {
      position: "absolute",
      left: "calc(100% + 10px)",
      top: "50%",
      transform: "translateY(-50%)",
      background: "#041520",
      border: "1px solid rgba(0,229,255,0.3)",
      color: "#00e5ff",
      fontSize: 10,
      padding: "4px 10px",
      letterSpacing: "1px",
      fontFamily: "Rajdhani sans-serif",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      zIndex: 9999,
      borderRadius: 2,
    },
  };

  // ─────────────────────────────────────────────────────
  return (
    <aside style={S.sidebar}>
      {/* ── Logo bar ── */}
      <div style={S.logoBar}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            overflow: "hidden",
            flex: 1,
          }}
        >
          {/* Logo orb with animated glow */}
          <div style={S.logoOrb}>
            <img
              src={logo}
              alt="logo"
              style={{ width: 22, height: 22, objectFit: "contain" }}
            />
          </div>

          {!collapsed && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* ✅ IMPROVED: Orbitron-style font for brand */}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#00e5ff",
                  letterSpacing: "3px",
                  fontFamily: "'Orbitron', 'Courier New', monospace",
                  whiteSpace: "nowrap",
                  textShadow: "0 0 12px rgba(0,229,255,0.5)",
                }}
              >
                NEXA_AI
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: "#2a7a8a",
                  letterSpacing: "2px",
                  fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                }}
              >
                CORE_v1.0.4
              </span>
            </div>
          )}
        </div>

        <button
          style={S.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span
            style={{
              display: "inline-flex",
              transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.25s",
              color: "inherit",
            }}
          >
            {Icons.chevron}
          </span>
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav style={S.nav}>
        {/* System status — expanded only */}
        {!collapsed && (
          <div
            style={{
              padding: "8px 14px 10px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={S.statusDot} />
            <span
              style={{
                fontSize: 9,
                color: "#00ff88",
                letterSpacing: "2.5px",
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
              }}
            >
              SYSTEM_ONLINE
            </span>
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const hovered = hoveredId === item.id;
          const showBadge = item.badge && chatBadge;

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "11px 0" : "9px 14px",
                justifyContent: collapsed ? "center" : "flex-start",
                cursor: "pointer",
                background: active
                  ? "rgba(0,229,255,0.07)"
                  : hovered
                    ? "rgba(0,229,255,0.03)"
                    : "transparent",
                borderLeft: active
                  ? "2px solid #00e5ff"
                  : "2px solid transparent",
                marginBottom: 1,
                transition: "all 0.15s ease",
                position: "relative",
                userSelect: "none",
                boxSizing: "border-box",
                width: "100%",
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Icon */}
              <span
                style={{
                  color: active ? "#00e5ff" : hovered ? "#4ab8c8" : "#2a6a7a",
                  flexShrink: 0,
                  display: "flex",
                  transition: "color 0.15s",
                  // ✅ glow on active icon
                  filter: active
                    ? "drop-shadow(0 0 4px rgba(0,229,255,0.6))"
                    : "none",
                }}
              >
                {item.icon}
              </span>

              {/* Label */}
              {!collapsed && (
                <span
                  style={{
                    // ✅ IMPROVED: slightly larger, Rajdhani for readability
                    fontSize: 11,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#00e5ff" : hovered ? "#5ac8d8" : "#3a7a8a",
                    letterSpacing: "1.5px",
                    fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                    whiteSpace: "nowrap",
                    transition: "color 0.15s",
                    flex: 1,
                  }}
                >
                  {item.label}
                </span>
              )}

              {/* Badge */}
              {!collapsed && showBadge && (
                <span
                  style={{
                    minWidth: 17,
                    height: 17,
                    borderRadius: "50%",
                    background: "#00e5ff",
                    color: "#020c14",
                    fontSize: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    flexShrink: 0,
                    fontFamily: "'Courier New', monospace",
                    animation: "nexaRingPulse 2s infinite",
                  }}
                >
                  {chatBadge}
                </span>
              )}

              {/* Tooltip (collapsed only) */}
              {collapsed && hovered && (
                <span style={S.tooltip}>{item.label}</span>
              )}
            </div>
          );
        })}

        <div style={S.divider} />

        {/* Logout */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "11px 0" : "9px 14px",
            justifyContent: collapsed ? "center" : "flex-start",
            cursor: "pointer",
            background: logoutHov ? "rgba(255,68,102,0.05)" : "transparent",
            border: "none",
            borderLeft: logoutHov
              ? "2px solid #ff4466"
              : "2px solid transparent",
            width: "100%",
            color: logoutHov ? "#ff4466" : "#3a4a5a",
            transition: "all 0.2s",
            position: "relative",
            boxSizing: "border-box",
          }}
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHov(true)}
          onMouseLeave={() => setLogoutHov(false)}
        >
          <span style={{ display: "flex", color: "inherit", flexShrink: 0 }}>
            {Icons.logout}
          </span>
          {!collapsed && (
            <span
              style={{
                fontSize: 11,
                letterSpacing: "1.5px",
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                color: "inherit",
              }}
            >
              _LOGOUT
            </span>
          )}
          {collapsed && logoutHov && <span style={S.tooltip}>_LOGOUT</span>}
        </button>
      </nav>

      {/* ── Footer: dynamic user info ── */}
      <div
        style={{
          padding: collapsed ? "12px 0" : "12px 14px",
          borderTop: "1px solid rgba(0,229,255,0.1)",
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          // Collapsed: avatar circle only
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(0,229,255,0.1)",
                border: "1px solid rgba(0,229,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "#00e5ff",
                fontFamily: "'Courier New', monospace",
                letterSpacing: 0,
              }}
            >
              {initials}
            </div>
          </div>
        ) : (
          <>
            {/* System time */}
            <div
              style={{
                fontSize: 9,
                color: "#2a5a6a",
                letterSpacing: "1px",
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                marginBottom: 8,
              }}
            >
              SYS_TIME:{" "}
              <span style={{ color: "#4aacbc" }}>
                {sysTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            {/* ✅ FIXED: Dynamic user card */}
            <div
              style={{
                padding: "9px 10px",
                background: "rgba(0,229,255,0.04)",
                border: "1px solid rgba(0,229,255,0.12)",
                borderRadius: 3,
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Avatar circle with initials */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,100,140,0.3))",
                    border: "1px solid rgba(0,229,255,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#00e5ff",
                    fontFamily: "'Courier New', monospace",
                    flexShrink: 0,
                    letterSpacing: 0,
                    // ✅ pulse ring on avatar
                    animation: "nexaRingPulse 3s ease-in-out infinite",
                  }}
                >
                  {initials}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Primary label — name or email prefix */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#00e5ff",
                      fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textShadow: "0 0 8px rgba(0,229,255,0.4)",
                    }}
                  >
                    {primaryLabel}
                  </div>

                  {/* Secondary label — email or id */}
                  <div
                    style={{
                      fontSize: 9,
                      color: "#3a7a8a",
                      fontFamily: "'Courier New', monospace",
                      marginTop: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {secondaryLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Mic status */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#2a6a7a", display: "flex" }}>
                {Icons.mic}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: "#2a6a7a",
                  letterSpacing: "1.5px",
                  fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                }}
              >
                MIC_READY
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Layout Wrapper ───────────────────────────────────
export function NavbarLayout({ children, unreadCount }) {
  const [collapsed, setCollapsed] = useState(false);

  // Listen to sidebar width via CSS var or fixed value
  // We use a simple approach: track collapsed via shared state
  // For a cleaner solution, lift this state to a context
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#030f1a" }}>
      <Navbar unreadCount={unreadCount} />
      <main
        style={{
          // ✅ Dynamically adjust left margin based on sidebar state
          // Since collapsed state lives in Navbar, use CSS transition trick
          marginLeft: 224, // matches expanded width — adjust if you share collapse state
          flex: 1,
          minHeight: "100vh",
          background: "#030f1a",
          backgroundImage:
            "radial-gradient(circle, #0a2a3a 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
