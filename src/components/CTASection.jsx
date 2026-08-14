import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative px-8 py-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already contributing to a cleaner environment
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
              <FaArrowRight />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;