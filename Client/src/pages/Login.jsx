import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast"
import {API} from "../ApiUri"
import { useNavigate } from 'react-router-dom';



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

      console.log(res.data);
      localStorage.setItem('token',res.data.token);
      localStorage.setItem('id',res.data.user._id);
      toast.success("Login Successful")
      setMessage(res.data.message || "Login successful");
      navigate('/');

    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-zinc-900 p-10 rounded-xl shadow-lg max-w-md w-full text-white">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-500">FirstChoice Bank</h2>
          <p className="text-gray-400 mt-1">Secure Digital Access</p>
        </div>

        {/* Account Number Input */}
        <div className="mb-4 relative">
          <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Account Number"
            className="w-full pl-10 pr-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
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
            className="w-full pl-4 pr-10 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Message */}
        {message && (
          <div className="text-sm text-red-400 mb-4 text-center">{message}</div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 rounded text-white font-semibold transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
