import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRecycle, FaBars, FaTimes, FaHome, FaChartLine, FaEnvelope, FaTruck, FaMapMarkerAlt, FaUser, FaUserPlus, FaMoneyBillWave, FaSignOutAlt, FaUserShield, FaLocationArrow } from "react-icons/fa";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { currentUser, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const adminEmails = ['hossiniajabara@gmail.com'];
      setIsAdmin(adminEmails.includes(currentUser.email));
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      alert("✅ Logged out successfully!");
      window.location.href = "/";
    } else {
      alert("❌ Logout failed: " + result.error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50" style={{ 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2 group" style={{ textDecoration: 'none' }}>
              <div className="p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300" style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
              }}>
                <FaRecycle className="text-white text-xl animate-spin" />
              </div>
              <div>
                <span className="text-xl font-bold" style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Recyva
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-2" style={{
                hover: {
                  color: '#059669',
                  backgroundColor: 'rgba(5, 150, 105, 0.08)'
                }
              }}>
                <span>Home</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-2">
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link to="/pickup" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-2">
                    <FaTruck className="text-sm" />
                    <span>Schedule</span>
                  </Link>
                  <Link to="/tracking" className="px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center gap-2">
      <FaLocationArrow className="text-sm" />
      <span>Tracking</span>
    </Link>
                </>
              )}
              
              <Link to="/recycling-centers" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-2">
                <span>Recycling</span>
              </Link>
              
              <Link to="/earn-money" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-2">
                <span>Earn Money</span>
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-2">
                <span>Contact</span>
              </Link>
             
              {isAuthenticated && isAdmin && (
                <Link to="/admin" className="px-3 py-2 rounded-lg text-purple-600 transition-all duration-300 flex items-center gap-2 font-semibold">
                  <FaUserShield className="text-sm" />
                  <span>Admin</span>
                </Link>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-gray-600" style={{
                    fontWeight: '500',
                    padding: '6px 12px',
                    backgroundColor: 'rgba(5, 150, 105, 0.08)',
                    borderRadius: '8px',
                    border: '1px solid rgba(5, 150, 105, 0.1)'
                  }}>
                    {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                      hover: {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
                      }
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 text-green-600 rounded-lg transition-all duration-300 flex items-center gap-2"
                    style={{
                      hover: {
                        backgroundColor: 'rgba(5, 150, 105, 0.08)'
                      }
                    }}
                  >
                    <FaUser className="text-sm" />
                    Login
                  </button>
                  <button 
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 py-2 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                      hover: {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(5, 150, 105, 0.4)'
                      }
                    }}
                  >
                    <FaUserPlus className="text-sm" />
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-2">
                <Link to="/" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <FaHome /> Home
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                      <FaChartLine /> Dashboard
                    </Link>
                    
                    <Link to="/pickup" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                      <FaTruck /> Schedule Pickup
                    </Link>
                     <Link to="/tracking" className="px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
      <FaLocationArrow /> Tracking
    </Link>
                  </>
                )}
                
                <Link to="/recycling-centers" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <FaMapMarkerAlt /> Recycling Centers
                </Link>
                

                <Link to="/earn-money" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <FaMoneyBillWave /> Earn Money
                </Link>
                <Link to="/contact" className="px-3 py-2 rounded-lg text-gray-700 transition-all duration-300 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <FaEnvelope /> Contact
                </Link>
                
                {isAuthenticated && isAdmin && (
                  <Link to="/admin" className="px-3 py-2 rounded-lg text-purple-600 transition-all duration-300 flex items-center gap-3 font-semibold" onClick={() => setIsMenuOpen(false)}>
                    <FaUserShield /> Admin Panel
                  </Link>
                )}
                
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-gray-600" style={{
                      fontWeight: '500',
                      backgroundColor: 'rgba(5, 150, 105, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(5, 150, 105, 0.1)'
                    }}>
                      {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                    </div>
                    <button onClick={handleLogout} className="px-3 py-2 text-white rounded-lg text-left" style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="pt-2 space-y-2 border-t border-gray-100">
                    <button onClick={() => {
                      setShowLoginModal(true);
                      setIsMenuOpen(false);
                    }} className="w-full px-3 py-2 text-green-600 rounded-lg text-left transition-all duration-300" style={{
                      hover: {
                        backgroundColor: 'rgba(5, 150, 105, 0.08)'
                      }
                    }}>
                      Login
                    </button>
                    <button onClick={() => {
                      setShowRegisterModal(true);
                      setIsMenuOpen(false);
                    }} className="w-full px-3 py-2 text-white rounded-lg" style={{
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                    }}>
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      /> 
    </>
  );
}

export default Navbar;