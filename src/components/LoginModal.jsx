import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      alert("✅ Login successful!");
      onClose();
      window.location.href = "/dashboard";
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
        <p className="text-gray-500">Sign in to continue your journey</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MdEmail className="text-lg" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaLock className="text-lg" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600"
            >
              {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button type="button" className="text-sm text-emerald-600 hover:underline">
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 mt-4 disabled:opacity-50"
        >
          {loading ? "⏳ Logging in..." : "Sign In"}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button type="button" className="flex items-center justify-center py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50">
            <FaGoogle className="text-red-500 text-lg" />
          </button>
          <button type="button" className="flex items-center justify-center py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50">
            <FaFacebook className="text-blue-600 text-lg" />
          </button>
          <button type="button" className="flex items-center justify-center py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50">
            <FaApple className="text-gray-800 text-lg" />
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center pt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button type="button" onClick={onSwitchToRegister} className="font-bold text-emerald-600 hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;