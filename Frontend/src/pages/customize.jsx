// import { useState, useRef, useContext } from "react";
// import Image1 from "../assets/image1.png";
// import Image2 from "../assets/AIbg.jpg";
// import Image3 from "../assets/Eleven.webp";
// import Image4 from "../assets/image2.jpg";
// import Image5 from "../assets/image4.png";
// import Image6 from "../assets/image5.png";
// import Image7 from "../assets/image7.jpeg";
// import { RiImageAddLine } from "react-icons/ri";
// import { UserDataContext } from "../contextAPI/Usercontext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { IoMdArrowRoundBack } from "react-icons/io";

// const Customize = () => {
//   const navigate = useNavigate();
//   const images = [Image1, Image2, Image3, Image4, Image5, Image6, Image7];
//   const {
//     serverUrl,
//     userData,
//     setuserData,
//     backendImage,
//     setbackendImage,
//     frontendImage,
//     setfrontendImage,
//     selectedImg,
//     setselectedImg,
//   } = useContext(UserDataContext);

//   const [assistantName, setassistantName] = useState(
//     userData?.assistantName || "",
//   );

//   const [error, setError] = useState("");

//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     setbackendImage(file);
//     const url = URL.createObjectURL(file);
//     setfrontendImage(url);
//     setselectedImg(url);
//   };

//   const handleSave = async () => {
//     // Yeh add karo upar:
//     if (!selectedImg) return setError("Select One Image!");
//     if (!assistantName.trim()) return setError("Enter Assistant name!");

//     try {
//       let formData = new FormData();
//       formData.append("assistantName", assistantName);
//       if (backendImage) {
//         formData.append("assistantImage", backendImage);
//       } else {
//         formData.append("imageurl", selectedImg);
//       }
//       const result = await axios.post(
//         `${serverUrl}/api/user/update`,
//         formData,
//         { withCredentials: true },
//       );

//       console.log(result.data);
//       setuserData(result.data);
//       navigate("/");
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <div className="w-full min-h-screen bg-linear-to-b from-black to-[#050353]  relative p-5 px-6 sm:px-16 md:px-24 lg:px-44">
//       <IoMdArrowRoundBack
//         className="absolute size-6 text-white top-4 left-4 cursor-pointer"
//         onClick={() => {
//           navigate("/");
//         }}
//       />
//       <h1 className="text-white text-4xl font-bold text-center mb-2 mt-7 ">
//         AI Assistant
//       </h1>
//       <p className="text-white/80 text-2xl font-semibold text-center mb-18">
//         Select Your <span className="text-purple-600">Assistant image</span>
//       </p>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
//         {images.map((img, index) => (
//           <div key={index} className="relative">
//             <img
//               src={img}
//               alt={`Robot ${index + 1}`}
//               onClick={() => {
//                 setselectedImg(img);
//                 setfrontendImage(""); // upload clear
//               }}
//               className={`w-full h-36 lg:h-56 object-cover rounded-lg cursor-pointer
//         transition-all duration-300 hover:scale-105 border-2
//         ${
//           selectedImg === img
//             ? "border-purple-500 scale-105 brightness-75" // ← selected = dim + purple border
//             : "border-transparent hover:border-purple-400" // ← hover = light purple
//         }`}
//             />
//             {/* Selected checkmark */}
//             {selectedImg === img && (
//               <div
//                 className="absolute top-2 right-2 bg-purple-500 rounded-full w-6 h-6
//         flex items-center justify-center"
//               >
//                 <span className="text-white text-xs font-bold">✓</span>
//               </div>
//             )}
//           </div>
//         ))}

//         <label
//           className="w-full h-36 object-cover border-white rounded-lg shadow-xl  lg:h-56
//   cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden hover:border-yellow-600 border-2 flex flex-col items-center justify-center gap-2"
//         >
//           {/* Icon aur text */}
//           {!frontendImage && (
//             <>
//               <RiImageAddLine className="text-5xl text-white/50" />
//               <span className="text-white/50 text-sm hidden">Upload Image</span>
//             </>
//           )}
//           {frontendImage && (
//             <img src={frontendImage} className=" h-full object-cover w-full" />
//           )}
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             hidden
//             onChange={handleImage}
//           />
//         </label>
//       </div>

