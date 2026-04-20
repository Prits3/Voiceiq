import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import DemoErrorBoundary from "@/components/landing/DemoErrorBoundary";
import Demo from "@/components/landing/Demo";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import CookieBanner from "@/components/landing/CookieBanner";
import PanelManager from "@/components/landing/PanelManager";

export default function LandingPage() {
  return (
    <main className="bg-[#05050a] text-white min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <DemoErrorBoundary>
        <Demo />
      </DemoErrorBoundary>
      <HowItWorks />
      <Features />
      <FinalCTA />
      <Footer />
      <CookieBanner />
      <PanelManager />
    </main>
  );
}
