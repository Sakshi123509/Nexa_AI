import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../contextAPI/Usercontext";
import { initNeuralBackground } from "./HomeAnimation";
import "./css/login.css";
import logo from "../assets/logo.png";
import imgage2 from"../assets/image2.jpg"

// Assuming these are defined in your CSS or constants
const var_lime = "#39ff14";

export default function Login() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { serverUrl, setuserData } = useContext(UserDataContext);

  // View state: 'login' or 'register'
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Background Animation Setup
  useEffect(() => {
    if (canvasRef.current) {
      return initNeuralBackground(canvasRef.current);
    }
  }, []);

  // Handle Form Submission (Login or Register)
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
        backgroundColor: "#0a0b0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        
        style={{
          background:URL({}),
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        className="nx-auth-container"
        style={{ zIndex: 10, position: "relative", padding: 24 }}
      >
        <div
          style={{ width: "100%", maxWidth: 440, position: "relative" }}
          className="nx-fade-1"
        >
          {/* Main Terminal Frame */}
          <div
            style={{
              background: "rgba(10,12,18,0.95)",
              border: "1px solid rgba(0, 242, 255, 0.2)",
              backdropFilter: "blur(24px)",
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Terminal header */}
            <div
              className="nx-terminal-header"
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
              <span>NEXA_IDENTITY_MANAGEMENT_v1.0.4</span>
              <span style={{ marginLeft: "auto", color: var_lime }}>
                ● ONLINE
              </span>
            </div>

            <div style={{ padding: "40px" }}>
              {/* Brand Section */}
              <div style={{ marginBottom: 32, textAlign: "center" }}>
                {/* LOGO ADDED HERE */}
                <img
                  src={logo}
                  alt="Nexa Logo"
                  style={{
                    width: "120px", // Adjust size as needed
                    height: "auto",
                    marginBottom: "20px",
                    filter: "drop-shadow(0 0 2px rgba(0, 242, 255, 0.5))", // Optional: Logo glow
                  }}
                />

                <h1
                  className="nx-orbitron"
                  style={{
                    fontSize: 26,
                    letterSpacing: 3,
                    color: "white",
                    marginBottom: 6,
                  }}
                >
                  {view === "login" ? "NEXA PROTOCOL" : "REGISTRATION"}
                  <span className="nx-cursor">_</span>
                </h1>

                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "monospace",
                  }}
                >
                  SYSTEM_STATUS:{" "}
                  <span
                    style={{
                      color: var_lime,
                      textShadow: "0 0 8px" + var_lime,
                    }}
                  >
                    ONLINE
                  </span>
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Show Callsign only on Registration */}
                {view === "register" && (
                  <div>
                    <div
                      className="nx-label"
                      style={{
                        fontSize: "11px",
                        color: "#00f2ff",
                        marginBottom: "8px",
                      }}
                    >
                      __OPERATOR_CALLSIGN
                    </div>
                    <input
                    style={{
                    backgroundcolor: "transparent"}
                    }
                      className="nx-input"
                      type="text"
                      placeholder="Agent name..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div>
                  <div
                    className="nx-label"
                    style={{
                      fontSize: "11px",
                      color: "#00f2ff",
                      marginBottom: "8px",
                    }}
                  >
                    __ACCESS_IDENTIFIER
                  </div>
                  <input
                    className="nx-input"
                    type="email"
                    placeholder="user@nexa.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div
                    className="nx-label"
                    style={{
                      fontSize: "11px",
                      color: "#00f2ff",
                      marginBottom: "8px",
                    }}
                  >
                    SECURITY_PHRASE
                  </div>
                  <input
                    className="nx-input"
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginTop: 8 }}>
                  <button className="nx-btn" type="submit" disabled={loading}>
                    {loading
                      ? view === "login"
                        ? "DECRYPTING..."
                        : "REGISTERING..."
                      : view === "login"
                        ? "⟶ INITIALIZE_SESSION"
                        : "⟶ CREATE_IDENTITY"}
                  </button>
                </div>

                {/* Footer Links */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      fontFamily: "monospace",
                    }}
                  >
                    RECOVER_KEY
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#00f2ff",
                      cursor: "pointer",
                      fontFamily: "monospace",
                    }}
                    onClick={() =>
                      setView(view === "login" ? "register" : "login")
                    }
                  >
                    {view === "login"
                      ? "REGISTER_NEW_ID →"
                      : "← RETURN_TO_LOGIN"}
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