//       {selectedImg ? (
//         <div className="flex flex-col items-center gap-4">
//           <input
//             type="text"
//             placeholder="Enter Assistant name..."
//             value={assistantName}
//             onChange={(e) => setassistantName(e.target.value)}
//             className="w-full max-w-md px-4 py-3 rounded-lg bg-white/10 text-white
//             placeholder-white/40 border border-white/20 outline-none
//             focus:border-purple-500 transition"
//           />
//           {error && <p className="text-red-400 text-sm">{error}</p>}
//           <button
//             onClick={handleSave}
//             className="w-full max-w-md py-3 cursor-pointer rounded-2xl bg-purple-600 hover:bg-purple-700
//             text-white font-semibold  transition-all duration-300"
//           >
//             Save & Continue →
//           </button>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default Customize;

// // pages/Customize.jsx
// // ─────────────────────────────────────────────────────
// // First screen after login.
// // User picks an AI avatar image + types a custom name.
// // Saves to localStorage → navigates to /home
// // ─────────────────────────────────────────────────────
// // import { useState, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './Customize.css';

// // ── Built-in assistant presets ──────────────────────
// // Replace src values with your actual image paths in /assets/
// // const PRESETS = [
// //   {
// //     id: 'aria',
// //     src: '/assets/assistants/aria.jpg',       // purple/pink cyberpunk face
// //     name: 'ARIA',
// //     trait: 'Analytical · Sharp · Direct',
// //     color: '#cc44ff',
// //     systemPrompt: 'You are ARIA, a sharp and analytical AI assistant. You give concise, direct answers. You are precise and never waste words.',
// //   },
// //   {
// //     id: 'nexus',
// //     src: '/assets/assistants/nexus.jpg',      // white sleek robot
// //     name: 'NEXUS',
// //     trait: 'Logical · Calm · Precise',
// //     color: '#00e5ff',
// //     systemPrompt: 'You are NEXUS, a calm and logical AI assistant. You think step-by-step and always structure your answers clearly.',
// //   },
// //   {
// //     id: 'nova',
// //     src: '/assets/assistants/nova.jpg',       // friendly holographic girl
// //     name: 'NOVA',
// //     trait: 'Friendly · Helpful · Warm',
// //     color: '#00bbff',
// //     systemPrompt: 'You are NOVA, a warm and helpful AI assistant. You are encouraging, friendly, and always make the user feel supported.',
// //   },
// //   {
// //     id: 'titan',
// //     src: '/assets/assistants/titan.jpg',      // gold/blue heavy robot
// //     name: 'TITAN',
// //     trait: 'Powerful · Bold · Confident',
// //     color: '#ffaa00',
// //     systemPrompt: 'You are TITAN, a bold and powerful AI assistant. You speak with confidence and authority. You get straight to the point.',
// //   },
// //   {
// //     id: 'echo',
// //     src: '/assets/assistants/echo.jpg',       // orange-lit human face
// //     name: 'ECHO',
// //     trait: 'Creative · Expressive · Witty',
// //     color: '#ff6644',
// //     systemPrompt: 'You are ECHO, a creative and witty AI assistant. You love using analogies, humor, and creative explanations to make things click.',
// //   },
// //   {
// //     id: 'cipher',
// //     src: '/assets/assistants/cipher.jpg',     // teal wired face
// //     name: 'CIPHER',
// //     trait: 'Mysterious · Tactical · Deep',
// //     color: '#00ffcc',
// //     systemPrompt: 'You are CIPHER, a tactical and deep-thinking AI assistant. You analyze situations from multiple angles and reveal hidden insights.',
// //   },
// //   {
// //     id: 'oracle',
// //     src: '/assets/assistants/oracle.jpg',     // glowing-eye dark robot
// //     name: 'ORACLE',
// //     trait: 'Wise · Reflective · Patient',
// //     color: '#bb88ff',
// //     systemPrompt: 'You are ORACLE, a wise and patient AI assistant. You take time to understand the full picture before responding thoughtfully.',
// //   },
// // ];

