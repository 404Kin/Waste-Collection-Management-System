import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTrash, FaLeaf, FaRecycle, FaCalendarAlt, FaClock, FaCheckCircle, FaTruck } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { savePickupToMongoDB, getPickupsFromMongoDB } from "../firebase/firebase.config";

function Pickup() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    address: "",
    wasteType: "general",
    date: "",
    time: "morning",
    instructions: "",
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

  // Load pickups from MongoDB when user logs in
  useEffect(() => {
    if (currentUser) {
      loadPickups();
    }
  }, [currentUser]);

  const loadPickups = async () => {
    if (!currentUser) return;
    try {
      const result = await getPickupsFromMongoDB(currentUser.uid);
      console.log('📥 Load pickups result:', result);
      
      if (result && result.success) {
        setRequests(result.pickups || []);
      } else {
        console.error('❌ Failed to load pickups:', result?.error);
      }
    } catch (error) {
      console.error('❌ Load pickups error:', error);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.address || !form.date) {
    alert("Please fill in all required fields!");
    return;
  }

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  setLoading(true);

  try {
    const pickupData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,     
      userName: currentUser.displayName || currentUser.email?.split('@')[0] || "Unknown",
      address: form.address,
      wasteType: form.wasteType,
      weight: form.weight || 0,
      date: form.date,
      time: form.time,
      instructions: form.instructions
    };

    console.log('📤 SUBMITTING PICKUP:', pickupData);

    const result = await savePickupToMongoDB(pickupData);
    
    console.log('📥 SUBMIT RESULT:', result);

    if (result && result.success) {
      alert("✅ Pickup request submitted successfully!");
      setRequests([result.pickup, ...requests]);
      setForm({
        address: "",
        wasteType: "general",
        date: "",
        time: "morning",
        instructions: "",
        weight: "",
      });
    } else {
      alert("❌ Failed: " + (result?.error || result?.message || "Unknown error"));
    }
  } catch (error) {
    console.error('❌ Submit error:', error);
    alert("❌ Error: " + error.message);
  }

  setLoading(false);
};

  const getWasteIcon = (type) => {
    switch(type) {
      case "recyclable": return <FaRecycle className="text-green-600" />;
      case "organic": return <FaLeaf className="text-green-600" />;
      default: return <FaTrash className="text-gray-600" />;
    }
  };

  const getWasteColor = (type) => {
    switch(type) {
      case "recyclable": return "bg-green-100 text-green-700";
      case "organic": return "bg-emerald-100 text-emerald-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700";
      case "assigned": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <FaTruck className="animate-bounce" />
              <span className="text-sm font-semibold">Schedule Pickup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Request Waste{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Schedule your waste pickup in just a few clicks. Fast, reliable, and eco-friendly service.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-green-600" />
                New Pickup Request
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                    Pickup Address *
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  />
                </div>

                {/* Waste Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Waste Type *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({...form, wasteType: "general"})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        form.wasteType === "general"
                          ? "border-gray-600 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <FaTrash className="text-2xl mx-auto mb-1 text-gray-600" />
                      <span className="text-sm font-medium">General</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({...form, wasteType: "recyclable"})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        form.wasteType === "recyclable"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <FaRecycle className="text-2xl mx-auto mb-1 text-green-600" />
                      <span className="text-sm font-medium">Recyclable</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({...form, wasteType: "organic"})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        form.wasteType === "organic"
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <FaLeaf className="text-2xl mx-auto mb-1 text-emerald-600" />
                      <span className="text-sm font-medium">Organic</span>
                    </button>
                  </div>
                </div>
                {/* Weight */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Weight (kg) *
  </label>
  <input
    type="number"
    name="weight"
    value={form.weight || ''}
    onChange={handleChange}
    placeholder="Enter waste weight in kg"
    min="0.1"
    step="0.1"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
    required
  />
</div>
                
                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaClock className="inline mr-2 text-green-600" />
                      Preferred Time
                    </label>
                    <select
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    >
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 4PM)</option>
                      <option value="evening">Evening (4PM - 8PM)</option>
                    </select>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="instructions"
                    value={form.instructions}
                    onChange={handleChange}
                    placeholder="E.g., Gate code, specific location, etc."
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !currentUser}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Submit Pickup Request
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Requests Section */}
            <div>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">My Pickup Requests</h3>
                <p className="text-green-100">
                  You have {requests.length} active request{requests.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {requests.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center">
                    <FaTruck className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No requests yet</p>
                    <p className="text-gray-400">Submit your first pickup request above</p>
                  </div>
                ) : (
                  requests.map((req) => (
                    <div
                      key={req._id || req.id}
                      className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getWasteColor(req.wasteType)}`}>
                          {getWasteIcon(req.wasteType)}
                          <span className="ml-1 capitalize">{req.wasteType}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">
                        <span className="font-semibold">📍 Address:</span> {req.address}
                      </p>
                      
                      <div className="flex gap-4 mb-2 text-sm">
                        <p>
                          <span className="font-semibold">📅 Date:</span> {req.date}
                        </p>
                        <p>
                          <span className="font-semibold">⏰ Time:</span> {req.time}
                        </p>
                      </div>
                      
                      {req.instructions && (
                        <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded mt-2">
                          <span className="font-semibold">📝 Note:</span> {req.instructions}
                        </p>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`px-2 py-1 rounded-full ${getStatusBadge(req.status || 'pending')}`}>
                            Status: {req.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Pickup;