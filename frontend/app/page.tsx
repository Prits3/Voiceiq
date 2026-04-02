import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Demo from "@/components/landing/Demo";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import CookieBanner from "@/components/landing/CookieBanner";

export default function LandingPage() {
  return (
    <main className="bg-[#05050a] text-white min-h-screen">
      <Navbar />
      <Hero />
      <Demo />
      <HowItWorks />
      <Features />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <CookieBanner />
    </main>
  );
}