// // // ── Customize Page Component ────────────────────────
// // export default function Customize() {
// //   const navigate = useNavigate();

// //   const [selected, setSelected]   = useState(null);   // preset id or 'custom'
// //   const [customImg, setCustomImg] = useState(null);    // base64 for user-uploaded image
// //   const [assistantName, setAssistantName] = useState('');
// //   const [step, setStep]           = useState(1);       // 1 = pick image, 2 = name it
// //   const [error, setError]         = useState('');

// //   const fileInputRef = useRef(null);

// //   // ── Image selection ─────────────────────────
// //   function selectPreset(preset) {
// //     setSelected(preset.id);
// //     setCustomImg(null);
// //     // Pre-fill name with preset name (user can change it)
// //     if (!assistantName || PRESETS.find(p => p.name === assistantName)) {
// //       setAssistantName(preset.name);
// //     }
// //     setError('');
// //   }

// //   function handleCustomUpload(e) {
// //     const file = e.target.files[0];
// //     if (!file) return;
// //     if (!file.type.startsWith('image/')) {
// //       setError('Please upload an image file.');
// //       return;
// //     }
// //     const reader = new FileReader();
// //     reader.onload = (ev) => {
// //       setCustomImg(ev.target.result);
// //       setSelected('custom');
// //       setError('');
// //     };
// //     reader.readAsDataURL(file);
// //   }

// //   // ── Step navigation ─────────────────────────
// //   function goToNameStep() {
// //     if (!selected) {
// //       setError('Please select or upload an assistant image first.');
// //       return;
// //     }
// //     setStep(2);
// //     setError('');
// //   }

// //   function goBack() {
// //     if (step === 2) setStep(1);
// //     else navigate(-1);
// //   }

// //   // ── Final save ──────────────────────────────
// //   function handleConfirm() {
// //     const finalName = assistantName.trim().toUpperCase() || 'NEXA';
// //     if (finalName.length < 1) {
// //       setError('Please enter a name for your assistant.');
// //       return;
// //     }

// //     const preset = PRESETS.find(p => p.id === selected);
// //     const avatar = selected === 'custom' ? customImg : (preset?.src ?? '');
// //     const systemPrompt = preset
// //       ? preset.systemPrompt.replace(preset.name, finalName)
// //       : `You are ${finalName}, a helpful and intelligent AI voice assistant.`;

// //     // ── Save to localStorage ──
// //     localStorage.setItem('nexa_assistant', JSON.stringify({
// //       name:         finalName,
// //       avatar:       avatar,
// //       accentColor:  preset?.color ?? '#00e5ff',
// //       systemPrompt: systemPrompt,
// //       configuredAt: new Date().toISOString(),
// //     }));

// //     navigate('/home');
// //   }

// //   // ── Computed values ─────────────────────────
// //   const activePreset   = PRESETS.find(p => p.id === selected);
// //   const accentColor    = activePreset?.color ?? '#00e5ff';
// //   const displayAvatar  = selected === 'custom' ? customImg : (activePreset?.src ?? null);

// //   // ════════════════════════════════════════════
// //   return (
// //     <div className="customize-page page-enter">

// //       {/* ── Background effects ── */}
// //       <div className="dot-grid" />
// //       <div className="scanlines" />

// //       {/* ── Top bar ── */}
// //       <div className="cust-topbar">
// //         <button className="cust-back-btn" onClick={goBack}>
// //           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //             <polyline points="15 18 9 12 15 6" />
// //           </svg>
// //           {step === 1 ? 'BACK' : 'CHANGE_IMAGE'}
// //         </button>

// //         {/* Step indicator */}
// //         <div className="cust-steps">
// //           <div className={`cust-step ${step >= 1 ? 'active' : ''}`}>
// //             <span className="cust-step-num">01</span>
// //             <span className="cust-step-label">SELECT_IMAGE</span>
// //           </div>
// //           <div className="cust-step-line" style={{ background: step >= 2 ? accentColor : undefined }} />
// //           <div className={`cust-step ${step >= 2 ? 'active' : ''}`}>
// //             <span className="cust-step-num">02</span>
// //             <span className="cust-step-label">NAME_ASSISTANT</span>
// //           </div>
// //         </div>

