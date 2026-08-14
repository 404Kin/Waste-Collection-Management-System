import { useState, useEffect } from "react";
import { FaCheckCircle, FaSpinner, FaTruck, FaClock, FaBell } from "react-icons/fa";

const StatusTracker = ({ pickupId, initialStatus }) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus || "pending");
  const [showNotification, setShowNotification] = useState(false);

  const statusSteps = [
    { key: "pending", label: "Request Received", icon: FaClock, color: "text-yellow-500" },
    { key: "confirmed", label: "Confirmed", icon: FaCheckCircle, color: "text-blue-500" },
    { key: "assigned", label: "Driver Assigned", icon: FaTruck, color: "text-purple-500" },
    { key: "in-progress", label: "Pickup in Progress", icon: FaSpinner, color: "text-orange-500" },
    { key: "completed", label: "Completed", icon: FaCheckCircle, color: "text-green-500" }
  ];

  const currentIndex = statusSteps.findIndex(s => s.key === currentStatus);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This would come from WebSocket in real implementation
      const statuses = ["pending", "confirmed", "assigned", "in-progress", "completed"];
      const nextIndex = statuses.indexOf(currentStatus) + 1;
      if (nextIndex < statuses.length) {
        setCurrentStatus(statuses[nextIndex]);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }, 10000); // Update every 10 seconds for demo

    return () => clearInterval(interval);
  }, [currentStatus]);

  return (
    <div className="relative">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50 flex items-center gap-2">
          <FaBell />
          Status updated to {currentStatus}!
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.key} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
                  ${isCurrent ? 'ring-4 ring-green-300' : ''}
                  transition-all duration-500
                `}>
                  <Icon className="text-xl" />
                </div>
                <p className="mt-2 text-sm font-semibold">{step.label}</p>
                {isCurrent && (
                  <div className="mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                    Current
                  </div>
                )}
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`absolute top-6 left-1/2 w-full h-1 ${index < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Estimated Time */}
      {currentStatus !== "completed" && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-800">
            Estimated completion time: {Math.floor(Math.random() * 30) + 15} minutes
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusTracker;