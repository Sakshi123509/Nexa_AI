import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import { useContext } from "react";
import Customize from "./pages/customize.jsx";
import { UserDataContext } from "./contextAPI/Usercontext.jsx";
import Chat from "./pages/Chat.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";

import "./index.css";
import "./App.css";

//userData h to customize pr aiimg aur name dalo nhi h do signin kro
//ai img bhi h to home page pr aa skte ho
const App = () => {
  const { userData, authLoaded, chatHistory, theme, isDark } =
    useContext(UserDataContext);

  if (!authLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading your assistant...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !userData ? (
            <Navigate to="/login" /> // ✅ logout fix
          ) : userData?.AIimg && userData?.Ainame ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />
      <Route
        path="/register"
        element={!userData ? <Register /> : <Navigate to={"/"} />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/login"} />}
      />
      <Route path="/chat" element={<Chat />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/history"
        element={userData ? <History /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