// //         <div style={{ width: 80 }} /> {/* spacer */}
// //       </div>

// //       {/* ══════════════════════════════════════
// //           STEP 1 — Pick image
// //           ══════════════════════════════════════ */}
// //       {step === 1 && (
// //         <div className="cust-step1">
// //           <div className="cust-heading-block">
// //             <p className="section-label">// CUSTOMIZE.JSX</p>
// //             <h1 className="cust-title glow-text" style={{ '--accent': accentColor }}>
// //               AI_ASSISTANT
// //             </h1>
// //             <p className="cust-subtitle">
// //               SELECT YOUR <span className="text-teal">ASSISTANT IMAGE</span>
// //             </p>
// //           </div>

// //           {/* Image grid */}
// //           <div className="cust-grid">
// //             {PRESETS.map((preset) => (
// //               <div
// //                 key={preset.id}
// //                 className={`cust-card ${selected === preset.id ? 'selected' : ''}`}
// //                 style={{ '--card-accent': preset.color }}
// //                 onClick={() => selectPreset(preset)}
// //               >
// //                 <img
// //                   src={preset.src}
// //                   alt={preset.name}
// //                   className="cust-card-img"
// //                   onError={(e) => {
// //                     // Fallback placeholder if image not found
// //                     e.target.style.display = 'none';
// //                     e.target.nextSibling.style.display = 'flex';
// //                   }}
// //                 />
// //                 {/* Fallback if image missing */}
// //                 <div className="cust-card-placeholder" style={{ display: 'none' }}>
// //                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={preset.color} strokeWidth="1.5">
// //                     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
// //                   </svg>
// //                   <span style={{ color: preset.color, fontSize: 'var(--text-sm)', marginTop: 8 }}>{preset.name}</span>
// //                 </div>

// //                 {/* Overlay on hover/select */}
// //                 <div className="cust-card-overlay">
// //                   <div className="cust-card-name">{preset.name}</div>
// //                   <div className="cust-card-trait">{preset.trait}</div>
// //                 </div>

// //                 {/* Selection ring */}
// //                 {selected === preset.id && (
// //                   <div className="cust-card-selected-ring" style={{ borderColor: preset.color }}>
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill={preset.color}>
// //                       <polyline points="20 6 9 17 4 12" strokeWidth="2" stroke={preset.color} fill="none" />
// //                     </svg>
// //                   </div>
// //                 )}
// //               </div>
// //             ))}

// //             {/* Custom upload card */}
// //             <div
// //               className={`cust-card cust-card-upload ${selected === 'custom' ? 'selected' : ''}`}
// //               onClick={() => fileInputRef.current?.click()}
// //             >
// //               {customImg ? (
// //                 <>
// //                   <img src={customImg} alt="Custom" className="cust-card-img" />
// //                   <div className="cust-card-overlay">
// //                     <div className="cust-card-name">CUSTOM</div>
// //                     <div className="cust-card-trait">Your image</div>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <div className="cust-upload-placeholder">
// //                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
// //                     <rect x="3" y="3" width="18" height="18" rx="2" />
// //                     <line x1="12" y1="8" x2="12" y2="16" />
// //                     <line x1="8" y1="12" x2="16" y2="12" />
// //                   </svg>
// //                   <span className="cust-upload-label">UPLOAD_IMAGE</span>
// //                 </div>
// //               )}
// //               <input
// //                 ref={fileInputRef}
// //                 type="file"
// //                 accept="image/*"
// //                 style={{ display: 'none' }}
// //                 onChange={handleCustomUpload}
// //               />
// //             </div>
// //           </div>

// //           {/* Error */}
// //           {error && <p className="cust-error">{error}</p>}

