import { useState, useEffect } from "react";
import { 
  FaUsers, FaTrash, FaCheckCircle, FaSpinner, 
  FaChartLine, FaTruck, FaCalendarAlt, FaSearch,
  FaFilter, FaEye, FaEdit, FaTrashAlt, FaDownload,
  FaUserCircle, FaClock, FaCheck, FaTimes,
  FaMoneyBillWave, FaSave, FaInfoCircle, FaPlus,
  FaLocationArrow
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { currentUser } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [prices, setPrices] = useState([]);
  const [trackings, setTrackings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("pickups");
  const [editingPrice, setEditingPrice] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [stats, setStats] = useState({
    totalPickups: 0,
    completed: 0,
    pending: 0,
    assigned: 0,
    totalUsers: 0,
    totalRecycled: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingTrackings, setLoadingTrackings] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignPickupId, setAssignPickupId] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");

  // Driver Management States
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [driverForm, setDriverForm] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    vehicleType: 'truck',
    status: 'available'
  });

  const API_URL = 'http://localhost:5000/api';

  // ============================================================
  // 1. USE EFFECT - LOAD ALL DATA
  // ============================================================
  useEffect(() => {
    if (currentUser) {
      loadAllPickups();
      loadDrivers();
      loadPrices();
      loadAllTrackings();
    }
  }, [currentUser]);

  // ============================================================
  // 2. PRICE MANAGEMENT FUNCTIONS
  // ============================================================
  const loadPrices = async () => {
    try {
      const response = await fetch(`${API_URL}/prices`);
      const data = await response.json();
      if (data && data.success) {
        setPrices(data.prices);
      } else {
        setPrices([
          { category: "plastic", type: "Plastic (PET/HDPE)", pricePerKg: 25, minKg: 1, maxKg: 100, emoji: "♻️", color: "from-blue-500 to-cyan-500", description: "Bottles, containers", isActive: true },
          { category: "paper", type: "Paper / Cardboard", pricePerKg: 12, minKg: 1, maxKg: 50, emoji: "📰", color: "from-yellow-500 to-orange-500", description: "Newspapers, boxes", isActive: true },
          { category: "glass", type: "Glass Bottles", pricePerKg: 8, minKg: 1, maxKg: 30, emoji: "🥤", color: "from-green-500 to-emerald-500", description: "Clear, green, brown glass", isActive: true },
          { category: "metal", type: "Aluminum / Metal", pricePerKg: 70, minKg: 1, maxKg: 20, emoji: "🔩", color: "from-gray-500 to-slate-500", description: "Cans, scrap metal", isActive: true },
          { category: "ewaste", type: "E-Waste", pricePerKg: 50, minKg: 0.5, maxKg: 10, emoji: "💻", color: "from-purple-500 to-pink-500", description: "Electronics, circuit boards", isActive: true }
        ]);
      }
    } catch (error) {
      console.error('Error loading prices:', error);
    }
  };

  const updatePrice = async (category, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/prices/${category}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      
      const data = await response.json();
      if (data && data.success) {
        alert('✅ Price updated successfully!');
        loadPrices();
        setEditingPrice(null);
        setEditForm({});
      } else {
        alert('❌ Failed to update price: ' + (data?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating price:', error);
      alert('❌ Error updating price');
    }
  };

  const startEditing = (price) => {
    setEditingPrice(price.category);
    setEditForm({
      pricePerKg: price.pricePerKg,
      minKg: price.minKg,
      maxKg: price.maxKg,
      description: price.description || '',
      isActive: price.isActive !== false
    });
  };

  const cancelEditing = () => {
    setEditingPrice(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSave = (category) => {
    updatePrice(category, editForm);
  };

  // ============================================================
  // 3. DRIVER MANAGEMENT FUNCTIONS
  // ============================================================
  const loadDrivers = async () => {
    try {
      setLoadingDrivers(true);
      const response = await fetch(`${API_URL}/drivers`);
      const data = await response.json();
      
      if (data && data.success) {
        setDrivers(data.drivers);
      } else {
        setDrivers([]);
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
      setDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const addDriver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverForm),
      });
      
      const data = await response.json();
      if (data && data.success) {
        alert('✅ Driver added successfully!');
        setShowAddDriverModal(false);
        setDriverForm({ name: '', email: '', phone: '', vehicleNumber: '', vehicleType: 'truck', status: 'available' });
        loadDrivers();
      } else {
        alert('❌ Failed to add driver: ' + (data?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      alert('❌ Error adding driver');
    }
  };

  const updateDriver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/drivers/${editingDriver._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverForm),
      });
      
      const data = await response.json();
      if (data && data.success) {
        alert('✅ Driver updated successfully!');
        setShowEditDriverModal(false);
        setEditingDriver(null);
        setDriverForm({ name: '', email: '', phone: '', vehicleNumber: '', vehicleType: 'truck', status: 'available' });
        loadDrivers();
      } else {
        alert('❌ Failed to update driver');
      }
    } catch (error) {
      console.error('Error updating driver:', error);
      alert('❌ Error updating driver');
    }
  };

  const deleteDriver = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete driver "${name}"?`)) return;
    
    try {
      const response = await fetch(`${API_URL}/drivers/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data && data.success) {
        alert('✅ Driver deleted successfully!');
        loadDrivers();
      } else {
        alert('❌ Failed to delete driver');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('❌ Error deleting driver');
    }
  };

  // ============================================================
  // 4. TRACKING FUNCTIONS
  // ============================================================
  const loadAllTrackings = async () => {
    try {
      setLoadingTrackings(true);
      const response = await fetch(`${API_URL}/tracking/admin/all`);
      const data = await response.json();
      
      if (data && data.success) {
        setTrackings(data.trackings || []);
      } else {
        setTrackings([]);
      }
    } catch (error) {
      console.error('Error loading trackings:', error);
      setTrackings([]);
    } finally {
      setLoadingTrackings(false);
    }
  };

  // ============================================================
  // 5. PICKUP MANAGEMENT FUNCTIONS
  // ============================================================
  const loadAllPickups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pickups/all`);
      const data = await response.json();
      
      if (data && data.success) {
        const allPickups = data.pickups || [];
        setPickups(allPickups);
        calculateStats(allPickups);
      } else {
        console.error('Failed to load pickups:', data?.error);
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading pickups:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const localPickups = JSON.parse(localStorage.getItem('pickups') || '[]');
      setPickups(localPickups);
      calculateStats(localPickups);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const calculateStats = (pickupsList) => {
    const completed = pickupsList.filter(p => p.status === 'completed').length;
    const pending = pickupsList.filter(p => p.status === 'pending').length;
    const assigned = pickupsList.filter(p => p.status === 'assigned').length;
    
    const uniqueUsers = new Set(pickupsList.map(p => p.userId));
    
    const totalRecycled = pickupsList
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.weight || 0), 0);
    
    const totalEarnings = pickupsList
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + ((p.weight || 0) * 5), 0);

    setStats({
      totalPickups: pickupsList.length,
      completed,
      pending,
      assigned,
      totalUsers: uniqueUsers.size,
      totalRecycled: Math.round(totalRecycled),
      totalEarnings: Math.round(totalEarnings)
    });
  };

  const updatePickupStatus = async (id, newStatus, driver = null, driverName = null) => {
    try {
      const updateData = { status: newStatus };
      
      if (driver) updateData.driverId = driver;
      if (driverName) updateData.driverName = driverName;
      
      const response = await fetch(`${API_URL}/pickups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      if (data && data.success) {
        setPickups(prev => prev.map(pickup => 
          pickup._id === id ? { ...pickup, status: newStatus, driverId: driver || pickup.driverId, driverName: driverName || pickup.driverName } : pickup
        ));
        loadAllPickups();
        alert(`✅ Pickup status updated to ${newStatus}`);
      } else {
        alert('❌ Failed to update status: ' + (data?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating pickup:', error);
      alert('❌ Error updating status');
    }
  };

  const deletePickup = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pickup?')) return;
    
    try {
      const response = await fetch(`${API_URL}/pickups/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data && data.success) {
        setPickups(prev => prev.filter(p => p._id !== id));
        calculateStats(pickups.filter(p => p._id !== id));
        alert('✅ Pickup deleted successfully');
        loadAllPickups();
      } else {
        alert('❌ Failed to delete pickup');
      }
    } catch (error) {
      console.error('Error deleting pickup:', error);
      alert('❌ Error deleting pickup');
    }
  };

  const assignDriver = async () => {
    if (!selectedDriver) {
      alert('Please select a driver');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/pickups/${assignPickupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'assigned',
          driverId: selectedDriver,
          driverName: selectedDriver
        }),
      });

      const data = await response.json();
      
      if (data && data.success) {
        alert(`✅ Driver ${selectedDriver} assigned successfully!`);
        setShowAssignModal(false);
        setAssignPickupId(null);
        setSelectedDriver('');
        loadAllPickups();
        loadDrivers();
      } else {
        alert('❌ Failed to assign driver: ' + (data?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('❌ Error assigning driver');
    }
  };

  // ============================================================
  // 6. HELPER FUNCTIONS
  // ============================================================
  const getStatusBadge = (status) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "assigned": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "completed": return <FaCheckCircle className="text-green-600" />;
      case "pending": return <FaSpinner className="text-yellow-600 animate-spin" />;
      case "assigned": return <FaTruck className="text-blue-600" />;
      case "cancelled": return <FaTimes className="text-red-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  const getWasteTypeLabel = (type) => {
    switch(type) {
      case "recyclable": return "♻️ Recyclable";
      case "organic": return "🌿 Organic";
      case "general": return "🗑️ General";
      default: return type || "General";
    }
  };

  const filteredPickups = pickups.filter(pickup => {
    const matchesSearch = 
      (pickup.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pickup.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pickup.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || pickup.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportReport = () => {
    if (pickups.length === 0) {
      alert('No data to export!');
      return;
    }
    
    const reportData = pickups.map(p => ({
      'User': p.userName || 'Unknown',
      'Email': p.userEmail || 'N/A',
      'Address': p.address,
      'Waste Type': p.wasteType,
      'Weight (kg)': p.weight || 0,
      'Date': p.date,
      'Time': p.time,
      'Status': p.status,
      'Driver': p.driverName || p.driverId || 'Not Assigned'
    }));

    const csv = [
      Object.keys(reportData[0] || {}).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pickup-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ============================================================
  // 7. RENDER FUNCTIONS
  // ============================================================
  
  // 7.1 Tabs
  const renderTabs = () => {
    return (
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pickups')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition whitespace-nowrap ${
            activeTab === 'pickups' 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          📦 Pickups
        </button>
        <button
          onClick={() => setActiveTab('prices')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition whitespace-nowrap ${
            activeTab === 'prices' 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          💰 Prices
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition whitespace-nowrap ${
            activeTab === 'drivers' 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          🚚 Drivers
        </button>
        <button
          onClick={() => {
            setActiveTab('tracking');
            loadAllTrackings();
          }}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition whitespace-nowrap ${
            activeTab === 'tracking' 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          📍 Tracking
        </button>
      </div>
    );
  };

  // 7.2 Price Management UI
  const renderPriceManagement = () => {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600" />
              Price Management
            </h2>
            <p className="text-sm text-gray-500">Update recycling prices per kilogram</p>
          </div>
          <button 
            onClick={loadPrices}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1"
          >
            <FaCheckCircle className="text-xs" /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 rounded-xl">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight Range</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                    <FaMoneyBillWave className="text-3xl mx-auto mb-2 text-gray-300" />
                    No prices found.
                  </td>
                </tr>
              ) : (
                prices.map((price) => (
                  <tr key={price.category} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3">
                      <span className="text-2xl">{price.emoji || '♻️'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{price.type}</p>
                        <p className="text-xs text-gray-400">{price.description || ''}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingPrice === price.category ? (
                        <input
                          type="number"
                          name="pricePerKg"
                          value={editForm.pricePerKg || ''}
                          onChange={handleEditChange}
                          className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-center"
                          step="1"
                          min="0"
                        />
                      ) : (
                        <span className="font-bold text-green-600 text-lg">৳{price.pricePerKg}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingPrice === price.category ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            name="minKg"
                            value={editForm.minKg || ''}
                            onChange={handleEditChange}
                            className="w-14 px-1.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-center"
                            step="0.5"
                            min="0"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="number"
                            name="maxKg"
                            value={editForm.maxKg || ''}
                            onChange={handleEditChange}
                            className="w-14 px-1.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-center"
                            step="0.5"
                            min="0"
                          />
                          <span className="text-xs text-gray-400 ml-1">kg</span>
                        </div>
                      ) : (
                        <span className="text-gray-600">{price.minKg} - {price.maxKg} kg</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingPrice === price.category ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={editForm.isActive || false}
                            onChange={handleEditChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          <span className="ml-2 text-xs font-medium">
                            {editForm.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          price.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {price.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingPrice === price.category ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSave(price.category)}
                            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                          >
                            <FaSave className="text-sm" /> Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-400 hover:text-gray-600 font-medium text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(price)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                        >
                          <FaEdit className="text-sm" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaInfoCircle className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">💡 How it works</p>
              <p className="text-xs text-blue-600">
                Changes will reflect immediately on the <span className="font-semibold">Earn Money</span> page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 7.3 Driver Management UI
  const renderDriverManagement = () => {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaTruck className="text-blue-600" />
              Driver Management
            </h2>
            <p className="text-sm text-gray-500">Manage all drivers in the system</p>
          </div>
          <button
            onClick={() => setShowAddDriverModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
          >
            <FaPlus /> Add New Driver
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 rounded-xl">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                    <FaTruck className="text-3xl mx-auto mb-2 text-gray-300" />
                    No drivers found.
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{driver.driverId}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{driver.name}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{driver.email}</p>
                      <p className="text-xs text-gray-400">{driver.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {driver.vehicleNumber ? (
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {driver.vehicleNumber} ({driver.vehicleType})
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Not assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        driver.status === 'available' ? 'bg-green-100 text-green-700' :
                        driver.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {driver.status || 'available'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingDriver(driver);
                            setDriverForm({
                              name: driver.name,
                              email: driver.email,
                              phone: driver.phone,
                              vehicleNumber: driver.vehicleNumber || '',
                              vehicleType: driver.vehicleType || 'truck',
                              status: driver.status || 'available'
                            });
                            setShowEditDriverModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FaEdit className="text-sm" /> Edit
                        </button>
                        <button
                          onClick={() => deleteDriver(driver._id, driver.name)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FaTrashAlt className="text-sm" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 7.4 Tracking Management UI
  const renderTrackingManagement = () => {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaLocationArrow className="text-blue-600" />
              Live Tracking
            </h2>
            <p className="text-sm text-gray-500">Monitor all active pickups in real-time</p>
          </div>
          <button
            onClick={loadAllTrackings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <FaLocationArrow className="text-sm" />
            Refresh All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 rounded-xl">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingTrackings ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                    <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
                    Loading tracking data...
                  </td>
                </tr>
              ) : trackings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                    <FaTruck className="text-3xl mx-auto mb-2 text-gray-300" />
                    No active tracking data
                  </td>
                </tr>
              ) : (
                trackings.map((track) => (
                  <tr key={track._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {track.pickupId?.address?.split(',')[0] || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {track.pickupId?.wasteType || 'N/A'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{track.driverName || 'Unknown'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        track.status === 'en_route' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                        track.status === 'arrived' ? 'bg-green-100 text-green-700' :
                        track.status === 'collecting' ? 'bg-purple-100 text-purple-700' :
                        track.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {track.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {track.location?.lat && track.location?.lng ? (
                        <span>
                          {track.location.lat.toFixed(4)}, {track.location.lng.toFixed(4)}
                        </span>
                      ) : (
                        <span className="text-gray-400">No location</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {track.updatedAt ? new Date(track.updatedAt).toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          if (track.location?.lat && track.location?.lng) {
                            window.open(
                              `https://www.google.com/maps?q=${track.location.lat},${track.location.lng}`,
                              '_blank'
                            );
                          } else {
                            alert('No location data available');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                      >
                        <FaLocationArrow className="text-xs" /> View Map
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tracking Stats */}
        {trackings.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {trackings.filter(t => t.status === 'en_route' || t.status === 'arrived').length}
              </p>
              <p className="text-xs text-gray-500">Active Drivers</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {trackings.filter(t => t.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                {trackings.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {trackings.length}
              </p>
              <p className="text-xs text-gray-500">Total Trackings</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // 8. MAIN RETURN
  // ============================================================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <FaSpinner className="animate-spin text-5xl text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-purple-100">Manage pickups, prices, drivers & tracking</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <FaUserCircle className="text-4xl" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          {renderTabs()}

          {/* Content */}
          {activeTab === 'pickups' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <FaTrash className="text-blue-600 text-2xl" />
                    <span className="text-2xl font-bold text-blue-600">{stats.totalPickups}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Total Pickups</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <FaCheckCircle className="text-green-600 text-2xl" />
                    <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Completed</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <FaSpinner className="text-yellow-600 text-2xl animate-spin" />
                    <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pending</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <FaTruck className="text-purple-600 text-2xl" />
                    <span className="text-2xl font-bold text-purple-600">{stats.assigned}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Assigned</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <FaUsers className="text-indigo-600 text-2xl" />
                    <span className="text-2xl font-bold text-indigo-600">{stats.totalUsers}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Total Users</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <FaChartLine className="text-green-600 text-2xl" />
                    <span className="text-2xl font-bold text-green-600">{stats.totalRecycled}kg</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Recycled</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <FaChartLine className="text-purple-600 text-2xl" />
                    <span className="text-2xl font-bold text-purple-600">{stats.totalEarnings} Tk</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <FaCalendarAlt className="text-blue-600 text-2xl" />
                    <span className="text-2xl font-bold text-blue-600">
                      {pickups.length > 0 ? Math.round((stats.completed / stats.totalPickups) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by user, email or address..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <button 
                    onClick={exportReport}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition"
                  >
                    <FaDownload /> Export Report
                  </button>
                  <button 
                    onClick={() => {
                      loadAllPickups();
                      loadDrivers();
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition"
                  >
                    <FaCheckCircle /> Refresh
                  </button>
                </div>
              </div>

              {/* Pickups Table */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPickups.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                            <FaTruck className="text-4xl mx-auto mb-2 text-gray-300" />
                            No pickups found
                          </td>
                        </tr>
                      ) : (
                        filteredPickups.map((pickup, index) => (
                          <tr key={pickup._id || index} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm">#{index + 1}</td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{pickup.userName || 'Unknown'}</p>
                                <p className="text-xs text-gray-500">{pickup.userEmail || 'No Email'}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm max-w-[150px] truncate">{pickup.address}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                {getWasteTypeLabel(pickup.wasteType)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold">{pickup.weight || 0} kg</td>
                            <td className="px-6 py-4 text-sm">{pickup.date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${getStatusBadge(pickup.status)}`}>
                                {getStatusIcon(pickup.status)}
                                {pickup.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {pickup.driverName || pickup.driverId ? (
                                <span className="text-blue-600 font-medium">
                                  {pickup.driverName || pickup.driverId}
                                </span>
                              ) : pickup.status === 'pending' ? (
                                <button 
                                  onClick={() => {
                                    setAssignPickupId(pickup._id);
                                    setShowAssignModal(true);
                                  }}
                                  className="text-purple-600 hover:text-purple-800 text-xs font-semibold bg-purple-50 px-3 py-1 rounded-full hover:bg-purple-100 transition"
                                >
                                  Assign Driver →
                                </button>
                              ) : pickup.status === 'assigned' ? (
                                <span className="text-blue-600">Assigned</span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    setSelectedPickup(pickup);
                                    setShowDetailsModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                                {pickup.status === 'pending' && (
                                  <button 
                                    onClick={() => {
                                      setAssignPickupId(pickup._id);
                                      setShowAssignModal(true);
                                    }}
                                    className="text-purple-600 hover:text-purple-800"
                                    title="Assign Driver"
                                  >
                                    <FaTruck />
                                  </button>
                                )}
                                {pickup.status !== 'completed' && pickup.status !== 'cancelled' && (
                                  <button 
                                    onClick={() => {
                                      if (window.confirm('Mark this pickup as completed?')) {
                                        updatePickupStatus(pickup._id, 'completed');
                                      }
                                    }}
                                    className="text-green-600 hover:text-green-800"
                                    title="Mark as Completed"
                                  >
                                    <FaCheckCircle />
                                  </button>
                                )}
                                <button 
                                  onClick={() => deletePickup(pickup._id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'prices' && renderPriceManagement()}
          {activeTab === 'drivers' && renderDriverManagement()}
          {activeTab === 'tracking' && renderTrackingManagement()}

        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPickup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Pickup Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-semibold">{selectedPickup.userName || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{selectedPickup.userEmail || 'No Email'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(selectedPickup.status)}`}>
                    {selectedPickup.status || 'pending'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold">{selectedPickup.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Waste Type</p>
                  <p className="font-semibold">{getWasteTypeLabel(selectedPickup.wasteType)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-semibold">{selectedPickup.weight || 0} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-semibold">{selectedPickup.date} - {selectedPickup.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-semibold">{selectedPickup.driverName || selectedPickup.driverId || 'Not Assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-semibold">{selectedPickup.createdAt ? new Date(selectedPickup.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
              {selectedPickup.instructions && (
                <div>
                  <p className="text-sm text-gray-500">Instructions</p>
                  <p className="bg-gray-50 p-2 rounded">{selectedPickup.instructions}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Assign Driver</h2>
              <button 
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignPickupId(null);
                  setSelectedDriver('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Driver
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="">Choose a driver...</option>
                {drivers && drivers.length > 0 ? (
                  drivers.map((driver, index) => (
                    <option key={index} value={driver.name || driver}>
                      {driver.name || driver}
                    </option>
                  ))
                ) : (
                  <option value="">No drivers available</option>
                )}
              </select>
              {loadingDrivers && (
                <p className="text-sm text-gray-500 mt-2">
                  <FaSpinner className="animate-spin inline mr-1" />
                  Loading drivers...
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignPickupId(null);
                  setSelectedDriver('');
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={assignDriver}
                disabled={!selectedDriver}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddDriverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add New Driver</h2>
              <button 
                onClick={() => setShowAddDriverModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={addDriver}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={driverForm.name}
                    onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={driverForm.email}
                    onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm({...driverForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={driverForm.vehicleNumber}
                    onChange={(e) => setDriverForm({...driverForm, vehicleNumber: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={driverForm.vehicleType}
                    onChange={(e) => setDriverForm({...driverForm, vehicleType: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="pickup">Pickup</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={driverForm.status}
                    onChange={(e) => setDriverForm({...driverForm, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditDriverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Driver</h2>
              <button 
                onClick={() => setShowEditDriverModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={updateDriver}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={driverForm.name}
                    onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={driverForm.email}
                    onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm({...driverForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={driverForm.vehicleNumber}
                    onChange={(e) => setDriverForm({...driverForm, vehicleNumber: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={driverForm.vehicleType}
                    onChange={(e) => setDriverForm({...driverForm, vehicleType: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="pickup">Pickup</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={driverForm.status}
                    onChange={(e) => setDriverForm({...driverForm, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowEditDriverModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  Update Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Admin;