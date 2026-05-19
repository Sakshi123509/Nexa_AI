import { useState } from "react";
import bgImage from "../assets/authBg.png";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import axios from "axios";

const Register = () => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [userData, setuserData] = useState(null);

  const navigate = useNavigate();
  const { serverUrl } = useContext(UserDataContext);

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(
        `/api/auth/register`,
        {
          name,
          email,
          password, //bhjena h ye sab
        },
        {
          withCredentials: true,
        },
      );
      setuserData(result.data);
      console.log(result.data);
      navigate("/login");
    } catch (error) {
      setuserData(null);
      console.log(error);
      setErr(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Box in middle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/60 h-[52vh] w-[45vh] rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-white text-2xl font-bold mb-4">
            Register to <span className="text-purple-400">ARIA</span>
          </h1>

          <form
            className="flex flex-col gap-4 rounded-2xl w-full"
            onSubmit={handlesubmit}
          >
            <input
              type="text"
              placeholder="Name"
              className="bg-white/10 border border-white/40 rounded-2xl px-4 py-3 text-white placeholder-white/50 outline-none focus:border-purple-400 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="bg-white/10 border border-white/40 rounded-2xl px-4 py-3 text-white placeholder-white/50 outline-none focus:border-purple-400 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative w-full">
              <input
                type={ShowPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-white/10 border border-white/40 rounded-2xl px-4 py-3 text-white placeholder-white/50 outline-none focus:border-purple-400 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Icon div ke andar, input ke bahar */}
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 cursor-pointer hover:text-white"
                onClick={() => setShowPassword(!ShowPassword)}
              >
                {ShowPassword ? <IoMdEyeOff size={20} /> : <FaEye size={20} />}
              </span>
            </div>
            <div>
              {err.length > 0 && <p className="text-red-500 text-sm">*{err}</p>}
            </div>
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 transition-all rounded-lg py-2 text-white font-semibold mt-1"
            >
              Register
            </button>

            <p className="text-center text-white/90 text-sm mb-1">
              Already have an account?{" "}
              <span
                className="cursor-pointer text-purple-500"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
