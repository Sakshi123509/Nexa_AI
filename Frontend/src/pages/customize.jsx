import { useState, useRef, useContext } from "react";
import Image1 from "../assets/image1.png";
import Image2 from "../assets/AIbg.jpg";
import Image3 from "../assets/Eleven.webp";
import Image4 from "../assets/image2.jpg";
import Image5 from "../assets/image4.png";
import Image6 from "../assets/image5.png";
import Image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { UserDataContext } from "../contextAPI/Usercontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

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

  const handleImage = (e) => {
    const file = e.target.files[0];
    setbackendImage(file);
    const url = URL.createObjectURL(file);
    setfrontendImage(url);
    setselectedImg(url);
  };

  const handleSave = async () => {
    // Yeh add karo upar:
    if (!selectedImg) return setError("Select One Image!");
    if (!assistantName.trim()) return setError("Enter Assistant name!");

    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageurl", selectedImg);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true },
      );

      console.log(result.data);
      setuserData(result.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-black to-[#050353]  relative p-5 px-6 sm:px-16 md:px-24 lg:px-44">
      <IoMdArrowRoundBack
        className="absolute size-6 text-white top-4 left-4 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      <h1 className="text-white text-4xl font-bold text-center mb-2 mt-7 ">
        AI Assistant
      </h1>
      <p className="text-white/80 text-2xl font-semibold text-center mb-18">
        Select Your <span className="text-purple-600">Assistant image</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt={`Robot ${index + 1}`}
              onClick={() => {
                setselectedImg(img);
                setfrontendImage(""); // upload clear
              }}
              className={`w-full h-36 lg:h-56 object-cover rounded-lg cursor-pointer 
        transition-all duration-300 hover:scale-105 border-2
        ${
          selectedImg === img
            ? "border-purple-500 scale-105 brightness-75" // ← selected = dim + purple border
            : "border-transparent hover:border-purple-400" // ← hover = light purple
        }`}
            />
            {/* Selected checkmark */}
            {selectedImg === img && (
              <div
                className="absolute top-2 right-2 bg-purple-500 rounded-full w-6 h-6 
        flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        ))}

        <label
          className="w-full h-36 object-cover border-white rounded-lg shadow-xl  lg:h-56 
  cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden hover:border-yellow-600 border-2 flex flex-col items-center justify-center gap-2"
        >
          {/* Icon aur text */}
          {!frontendImage && (
            <>
              <RiImageAddLine className="text-5xl text-white/50" />
              <span className="text-white/50 text-sm hidden">Upload Image</span>
            </>
          )}
          {frontendImage && (
            <img src={frontendImage} className=" h-full object-cover w-full" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            hidden
            onChange={handleImage}
          />
        </label>
      </div>

      {selectedImg ? (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter Assistant name..."
            value={assistantName}
            onChange={(e) => setassistantName(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg bg-white/10 text-white 
            placeholder-white/40 border border-white/20 outline-none 
            focus:border-purple-500 transition"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleSave}
            className="w-full max-w-md py-3 cursor-pointer rounded-2xl bg-purple-600 hover:bg-purple-700 
            text-white font-semibold  transition-all duration-300"
          >
            Save & Continue →
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Customize;
