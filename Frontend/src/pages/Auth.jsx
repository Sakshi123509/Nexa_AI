import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../contextAPI/Usercontext";
import { initNeuralBackground } from "../components/Animation";
import logo from "../assets/removed_logo.png";
import imgage2 from "../assets/image2.jpg";
import login_bg from "../assets/login_bg.jpg";

const var_lime = "#39ff14";

export default function Login() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { serverUrl, setuserData } = useContext(UserDataContext);

  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (canvasRef.current) {
      return initNeuralBackground(canvasRef.current);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint =
      view === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      view === "login" ? { email, password } : { name, email, password };

    try {
      const res = await axios.post(`${serverUrl}${endpoint}`, payload, {
        withCredentials: true,
      });

      localStorage.setItem(
        "nexa_user",
        JSON.stringify({
          id: res.data._id, // ⚠️ _id use karna (MongoDB)
          name: res.data.name,
          email: res.data.email,
        }),
      );

      setuserData(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="nx-auth-root"
      style={{
        position: "relative",
        minHeight: "100vh",
        // Remove default backgroundColor
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "20px", // Prevents container from touching screen edges on mobile
      }}
    >
      {/* Background Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3, // Lower opacity so text is readable
          zIndex: 0,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* Main Container: Fixed Width for Consistency */}
      <div
        className="nx-auth-container nx-fade-1"
        style={{
          zIndex: 10,
          position: "relative",
          width: "100%",
          maxWidth: "400px", // Strict max-width so Login and Register match
        }}
      >
        <div
          style={{
            // 1. Image aur Overlay ko ek sath combine karein
            backgroundImage: `linear-gradient(rgba(0.9,0.7,0.8,0.8), rgba(0.8,0.8,0.8,0.8)), url(${login_bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",

            // 2. Glassmorphism Effects
            border: "1px solid rgba(0, 242, 255, 0.2)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.6)",

            // 3. Responsiveness Setup
            width: "100%",
            maxWidth: "420px", // Dono (Login/Register) ko same rakhne ke liye
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              height: "32px",
              background: "rgba(255, 255, 255, 0.05)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              padding: "0 15px",
              gap: "12px",
              fontFamily: "monospace",
              fontSize: "10px",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <span
              style={{
                height: "8px",
                width: "8px",
                borderRadius: "50%",
                background: var_lime,
              }}
            />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              NEXA_CORE_v1.0.4
            </span>
            <span style={{ marginLeft: "auto", color: var_lime }}>
              ● ONLINE
            </span>
          </div>

          <div style={{ padding: "clamp(20px, 5vw, 40px)" }}>
            {/* Logo Section */}
            <div style={{ marginBottom: 25, textAlign: "center" }}>
              <div className="logo-wrapper">
                <img
                  src={logo}
                  alt="Nexa Logo"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    marginBottom: "15px",
                    filter: "drop-shadow(0 0 10px rgba(0, 242, 255, 0.3))",
                  }}
                />
              </div>

              <h1
                className="nx-orbitron"
                style={{
                  fontSize: "22px",
                  letterSpacing: "2px",
                  color: "white",
                  margin: "0 0 5px 0",
                }}
              >
                {view === "login" ? "NEXA PROTOCOL_" : "REGISTRATION_"}
              </h1>
              <p
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "monospace",
                }}
              >
                AUTH_STATUS: <span style={{ color: var_lime }}>ENCRYPTED</span>
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              {view === "register" && (
                <div className="input-group">
                  <label style={labelStyle}>__OPERATOR_CALLSIGN</label>
                  <input
                    className="nx-input"
                    type="text"
                    placeholder="Agent name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <label style={labelStyle}>__ACCESS_IDENTIFIER</label>
                <input
                  className="nx-input"
                  type="email"
                  placeholder="user@nexa.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label style={labelStyle}>SECURITY_PHRASE</label>
                <input
                  className="nx-input"
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="nx-btn"
                type="submit"
                disabled={loading}
                style={{ marginTop: "10px" }}
              >
                {loading
                  ? "PROCESSING..."
                  : view === "login"
                    ? "⟶ INITIALIZE_SESSION"
                    : "⟶ CREATE_IDENTITY"}
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <span style={footerLinkStyle}>RECOVER_KEY</span>
                <span
                  style={{ ...footerLinkStyle, color: "#00f2ff" }}
                  onClick={() =>
                    setView(view === "login" ? "register" : "login")
                  }
                >
                  {view === "login" ? "REGISTER_ID →" : "← LOGIN"}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal Styles to keep code clean
const labelStyle = {
  display: "block",
  fontSize: "10px",
  color: "#00f2ff",
  marginBottom: "6px",
  fontFamily: "monospace",
  letterSpacing: "1px",
};

const footerLinkStyle = {
  fontSize: "10px",
  color: "rgba(255,255,255,0.3)",
  cursor: "pointer",
  fontFamily: "monospace",
};
