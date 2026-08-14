import { 
  FaCalendarCheck, 
  FaChartLine, 
  FaLeaf, 
  FaTruck, 
  FaAward,
  FaMobileAlt 
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: FaCalendarCheck,
    title: "Schedule Pickups",
    description: "Book waste collection at your convenience with real-time availability",
    color: "from-green-500 to-emerald-500",
    link: "/pickup"
  },
  {
    icon: FaTruck,
    title: "Real-time Tracking",
    description: "Track your waste collection vehicle in real-time on interactive map",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: FaChartLine,
    title: "Waste Analytics",
    description: "Get detailed insights and reports about your waste management",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: FaAward,
    title: "Rewards Program",
    description: "Earn points and redeem exciting rewards for responsible recycling",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: FaLeaf,
    title: "Eco-Friendly",
    description: "Reduce carbon footprint with our sustainable waste management",
    color: "from-teal-500 to-green-500"
  },
  {
    icon: FaMobileAlt,
    title: "Mobile App",
    description: "Manage everything on the go with our mobile-friendly platform",
    color: "from-indigo-500 to-purple-500"
  }
];

const Features = () => {
  const navigate = useNavigate();

  const handleCardClick = (link) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Us?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive waste management solutions with cutting-edge technology
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleCardClick(feature.link)}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                feature.link ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-xl mb-6`}>
                <feature.icon className="text-white text-3xl" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {feature.link && (
                <div className="mt-4 flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;