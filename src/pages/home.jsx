

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";


function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      {/* <CTASection /> */}
      <Footer />
      
    </>
  );
}

export default Home;