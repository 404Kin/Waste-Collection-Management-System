import { useState } from "react";
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, 
  FaPaperPlane, FaUser, FaCheckCircle, FaSpinner,
  FaTimes, FaArrowRight
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Contact = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser?.uid || ''
        }),
      });

      const data = await response.json();
      
      if (data && data.success) {
        setSuccess(true);
        setShowModal(true);
        setFormData({
          name: currentUser?.displayName || '',
          email: currentUser?.email || '',
          phone: '',
          subject: '',
          message: ''
        });
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
        }, 4000);
      } else {
        setError(data?.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <FaEnvelope className="text-lg" />
              <span className="text-sm font-semibold">Get In Touch</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Connect</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Side - Info Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaMapMarkerAlt className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Address</p>
                      <p className="text-gray-500">123 Green Street, Dhaka</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaPhone className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Phone</p>
                      <p className="text-gray-500">+880 1234 567890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaEnvelope className="text-purple-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <p className="text-gray-500">info@wastecollect.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FaClock className="text-yellow-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Working Hours</p>
                      <p className="text-gray-500">Mon - Fri: 9AM - 6PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition">
                <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="text-3xl text-green-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">📍 Find us on Google Maps</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Send a Message</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <FaUser className="inline mr-2 text-green-600" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <FaEnvelope className="inline mr-2 text-green-600" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <FaPhone className="inline mr-2 text-green-600" />
                    Phone <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Message subject"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Write your message..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-lg" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
              <p className="text-gray-500 mt-1">We'll get back to you soon.</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 px-8 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Contact;