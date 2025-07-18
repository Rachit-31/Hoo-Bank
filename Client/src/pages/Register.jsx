import { useState } from "react";
import { Eye, EyeOff, User, Mail, UserPlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "../ApiUri";
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/users/register`, {
        accountNumber,
        fullName,
        email,
        password,
      }, { withCredentials: true });

      toast.success(res.data.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="bg-zinc-900 p-10 rounded-xl shadow-md max-w-md w-full border border-zinc-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-500">Hoo Bank</h2>
          <p className="text-sm text-gray-400 mt-1">Create a Secure Account</p>
        </div>

        {/* Account Number */}
        <div className="mb-4 relative">
          <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Account Number"
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        {/* Full Name */}
        <div className="mb-4 relative">
          <UserPlus className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
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

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
        >
          Register
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
