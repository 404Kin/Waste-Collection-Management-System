import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaUserCircle, 
  FaRecycle, 
  FaTruck, 
  FaLeaf, 
  FaCalendarAlt,
  FaChartLine,
  FaAward,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaMapMarkerAlt,
  FaTrash,
  FaPlusCircle,
  FaMoneyBillWave
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { getPickupsFromMongoDB } from "../firebase/firebase.config";

function Dashboard() {
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("");
  const [pickupStats, setPickupStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0
  });
  const [recentPickups, setRecentPickups] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    } else {
      
      loadFromLocalStorage();
    }
  }, [currentUser]);

  const loadFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "John Doe");
        setUserEmail(user.email || "");
      } catch(e) {}
    }
    setLoading(false);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      
      setUserName(currentUser.displayName || currentUser.email?.split('@')[0] || "User");
      setUserEmail(currentUser.email || "");

      
      const result = await getPickupsFromMongoDB(currentUser.uid);
      
      if (result && result.success) {
        const pickups = result.pickups || [];
        
        
        const stats = {
          total: pickups.length,
          completed: pickups.filter(p => p.status === 'completed').length,
          pending: pickups.filter(p => p.status === 'pending').length,
          cancelled: pickups.filter(p => p.status === 'cancelled').length
        };
        
        setPickupStats(stats);
        
        
        setRecentPickups(pickups.slice(0, 5));
        
        
        let points = 0;
        let earnings = 0;
        let carbon = 0;
        
        pickups.forEach(pickup => {
          if (pickup.status === 'completed') {
            
            const weight = pickup.weight || 0;
            points += weight * 10;
            
            
            earnings += weight * 5;
            
            
            carbon += weight * 0.5;
          }
        });
        
        setTotalPoints(Math.round(points));
        setTotalEarnings(Math.round(earnings));
        setCarbonSaved(Math.round(carbon));
        
      } else {
        console.error('Failed to load pickups:', result?.error);
        
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "cancelled": return "text-red-600 bg-red-100";
      case "assigned": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "completed": return <FaCheckCircle />;
      case "pending": return <FaSpinner className="animate-spin" />;
      case "assigned": return <FaClock className="animate-pulse" />;
      default: return <FaClock />;
    }
  };

  const getWasteTypeLabel = (type) => {
    switch(type) {
      case "recyclable": return " Recyclable";
      case "organic": return " MysOrganic";
      case "general": return " General";
      default: return type || "General";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="text-center">
            <FaSpinner className="animate-spin text-5xl text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Welcome Header with Image */}
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl overflow-hidden mb-8 shadow-xl">
            
            <div className="relative p-6 md:p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaUserCircle className="text-4xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Welcome back, {userName}! 
                  </h1>
                  <p className="text-green-100 mt-1">
                    {userEmail && ` ${userEmail}`}
                  </p>
                  
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <p className="text-sm opacity-90">Total Pickups</p>
                  <p className="text-2xl font-bold">{pickupStats.total}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <p className="text-sm opacity-90">Completed</p>
                  <p className="text-2xl font-bold text-green-300">{pickupStats.completed}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <p className="text-sm opacity-90">Pending</p>
                  <p className="text-2xl font-bold text-yellow-300">{pickupStats.pending}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <p className="text-sm opacity-90">Points Earned</p>
                  <p className="text-2xl font-bold text-yellow-300">{totalPoints}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <p className="text-sm opacity-90">Money Earned</p>
                  <p className="text-2xl font-bold text-green-300">{totalEarnings} Tk</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaLeaf className="text-green-600 text-2xl" />
                </div>
                <span className="text-3xl font-bold text-green-600">{carbonSaved}kg</span>
              </div>
              <h3 className="text-gray-700 font-semibold mb-1">Carbon Saved</h3>
              <p className="text-sm text-gray-500">You've helped save the environment!</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FaAward className="text-yellow-600 text-2xl" />
                </div>
                <span className="text-3xl font-bold text-yellow-600">{totalPoints}</span>
              </div>
              <h3 className="text-gray-700 font-semibold mb-1">Eco Points</h3>
              <p className="text-sm text-gray-500">Redeem for exciting rewards!</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaMoneyBillWave className="text-purple-600 text-2xl" />
                </div>
                <span className="text-3xl font-bold text-purple-600">{totalEarnings} Tk</span>
              </div>
              <h3 className="text-gray-700 font-semibold mb-1">Total Earnings</h3>
              <p className="text-sm text-gray-500">From recycling waste</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaChartLine className="text-blue-600 text-2xl" />
                </div>
                <span className="text-3xl font-bold text-blue-600">
                  {pickupStats.total > 0 ? Math.round((pickupStats.completed / pickupStats.total) * 100) : 0}%
                </span>
              </div>
              <h3 className="text-gray-700 font-semibold mb-1">Completion Rate</h3>
              <p className="text-sm text-gray-500">Based on your pickups</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Recent Pickups */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaTruck className="text-green-600" />
                  Recent Pickup Requests
                </h2>
                <Link to="/pickup" className="text-green-600 hover:text-green-700 text-sm font-semibold">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentPickups.length === 0 ? (
                  <div className="text-center py-8">
                    <FaTruck className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No pickup requests yet</p>
                    <Link to="/pickup" className="text-green-600 hover:text-green-700 text-sm font-semibold">
                      Schedule your first pickup →
                    </Link>
                  </div>
                ) : (
                  recentPickups.map((pickup) => (
                    <div key={pickup._id || pickup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(pickup.status)}`}>
                          {getStatusIcon(pickup.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{getWasteTypeLabel(pickup.wasteType)}</p>
                          <p className="text-sm text-gray-500">{pickup.date}</p>
                          {pickup.address && (
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">{pickup.address}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {pickup.weight > 0 && (
                          <>
                            <p className="text-sm text-green-600 font-semibold">{pickup.weight} kg</p>
                            <p className="text-xs text-purple-600 font-semibold">+{Math.round(pickup.weight * 5)} Tk</p>
                          </>
                        )}
                        <p className={`text-xs font-semibold ${getStatusColor(pickup.status)}`}>
                          {pickup.status || 'pending'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaPlusCircle className="text-green-600" />
                Quick Actions
              </h2>
              
              <div className="grid gap-4">
                <Link 
                  to="/pickup"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-2xl" />
                    <div>
                      <p className="font-semibold">Schedule New Pickup</p>
                      <p className="text-sm opacity-90">Book a waste collection</p>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition">→</span>
                </Link>

                <Link 
                  to="/earn-money"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-2xl" />
                    <div>
                      <p className="font-semibold">Earn Money</p>
                      <p className="text-sm opacity-90">Check your earnings & withdraw</p>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition">→</span>
                </Link>

                <Link 
                  to="/recycling-centers"
                  className="border-2 border-green-200 rounded-xl p-4 hover:border-green-400 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaMapMarkerAlt className="text-green-600 text-xl" />
                    <h3 className="font-semibold text-gray-800">Find Recycling Centers</h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-9">Locate nearest recycling points in your area</p>
                </Link>

                <div className="border-2 border-green-200 rounded-xl p-4 hover:border-green-400 transition cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <FaAward className="text-yellow-600 text-xl" />
                    <h3 className="font-semibold text-gray-800">Redeem Points</h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-9">Exchange your eco points for rewards</p>
                </div>
              </div>
            </div>

            {/* Recycling Tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <FaRecycle className="text-green-600 text-2xl" />
                <h2 className="text-xl font-bold text-gray-800">Eco Tips of the Day</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-700">Rinse recyclables before throwing</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-700">Separate plastic, glass, and paper</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-700">Compost your organic waste</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;