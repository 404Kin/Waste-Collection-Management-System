import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhone, FaClock, FaRecycle, FaStar, FaSearch } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getRecyclingCenters } from "../firebase/firebase.config";

function RecyclingCenters() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    const result = await getRecyclingCenters();
    if (result.success) {
      setCenters(result.centers || []);
    } else {
      console.error('❌ Failed to load centers:', result.error);
    }
    setLoading(false);
  };

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <FaRecycle className="animate-spin-slow" />
              <span className="text-sm font-semibold">Recycling Centers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Nearest{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Recycling Centers
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Locate recycling facilities near you and contribute to a greener planet
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Centers Grid */}
          {filteredCenters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recycling centers found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCenters.map((center) => (
                <div key={center._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FaRecycle className="text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">{center.name}</h3>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-600" />
                        {center.address}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaPhone className="text-green-600" />
                        {center.phone}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaClock className="text-green-600" />
                        {center.workingHours?.start} - {center.workingHours?.end}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {center.acceptedWaste?.map((type) => (
                        <span key={type} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition">
                      Get Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RecyclingCenters;