// //           {/* CTA */}
// //           <div className="cust-cta">
// //             {selected && (
// //               <div className="cust-selected-preview">
// //                 <span className="text-dim font-mono text-xs ls-widest">SELECTED: </span>
// //                 <span className="text-teal font-mono text-xs ls-wider">
// //                   {selected === 'custom' ? 'CUSTOM_IMAGE' : activePreset?.name}
// //                 </span>
// //                 {activePreset && (
// //                   <span className="text-muted font-mono text-xs"> · {activePreset.trait}</span>
// //                 )}
// //               </div>
// //             )}
// //             <button className="btn-primary cust-continue-btn" onClick={goToNameStep}>
// //               CONTINUE → NAME_ASSISTANT
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* ══════════════════════════════════════
// //           STEP 2 — Name the assistant
// //           ══════════════════════════════════════ */}
// //       {step === 2 && (
// //         <div className="cust-step2 page-enter">
// //           <div className="cust-heading-block">
// //             <p className="section-label">// STEP 02 OF 02</p>
// //             <h1 className="cust-title glow-text" style={{ '--accent': accentColor }}>
// //               NAME_YOUR_ASSISTANT
// //             </h1>
// //             <p className="cust-subtitle">
// //               GIVE YOUR AI A <span className="text-teal">CALL SIGN</span>
// //             </p>
// //           </div>

// //           <div className="cust-name-layout">
// //             {/* Avatar preview */}
// //             <div className="cust-avatar-preview" style={{ borderColor: accentColor, boxShadow: `0 0 30px ${accentColor}33` }}>
// //               {displayAvatar ? (
// //                 <img src={displayAvatar} alt="Assistant" className="cust-avatar-img" />
// //               ) : (
// //                 <div className="cust-avatar-fallback">
// //                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
// //                     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
// //                   </svg>
// //                 </div>
// //               )}
// //               {/* Pulse ring */}
// //               <div className="cust-avatar-ring" style={{ borderColor: accentColor }} />
// //             </div>

// //             {/* Name form */}
// //             <div className="cust-name-form">
// //               <div className="input-group" style={{ marginBottom: 'var(--space-6)' }}>
// //                 <label className="input-label" style={{ color: accentColor }}>
// //                   _ASSISTANT_NAME
// //                 </label>
// //                 <div className="cust-name-input-wrap" style={{ borderColor: accentColor }}>
// //                   <span className="cust-name-prefix" style={{ color: accentColor }}>›_</span>
// //                   <input
// //                     className="cust-name-input"
// //                     type="text"
// //                     placeholder="TYPE A NAME..."
// //                     value={assistantName}
// //                     maxLength={20}
// //                     onChange={(e) => {
// //                       setAssistantName(e.target.value.toUpperCase());
// //                       setError('');
// //                     }}
// //                     onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
// //                     autoFocus
// //                   />
// //                   <span className="blink" style={{ color: accentColor }}>▌</span>
// //                 </div>
// //                 <p className="cust-name-hint">
// //                   Leave blank to use default: <span style={{ color: accentColor }}>{activePreset?.name ?? 'NEXA'}</span>
// //                 </p>
// //               </div>

// //               {/* Personality preview */}
// //               {activePreset && (
// //                 <div className="cust-personality-card" style={{ borderLeftColor: accentColor }}>
// //                   <p className="section-label" style={{ marginBottom: 'var(--space-2)' }}>_PERSONALITY_PROFILE</p>
// //                   <p className="font-mono text-sm" style={{ color: accentColor, marginBottom: 'var(--space-2)' }}>
// //                     {assistantName || activePreset.name} · {activePreset.trait}
// //                   </p>
// //                   <p className="text-secondary text-sm" style={{ lineHeight: 'var(--lh-relaxed)' }}>
// //                     {activePreset.systemPrompt.replace(activePreset.name, assistantName || activePreset.name)}
// //                   </p>
// //                 </div>
// //               )}

// //               {error && <p className="cust-error">{error}</p>}

// //               <button
// //                 className="btn-primary cust-confirm-btn"
// //                 style={{ '--btn-accent': accentColor, borderColor: accentColor, background: accentColor }}
// //                 onClick={handleConfirm}
// //               >
// //                 INITIALIZE_ASSISTANT →
// //               </button>

// //               <p className="cust-disclaimer">
// //                 Your choice is saved locally. You can change it anytime in <span className="text-teal">_SETTINGS</span>.
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

