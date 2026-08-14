import { FaUserPlus, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FaUserPlus,
    title: "Create Account",
    description: "Sign up in minutes and set up your profile",
    number: "01"
  },
  {
    icon: FaCalendarAlt,
    title: "Schedule Pickup",
    description: "Choose date, time, and type of waste",
    number: "02"
  },
  {
    icon: FaCheckCircle,
    title: "Get Confirmation",
    description: "Receive real-time updates and tracking",
    number: "03"
  }
];

const HowItWorks = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Simple process to start managing waste efficiently
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-emerald-200 to-green-200 transform -translate-y-1/2"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg mb-6 mx-auto">
                <step.icon className="text-white text-4xl" />
              </div>
              
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow-md">
                <span className="text-green-600 font-bold">{step.number}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;