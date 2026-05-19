// import { useEffect, createContext, useState, useContext } from "react";
// import axios from "axios";

// export const UserDataContext = createContext();

// const UserContext = ({ children }) => {
//   const serverUrl = ""; //saved in vite config
//   const [frontendImage, setfrontendImage] = useState(null);
//   const [backendImage, setbackendImage] = useState(null);
//   const [selectedImg, setselectedImg] = useState(null);
//   const [userData, setuserData] = useState(null);

//   const getGeminiResponse = async (command) => {
//     try {
//       const response = await axios.post(
//         `${serverUrl}/api/user/asktoassistant`, // ← apna exact route check karo
//         { prompt: command }, // ← backend expects "prompt" key
//         { withCredentials: true },
//       );
//       return response.data;
//     } catch (error) {
//       console.log(
//         "getGeminiResponse error:",
//         error.response?.data || error.message,
//       );
//       return null;
//     }
//   };
//   const values = {
//     serverUrl,
//     userData,
//     setuserData,
//     backendImage,
//     setbackendImage,
//     frontendImage,
//     setfrontendImage,
//     selectedImg,
//     setselectedImg,
//     getGeminiResponse,
//   };

//   const handlecurrentuser = async () => {
//     try {
//       const result = await axios.get("/api/user/current", {
//         withCredentials: true,
//       });
//       setuserData(result.data);
//       console.log(result.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const token = document.cookie.includes("token"); ///check if token is there
//     if (token) handlecurrentuser();
//     // }
//   }, []);

//   return (
//     // div nahi, fragment ya seedha Provider
//     <UserDataContext.Provider value={values}>
//       {children}
//     </UserDataContext.Provider>
//   );
// };

// export default UserContext;

import { useEffect, createContext, useState } from "react";
import axios from "axios";
export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = import.meta.env.VITE_API_URL; // vite proxy handles this
  const [frontendImage, setfrontendImage] = useState(null);
  const [backendImage, setbackendImage] = useState(null);
  const [selectedImg, setselectedImg] = useState(null);
  const [userData, setuserData] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const getGeminiResponse = async (command) => {
    try {
      const response = await axios.post(
        `/api/user/asktoassistant`,
        { prompt: command },
        {
          withCredentials: true,
          timeout: 12000,
        },
      );
      return response.data;
    } catch (error) {
      console.log(
        "getGeminiResponse error:",
        error.response?.data || error.message,
      );
      return null;
    }
  };

  const handlecurrentuser = async () => {
    try {
      const result = await axios.get("/api/user/current", {
        withCredentials: true,
      });
      setuserData(result.data);
      console.log("User loaded:", result.data);
      return result.data;
    } catch (error) {
      console.log("handlecurrentuser error:", error);
      setuserData(null);
      localStorage.removeItem("userData");
      throw error;
    }
  };
  useEffect(() => {
    handlecurrentuser()
      .catch(() => {
        setuserData(null);
        localStorage.removeItem("userData");
      })
      .finally(() => setAuthLoaded(true));
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData"); // logout pe clear hoga
    }
  }, [userData]);

  const values = {
    serverUrl,
    userData,
    setuserData,
    authLoaded,
    backendImage,
    setbackendImage,
    frontendImage,
    setfrontendImage,
    selectedImg,
    setselectedImg,
    getGeminiResponse,
  };
  console.log("SERVER URL:", serverUrl);
  return (
    <UserDataContext.Provider value={values}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
