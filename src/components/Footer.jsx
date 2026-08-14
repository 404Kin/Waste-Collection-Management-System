// function Footer() {
//   return (
//     <footer>
//       <p>© 2026 Smart Waste System | Clean Environment Initiative</p>
//     </footer>
//   );
// }

// export default Footer;

import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaRecycle, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope,
  FaYoutube,
  FaClock,
  FaArrowRight,
  FaLeaf,
  FaShieldAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top Section with Newsletter */}
          <div className="grid lg:grid-cols-2 gap-8 pb-12 border-b border-gray-800 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <FaRecycle className="text-white text-2xl" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  EcoWaste
                </span>
              </div>
              <p className="text-gray-400 text-lg mb-4 max-w-md">
                Transforming waste management through innovative technology and sustainable practices for a cleaner, greener tomorrow.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <FaLeaf className="text-green-500" />
                  <span className="text-sm text-gray-400">100% Eco-Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-500" />
                  <span className="text-sm text-gray-400">Secure & Reliable</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Subscribe to Newsletter</h3>
              <p className="text-gray-400 mb-4">Get latest updates about waste management and eco-friendly tips.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  Subscribe
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              {subscribed && (
                <div className="mt-3 text-green-500 text-sm animate-pulse">
                  ✓ Successfully subscribed!
                </div>
              )}
            </div>
          </div>

          {/* Footer Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Quick Links
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-500 mt-2"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Our Services
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-500 mt-2"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2">
                    <FaRecycle className="text-xs" />
                    Waste Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2">
                    <FaRecycle className="text-xs" />
                    Recycling Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2">
                    <FaRecycle className="text-xs" />
                    Composting
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2">
                    <FaRecycle className="text-xs" />
                    E-Waste Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-all duration-300 flex items-center gap-2">
                    <FaRecycle className="text-xs" />
                    Bulk Waste Pickup
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Support
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-500 mt-2"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-green-500 transition-all duration-300">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-green-500 transition-all duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-green-500 transition-all duration-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-400 hover:text-green-500 transition-all duration-300">
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="text-gray-400 hover:text-green-500 transition-all duration-300">
                    Give Feedback
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Contact Info
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-500 mt-2"></div>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <FaMapMarkerAlt className="text-green-500 mt-1 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400">123 Green Street, Eco City, EC 12345</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <FaPhoneAlt className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400">+1 234 567 8900</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <FaEnvelope className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400">info@ecowaste.com</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <FaClock className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400">Mon-Fri: 9AM - 6PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <div className="flex gap-4 mb-4 md:mb-0">
              <a 
                href="#" 
                className="bg-gray-800 p-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110 group"
                aria-label="Facebook"
              >
                <FaFacebook className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110 group"
                aria-label="Twitter"
              >
                <FaTwitter className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110 group"
                aria-label="Instagram"
              >
                <FaInstagram className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110 group"
                aria-label="YouTube"
              >
                <FaYoutube className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                © 2024 EcoWaste. All rights reserved. | Made with <span className="text-red-500">❤️</span> for a greener planet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="flex gap-4 mb-2 md:mb-0">
              <Link to="/privacy" className="hover:text-green-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-green-500 transition-colors">Terms of Use</Link>
              <Link to="/cookies" className="hover:text-green-500 transition-colors">Cookie Policy</Link>
            </div>
            <div>
              <span>🌱 This website is carbon-neutral</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;