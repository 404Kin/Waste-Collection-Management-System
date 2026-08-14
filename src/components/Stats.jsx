import { FaRecycle, FaGlobe, FaUsers, FaTree } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  {
    icon: FaRecycle,
    value: 50000,
    label: "Waste Recycled (kg)",
    suffix: "+"
  },
  {
    icon: FaGlobe,
    value: 500,
    label: "Cities Covered",
    suffix: "+"
  },
  {
    icon: FaUsers,
    value: 10000,
    label: "Active Users",
    suffix: "+"
  },
  {
    icon: FaTree,
    value: 25000,
    label: "Trees Saved",
    suffix: "+"
  }
];

const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const Stats = () => {
  return (
    <div className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <div className="inline-flex p-4 bg-white/20 rounded-xl mb-4">
                <stat.icon className="text-4xl" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <Counter end={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-white/90 text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;