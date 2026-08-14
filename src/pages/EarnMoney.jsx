import { useState, useEffect } from "react";
import { 
  FaRecycle, FaMoneyBillWave, FaWallet, FaHistory, 
  FaRocket, FaTruck, FaCheckCircle, FaClock, FaArrowRight,
  FaMoneyCheckAlt, FaUserCircle, FaInfoCircle, FaGift,
  FaLeaf, FaChartLine, FaShieldAlt, FaHandHoldingHeart, FaSpinner,
  FaFire, FaCoins
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function EarnMoney() {
  const { currentUser } = useAuth();
  const [userBalance, setUserBalance] = useState(0);
  const [userName, setUserName] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bkash");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [priceList, setPriceList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingAmount: 0,
    totalRecycled: 0,
    completedCount: 0
  });

  const API_URL = 'http://localhost:5000/api';

  // লোড করুন সব ডেটা
  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
      setUserName(currentUser.displayName || currentUser.email?.split('@')[0] || "User");
      loadAllData();
    } else {
      setIsLoggedIn(false);
      setLoading(false);
      // পাবলিক ডেটা লোড করুন (প্রাইস লিস্ট)
      loadPriceList();
    }
  }, [currentUser]);

  // প্রাইস লিস্ট লোড করুন
  const loadPriceList = async () => {
    try {
      const response = await fetch(`${API_URL}/prices`);
      const data = await response.json();
      if (data && data.success) {
        setPriceList(data.prices);
      } else {
        // ব্যাকআপ ডেটা
        setPriceList([
          { category: "plastic", type: "Plastic (PET/HDPE)", pricePerKg: 25, minKg: 1, maxKg: 100, emoji: "♻️", color: "from-blue-500 to-cyan-500", description: "Bottles, containers, packaging", isActive: true },
          { category: "paper", type: "Paper / Cardboard", pricePerKg: 12, minKg: 1, maxKg: 50, emoji: "📰", color: "from-yellow-500 to-orange-500", description: "Newspapers, boxes, office paper", isActive: true },
          { category: "glass", type: "Glass Bottles", pricePerKg: 8, minKg: 1, maxKg: 30, emoji: "🥤", color: "from-green-500 to-emerald-500", description: "Clear, green, brown glass", isActive: true },
          { category: "metal", type: "Aluminum / Metal", pricePerKg: 70, minKg: 1, maxKg: 20, emoji: "🔩", color: "from-gray-500 to-slate-500", description: "Cans, scrap metal, copper", isActive: true },
          { category: "ewaste", type: "E-Waste", pricePerKg: 50, minKg: 0.5, maxKg: 10, emoji: "💻", color: "from-purple-500 to-pink-500", description: "Electronics, circuit boards, wires", isActive: true }
        ]);
      }
    } catch (error) {
      console.error('Error loading price list:', error);
      // ব্যাকআপ ডেটা ব্যবহার করুন
    }
  };

  // সব ডেটা লোড করুন (লগইন করলে)
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPriceList(),
        loadUserBalance(),
        loadUserTransactions(),
        loadUserStats()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ইউজারের ব্যালেন্স লোড করুন
  const loadUserBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${currentUser.uid}/balance`);
      const data = await response.json();
      if (data && data.success) {
        setUserBalance(data.balance || 0);
      } else {
        setUserBalance(0);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
      setUserBalance(0);
    }
  };

  // ইউজারের ট্রানজেকশন লোড করুন
  const loadUserTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${currentUser.uid}/transactions`);
      const data = await response.json();
      if (data && data.success) {
        setTransactions(data.transactions || []);
      } else {
        // ব্যাকআপ ডেটা
        setTransactions([
          { id: 1, type: "plastic", weight: 5, rate: 25, total: 125, status: "completed", date: "2024-01-20", proof: "QR-Code: PL-001" },
          { id: 2, type: "paper", weight: 3, rate: 12, total: 36, status: "completed", date: "2024-01-18", proof: "QR-Code: PP-002" },
          { id: 3, type: "metal", weight: 2, rate: 70, total: 140, status: "processing", date: "2024-01-22", proof: "Pending Verification" },
          { id: 4, type: "ewaste", weight: 1, rate: 50, total: 50, status: "completed", date: "2024-01-15", proof: "QR-Code: EW-004" }
        ]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  // ইউজারের স্ট্যাট লোড করুন
  const loadUserStats = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${currentUser.uid}/stats`);
      const data = await response.json();
      if (data && data.success) {
        setStats(data.stats);
      } else {
        calculateStats(transactions);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      calculateStats(transactions);
    }
  };

  // লোকালি স্ট্যাট ক্যালকুলেট করুন
  const calculateStats = (txns) => {
    const completed = txns.filter(t => t.status === "completed");
    const totalEarned = completed.reduce((sum, t) => sum + t.total, 0);
    const pendingAmount = txns.filter(t => t.status === "processing").reduce((sum, t) => sum + t.total, 0);
    const totalRecycled = txns.reduce((sum, t) => sum + t.weight, 0);
    
    setStats({
      totalEarned,
      pendingAmount,
      totalRecycled,
      completedCount: completed.length
    });
  };

  // উইথড্র করুন
  const handleWithdraw = async () => {
    if (!isLoggedIn) {
      alert("Please login first to withdraw money!");
      return;
    }
    if (withdrawAmount > userBalance) {
      alert("You cannot withdraw more than your balance!");
      return;
    }
    if (withdrawAmount < 50) {
      alert("Minimum withdrawal amount is 50 Taka!");
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/users/${currentUser.uid}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          method: withdrawMethod
        })
      });
      
      const data = await response.json();
      if (data && data.success) {
        alert(`✅ Request sent for ${withdrawAmount} Taka via ${withdrawMethod.toUpperCase()}. You will receive within 24 hours!`);
        setUserBalance(userBalance - withdrawAmount);
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        loadUserBalance();
      } else {
        alert('❌ Failed to process withdrawal: ' + (data?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('❌ Error processing withdrawal');
    }
  };

  const getTypeName = (type) => {
    const types = {
      plastic: "Plastic",
      paper: "Paper",
      metal: "Metal",
      ewaste: "E-Waste"
    };
    return types[type] || type;
  };

  // শুধু অ্যাক্টিভ প্রাইস দেখান
  const activePrices = priceList.filter(p => p.isActive !== false);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4 animate-pulse">
              <FaMoneyBillWave className="text-xl" />
              <span className="font-semibold">💰 Cash Back Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Give Waste, <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Get Money!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ♻️ Earn cash by recycling waste. Fixed price per kg. Money directly sent to your bKash/Nagad!
            </p>
            
            {!isLoggedIn ? (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-yellow-600 text-2xl" />
                  <div className="text-left">
                    <p className="text-yellow-800 font-semibold">Login to track your earnings!</p>
                    <p className="text-yellow-600 text-sm">Sign in to view your balance and withdraw money.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 max-w-md mx-auto">
                <p className="text-green-700 text-sm">
                  👋 Welcome, <span className="font-semibold">{userName}</span>! 
                  You have <span className="font-bold text-green-600">{userBalance} Taka</span> in your account.
                </p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {isLoggedIn && (
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition duration-300 border-t-4 border-green-500">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaWallet className="text-green-600 text-xl" />
                </div>
                <p className="text-gray-500 text-sm">Your Balance</p>
                <p className="text-3xl font-bold text-gray-900">{userBalance} <span className="text-sm font-normal text-gray-500">Taka</span></p>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="mt-3 text-green-600 text-sm font-semibold flex items-center gap-1 hover:text-green-700 transition"
                >
                  Withdraw <FaArrowRight size={12} />
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition duration-300 border-t-4 border-blue-500">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaHistory className="text-blue-600 text-xl" />
                </div>
                <p className="text-gray-500 text-sm">Total Earned</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalEarned} <span className="text-sm font-normal text-gray-500">Taka</span></p>
                <p className="text-xs text-gray-400 mt-1">From {stats.completedCount} pickups</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition duration-300 border-t-4 border-yellow-500">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaClock className="text-yellow-600 text-xl" />
                </div>
                <p className="text-gray-500 text-sm">Processing</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingAmount} <span className="text-sm font-normal text-gray-500">Taka</span></p>
                <p className="text-xs text-gray-400 mt-1">Pending verification</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition duration-300 border-t-4 border-purple-500">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaRecycle className="text-purple-600 text-xl" />
                </div>
                <p className="text-gray-500 text-sm">Total Recycled</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalRecycled} <span className="text-sm font-normal text-gray-500">kg</span></p>
                <p className="text-xs text-gray-400 mt-1">🌍 Helped save the planet!</p>
              </div>
            </div>
          )}

          {/* Price List - সবার জন্য */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaMoneyBillWave />
                    Price List (Per Kg)
                  </h2>
                  <p className="text-green-100 text-sm mt-1">💪 Earn money by recycling waste</p>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  📈 Updated Daily
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {activePrices.length > 0 ? (
                activePrices.map((item, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition group">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`bg-gradient-to-r ${item.color || 'from-gray-500 to-gray-600'} w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition duration-300`}>
                          {item.emoji || '♻️'}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{item.type}</h3>
                          <p className="text-sm text-gray-500">{item.description || 'Recyclable waste'}</p>
                          <p className="text-xs text-gray-400">
                            📦 Min {item.minKg || 1} kg - Max {item.maxKg || 100} kg
                          </p>
                        </div>
                      </div>
                      <div className="text-right bg-green-50 px-6 py-3 rounded-xl">
                        <p className="text-3xl font-bold text-green-600">{item.pricePerKg} <span className="text-sm font-normal text-gray-600">Taka</span></p>
                        <p className="text-sm text-gray-500">per kg</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No price data available
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-t border-green-200">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <FaRocket className="text-green-600" />
                  💡 <span className="font-semibold">Bulk waste = Higher price!</span> 20kg+ plastic = 30 Taka/kg
                </p>
                <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  🔥 Special Offer
                </span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          {isLoggedIn && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaHistory />
                  Transaction History
                </h2>
                <span className="text-sm text-gray-400">{transactions.length} transactions</span>
              </div>

              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaHistory className="text-4xl mx-auto mb-2 text-gray-300" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Start recycling to earn money!</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition hover:border-green-200 group">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.status === "completed" ? "bg-green-100" : "bg-yellow-100"
                          }`}>
                            {tx.status === "completed" ? (
                              <FaCheckCircle className="text-green-600" />
                            ) : (
                              <FaSpinner className="text-yellow-600 animate-spin" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{getTypeName(tx.type)}</span>
                              <span className="text-sm text-gray-500">{tx.weight} kg</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                tx.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {tx.status === "completed" ? "✅ Approved" : "⏳ Processing"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">📅 {tx.date}</p>
                            {tx.proof && (
                              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <FaCheckCircle size={10} />
                                🔑 {tx.proof}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">+{tx.total} Taka</p>
                          <p className="text-xs text-gray-400">@ {tx.rate} Taka/kg</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              How It <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-bounce">
                  📞
                </div>
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  1
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Request Pickup</h3>
                <p className="text-gray-600 text-sm">Schedule a waste collection pickup from your location</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-pulse">
                  ♻️
                </div>
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  2
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Recycling Process</h3>
                <p className="text-gray-600 text-sm">We recycle your waste and provide proof of recycling</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-bounce">
                  💰
                </div>
                <div className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  3
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Get Paid</h3>
                <p className="text-gray-600 text-sm">Withdraw your earnings to bKash or Nagad instantly</p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold">Why Recycle With Us?</h2>
              <p className="text-green-100 mt-2">Join thousands of people making a difference</p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <FaShieldAlt className="text-3xl mx-auto mb-2" />
                <h4 className="font-semibold">Secure & Trusted</h4>
                <p className="text-sm text-green-100">100% secure payments</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <FaHandHoldingHeart className="text-3xl mx-auto mb-2" />
                <h4 className="font-semibold">Eco-Friendly</h4>
                <p className="text-sm text-green-100">Help save the planet</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <FaMoneyBillWave className="text-3xl mx-auto mb-2" />
                <h4 className="font-semibold">Instant Payments</h4>
                <p className="text-sm text-green-100">Fast withdrawal to bKash</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <FaGift className="text-3xl mx-auto mb-2" />
                <h4 className="font-semibold">Bonus Rewards</h4>
                <p className="text-sm text-green-100">Extra points on recycling</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">💸 Withdraw Money</h2>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {!isLoggedIn ? (
              <div className="text-center py-6">
                <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Please login to withdraw money</p>
                <button 
                  onClick={() => setShowWithdrawModal(false)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Withdrawal Method</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setWithdrawMethod("bkash")}
                      className={`flex-1 py-3 rounded-lg border-2 font-semibold transition ${
                        withdrawMethod === "bkash" ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 hover:border-red-300"
                      }`}
                    >
                      💳 bKash
                    </button>
                    <button 
                      onClick={() => setWithdrawMethod("nagad")}
                      className={`flex-1 py-3 rounded-lg border-2 font-semibold transition ${
                        withdrawMethod === "nagad" ? "border-purple-500 bg-purple-50 text-purple-600" : "border-gray-300 hover:border-purple-300"
                      }`}
                    >
                      📱 Nagad
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Amount (Taka)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Minimum 50 Taka"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">💰 Balance: {userBalance} Taka</p>
                    <p className="text-sm text-gray-500">Min: 50 Taka</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleWithdraw}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Confirm Withdraw
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default EarnMoney;