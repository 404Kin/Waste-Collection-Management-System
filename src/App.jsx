import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Pickup from "./pages/Pickup";
import Admin from "./pages/Admin";
import RecyclingCenters from "./pages/RecyclingCenters";
import EarnMoney from "./pages/EarnMoney";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Contact";
import Tracking from "./pages/Tracking";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - সবাই দেখতে পারবে */}
          <Route path="/" element={<Home />} />
          <Route path="/recycling-centers" element={<RecyclingCenters />} />
          <Route path="/earn-money" element={<EarnMoney />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes - শুধু লগইন করা ইউজার দেখতে পারবে */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/pickup" element={
            <ProtectedRoute>
              <Pickup />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* ✅ Tracking Route - এখানে যোগ করুন */}
          <Route path="/tracking" element={
            <ProtectedRoute>
              <Tracking />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;