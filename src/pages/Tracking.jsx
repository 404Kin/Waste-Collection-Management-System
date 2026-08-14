import { useState, useEffect } from "react";
import { 
  FaLocationArrow, FaTruck, FaSpinner, FaMapMarkerAlt, 
  FaUser, FaPhone, FaClock, FaCheckCircle, FaRoute 
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Tracking = () => {
  const { currentUser } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api';

  // ইউজারের পিকআপ লোড করুন
  useEffect(() => {
    if (currentUser) {
      loadUserPickups();
    }
  }, [currentUser]);

  // প্রতি 30 সেকেন্ড পর পর রিফ্রেশ করুন
  useEffect(() => {
    if (selectedPickup) {
      const interval = setInterval(() => {
        loadTracking(selectedPickup);
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [selectedPickup]);

  const loadUserPickups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pickups?userId=${currentUser.uid}`);
      const data = await response.json();
      
      if (data && data.success) {
        setPickups(data.pickups || []);
      } else {
        setError('No pickups found');
      }
    } catch (error) {
      console.error('Error loading pickups:', error);
      setError('Failed to load pickups');
    } finally {
      setLoading(false);
    }
  };

  const loadTracking = async (pickupId) => {
    try {
      setTrackingLoading(true);
      setSelectedPickup(pickupId);
      
      const response = await fetch(`${API_URL}/tracking/${pickupId}`);
      const data = await response.json();
      
      if (data && data.success) {
        setTracking(data.tracking);
        setError('');
      } else {
        setTracking(null);
        setError('No tracking data available');
      }
    } catch (error) {
      console.error('Error loading tracking:', error);
      setTracking(null);
      setError('Failed to load tracking data');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'en_route': 'Driver En Route 🚚',
      'arrived': 'Driver Arrived 📍',
      'collecting': 'Collecting Waste ♻️',
      'completed': 'Completed ✅'
    };
    return statusMap[status] || status || 'Unknown';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'en_route': 'bg-blue-100 text-blue-700 animate-pulse',
      'arrived': 'bg-green-100 text-green-700',
      'collecting': 'bg-purple-100 text-purple-700',
      'completed': 'bg-gray-100 text-gray-700'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'en_route': return <FaTruck className="text-blue-500 animate-pulse" />;
      case 'arrived': return <FaMapMarkerAlt className="text-green-500" />;
      case 'collecting': return <FaRoute className="text-purple-500" />;
      case 'completed': return <FaCheckCircle className="text-green-600" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  // লোকেশন আপডেট করার ফাংশন (ড্রাইভারের জন্য)
  const updateDriverLocation = async (pickupId, lat, lng) => {
    try {
      const response = await fetch(`${API_URL}/tracking/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickupId,
          driverId: currentUser.uid,
          driverName: currentUser.displayName || 'Driver',
          lat,
          lng,
          status: 'en_route'
        }),
      });
      
      const data = await response.json();
      if (data && data.success) {
        console.log('📍 Location updated:', lat, lng);
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading your pickups...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <FaLocationArrow className="text-lg" />
              <span className="text-sm font-semibold">Live Tracking</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">📍 Track Your Pickup</h1>
            <p className="text-gray-500 mt-1">Select a pickup to see real-time status</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Pickup List */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaTruck className="text-blue-600" />
                  Your Pickups
                </h3>
                
                {pickups.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <FaTruck className="text-3xl mx-auto mb-2" />
                    <p>No pickup requests found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pickups.map((pickup) => (
                      <button
                        key={pickup._id}
                        onClick={() => loadTracking(pickup._id)}
                        className={`w-full text-left p-3 rounded-xl transition ${
                          selectedPickup === pickup._id 
                            ? 'bg-blue-50 border-2 border-blue-500' 
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {pickup.address?.split(',')[0] || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">📅 {pickup.date}</p>
                            <p className="text-xs text-gray-400">📦 {pickup.wasteType}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            pickup.status === 'completed' 
                              ? 'bg-green-100 text-green-700'
                              : pickup.status === 'assigned'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {pickup.status || 'pending'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Details */}
            <div className="md:col-span-2">
              {trackingLoading ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
                  <div className="text-center">
                    <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-500">Loading tracking data...</p>
                  </div>
                </div>
              ) : tracking ? (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Status Bar */}
                  <div className={`p-6 ${getStatusColor(tracking.status)} bg-opacity-20`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getStatusIcon(tracking.status)}
                        </div>
                        <div>
                          <p className="text-sm opacity-80">Current Status</p>
                          <p className="text-xl font-semibold">
                            {getStatusText(tracking.status)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-80">Last Updated</p>
                        <p className="text-sm font-medium">
                          {tracking.updatedAt 
                            ? new Date(tracking.updatedAt).toLocaleTimeString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    {/* Driver Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm text-gray-500">
                          <FaUser className="inline mr-1" /> Driver
                        </p>
                        <p className="font-semibold text-gray-800">
                          {tracking.driverName || 'Not Assigned'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm text-gray-500">
                          <FaPhone className="inline mr-1" /> Contact
                        </p>
                        <p className="font-semibold text-gray-800">
                          {tracking.driverPhone || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="font-semibold text-blue-600">
                        <FaMapMarkerAlt className="inline mr-1" /> Current Location
                      </p>
                      <p className="text-gray-700 mt-1">
                        {tracking.location?.address || 'Location not available'}
                      </p>
                      {tracking.location?.lat && tracking.location?.lng && (
                        <p className="text-xs text-gray-400 mt-1">
                          📍 {tracking.location.lat.toFixed(6)}, {tracking.location.lng.toFixed(6)}
                        </p>
                      )}
                    </div>

                    {/* Location History */}
                    {tracking.history && tracking.history.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Location History</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {tracking.history.slice(-5).reverse().map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span>
                                {item.location?.lat?.toFixed(6)}, {item.location?.lng?.toFixed(6)}
                              </span>
                              <span className="text-xs text-gray-400">
                                {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => loadTracking(selectedPickup)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition font-medium"
                      >
                        <FaLocationArrow className="inline mr-2" />
                        Refresh
                      </button>
                      <button
                        onClick={() => {
                          if (tracking.location?.lat && tracking.location?.lng) {
                            window.open(
                              `https://www.google.com/maps?q=${tracking.location.lat},${tracking.location.lng}`,
                              '_blank'
                            );
                          } else {
                            alert('No location data available');
                          }
                        }}
                        className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition font-medium"
                      >
                        <FaMapMarkerAlt className="inline mr-2" />
                        View Map
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <FaTruck className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">Select a Pickup</h3>
                  <p className="text-gray-400 mt-2">
                    Choose a pickup from the list to track its real-time status
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Tracking;