import { useState, useContext, useEffect, useRef } from "react";
import Image1 from "../assets/image1.png";
import Image2 from "../assets/AIbg.jpg";
import Image3 from "../assets/Eleven.webp";
import Image4 from "../assets/image2.jpg";
import Image5 from "../assets/image4.png";
import Image6 from "../assets/image5.png";
import Image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { UserDataContext } from "../contextAPI/Usercontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { initSimpleBackground } from "../components/Animation.jsx";

const Customize = () => {
  const navigate = useNavigate();
  const images = [Image1, Image2, Image3, Image4, Image5, Image6, Image7];

  const {
    serverUrl,
    userData,
    setuserData,
    backendImage,
    setbackendImage,
    frontendImage,
    setfrontendImage,
    selectedImg,
    setselectedImg,
  } = useContext(UserDataContext);

  const [assistantName, setassistantName] = useState(
    userData?.assistantName || "",
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current) {
      return initSimpleBackground(canvasRef.current);
    }
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setbackendImage(file);
    const url = URL.createObjectURL(file);
    setfrontendImage(url);
    setselectedImg(url);
    setError("");
  };

  const handleSave = async () => {
    if (!selectedImg) return setError("⚠ SELECT ONE IMAGE FIRST");
    if (!assistantName.trim()) return setError("⚠ ENTER ASSISTANT NAME");

    try {
      setSaving(true);
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageurl", selectedImg);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/updateassistant`,
        formData,
        { withCredentials: true },
      );
      setuserData(result.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("⚠ SAVE FAILED — TRY AGAIN");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
        padding: "24px 20px 40px",
        overflowX: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Top glow */}
      <div
        style={{
          position: "fixed",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 200,
          background:
            "radial-gradient(ellipse,rgba(0,207,255,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "transparent",
          border: "none",
          color: "rgba(0,207,255,0.5)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "2px",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "var(--radius)",
          transition: "color 0.3s",
          zIndex: 10,
        }}
      >
        <IoMdArrowRoundBack size={16} />
        <span>BACK</span>
      </button>

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 28,
          marginTop: 40,
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(0,207,255,0.35)",
            letterSpacing: "3px",
            marginBottom: 8,
          }}
        >
          // CUSTOMIZE.JSX
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 4vw, 30px)",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "4px",
            textShadow: "0 0 24px rgba(0,207,255,0.25)",
            margin: "0 0 8px",
          }}
        >
          AI_ASSISTANT
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "3px",
          }}
        >
          SELECT YOUR{" "}
          <span style={{ color: "var(--accent)" }}>ASSISTANT IMAGE</span>
        </p>
      </div>

      {/* Image grid */}
      <div style={styles.grid}>
        {images.map((img, index) => {
          const isSelected = selectedImg === img;
          return (
            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px) scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0,207,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              key={index}
              onClick={() => {
                setselectedImg(img);
                setfrontendImage("");
                setError("");
              }}
              style={{
                ...styles.card,
                border: isSelected
                  ? "1.5px solid var(--accent)"
                  : "1px solid rgba(0,229,255,0.1)",
                boxShadow: isSelected
                  ? "0 0 18px rgba(0,207,255,0.18), inset 0 0 0 1px rgba(0,207,255,0.1)"
                  : "none",
              }}
            >
              <img
                src={img}
                alt={`Assistant ${index + 1}`}
                style={{
                  ...styles.cardImg,
                  filter: isSelected ? "brightness(0.7)" : "brightness(1)",
                }}
              />

              {/* Bottom gradient */}
              <div style={styles.cardGradient} />

              {/* Checkmark */}
              {isSelected && <div style={styles.checkmark}>✓</div>}

              {/* Hover overlay (via inline state) */}
              <div style={styles.cardOverlay} />
            </div>
          );
        })}

        {/* Upload card */}
        <label style={styles.uploadCard}>
          {frontendImage ? (
            <img
              src={frontendImage}
              alt="Uploaded"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={styles.uploadInner}>
              <RiImageAddLine
                size={32}
                style={{ color: "rgba(0,207,255,0.35)" }}
              />
              <span style={styles.uploadLabel}>UPLOAD_IMAGE</span>
            </div>
          )}

          {/* Checkmark for uploaded */}
          {frontendImage && selectedImg === frontendImage && (
            <div style={styles.checkmark}>✓</div>
          )}

          <input type="file" accept="image/*" hidden onChange={handleImage} />
        </label>
      </div>

      {/* Name + Save section — only visible when image selected */}
      {selectedImg && (
        <div style={styles.nameSection}>
          {/* Separator */}
          <div style={styles.separator}>
            <div style={styles.sepLine} />
            <span style={styles.sepLabel}>_NAME_ASSISTANT</span>
            <div style={styles.sepLineRight} />
          </div>

          {/* Input */}
          <div style={styles.inputWrap}>
            <span style={styles.inputPrefix}>›_</span>
            <input
              type="text"
              placeholder="TYPE ASSISTANT NAME..."
              value={assistantName}
              maxLength={20}
              onChange={(e) => {
                setassistantName(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              style={styles.nameInput}
              autoFocus
            />
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "#ff4060",
                letterSpacing: "1px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...styles.saveBtn,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,207,255,0.2)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(0,207,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,207,255,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {saving ? "INITIALIZING..." : "INITIALIZE_ASSISTANT →"}
          </button>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(0,207,255,0.22)",
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            SAVED LOCALLY · CHANGE ANYTIME IN{" "}
            <span style={{ color: "var(--accent)" }}>_SETTINGS</span>
          </p>
        </div>
      )}
    </div>
  );
};

/* ─── STYLES ─────────────────────────────────────────── */
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 12,
    marginBottom: 28,
    position: "relative",
    zIndex: 1,
    maxWidth: 860,
    margin: "0 auto 28px",
  },

  card: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    cursor: "pointer",
    aspectRatio: "3/4",
    background: "rgba(0,15,40,0.6)",
    transition: "all 0.3s ease",
  },

  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "filter 0.25s, transform 0.25s",
    display: "block",
  },

  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    background: "linear-gradient(to top,rgba(6,13,26,0.9),transparent)",
    pointerEvents: "none",
  },

  cardOverlay: {
    position: "absolute",
    inset: 0,
    background: "transparent",
    transition: "background 0.25s",
  },

  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "var(--accent)",
    color: "#060d1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    zIndex: 2,
    boxShadow: "0 0 8px rgba(0,207,255,0.5)",
  },

  uploadCard: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    cursor: "pointer",
    aspectRatio: "3/4",
    background: "rgba(0,15,40,0.3)",
    border: "1px dashed rgba(0,229,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.3s",
  },

  uploadInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },

  uploadLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    color: "rgba(0,207,255,0.35)",
    letterSpacing: "2px",
  },

  nameSection: {
    maxWidth: 460,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  separator: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },

  sepLine: {
    flex: 1,
    height: 1,
    background: "linear-gradient(to right,transparent,rgba(0,207,255,0.25))",
  },

  sepLineRight: {
    flex: 1,
    height: 1,
    background: "linear-gradient(to left,transparent,rgba(0,207,255,0.25))",
  },

  sepLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    color: "rgba(0,207,255,0.35)",
    letterSpacing: "2px",
    whiteSpace: "nowrap",
  },

  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputPrefix: {
    position: "absolute",
    left: 12,
    fontFamily: "var(--font-mono)",
    fontSize: 14,
    color: "rgba(0,207,255,0.5)",
    zIndex: 1,
    pointerEvents: "none",
  },

  nameInput: {
    width: "100%",
    padding: "13px 14px 13px 34px",
    background: "rgba(0,25,60,0.45)",
    border: "1px solid rgba(0,229,255,0.2)",
    borderRadius: "var(--radius)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    letterSpacing: "2px",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },

  saveBtn: {
    width: "100%",
    padding: "14px",
    background: "rgba(0,207,255,0.08)",
    border: "1px solid rgba(0,207,255,0.45)",
    borderRadius: "var(--radius)",
    color: "var(--accent)",
    fontFamily: "var(--font-display)",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "3px",
    transition: "all 0.3s",
  },
};

export default Customize;
