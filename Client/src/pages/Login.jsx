import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "../ApiUri";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API}/users/login`,
        { accountNumber, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.user._id);
      toast.success(res.data.message || "Login successful");
      setMessage(res.data.message || "Login successful");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed")
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="bg-zinc-900 p-10 rounded-xl shadow-md max-w-md w-full border border-zinc-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-500">FirstChoice Bank</h2>
          <p className="text-sm text-gray-400 mt-1">Secure Digital Access</p>
        </div>

        {/* Account Number Field */}
        <div className="mb-5 relative">
          <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Account Number"
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="mb-5 relative">
          {showPassword ? (
            <EyeOff
              className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
              size={20}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
              size={20}
              onClick={() => setShowPassword(true)}
            />
          )}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-4 pr-10 py-2 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>


        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
        >
          Login
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
