import { useState } from "react";
import { MdEmail, MdPerson, MdPhone } from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    if (!formData.email) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    if (!formData.phone) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.phone, formData.password);
    
    if (result.success) {
      alert("✅ Registration successful! Please login.");
      onClose();
      onSwitchToLogin();
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Join EcoWaste</h2>
        <p className="text-gray-500">Create your account and start recycling</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MdPerson className="text-lg" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

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

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MdPhone className="text-lg" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all"
              placeholder="+880 1XXX XXXXXX"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaLock className="text-lg" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600"
            >
              {showConfirmPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <input type="checkbox" id="terms" className="w-5 h-5 mt-0.5 text-emerald-600 rounded" required />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the <button type="button" className="text-emerald-600 font-semibold">Terms of Service</button>
          </label>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 mt-4 disabled:opacity-50"
        >
          {loading ? "⏳ Creating Account..." : "Create Account"}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
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

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button type="button" onClick={onSwitchToLogin} className="font-bold text-emerald-600 hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;