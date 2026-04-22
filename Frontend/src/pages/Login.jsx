import { useState } from "react";
import bgImage from "../assets/authBg.png";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserDataContext } from "../contextAPI/Usercontext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { serverUrl, setuserData } = useContext(UserDataContext);
  const [ShowPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [Loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password, //bhjena h ye sab
        },
        {
          withCredentials: true,
        },
      );
      console.log(result.data);
      setuserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setuserData(null);
      console.log(error);
      setErr(error.response?.data?.message || "Something went wrong");
      setLoading(false);
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
        <div className="bg-black/60 h-[46vh] w-[45vh] rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-white text-2xl font-bold mb-4">
            Welcome Back!🤖
          </h1>

          <form
            className="flex flex-col gap-4 rounded-2xl w-full"
            onSubmit={handleLogin}
          >
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
              className="bg-purple-500 hover:bg-purple-600 transition-all rounded-lg py-2 text-white font-semibold mt-1"
              disabled={Loading}
            >
              {Loading ? "Loading......." : " Login"}
            </button>

            <p className="text-center text-white text-sm mb-1">
              Don't have an account?{" "}
              <span
                className="cursor-pointer text-purple-500"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
