import { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Pricing — VoiceIQ",
  description:
    "Simple, transparent pricing for AI voice outbound. Start free, scale as you grow. No credit card required.",
};

export default function PricingPage() {
  return (
    <main className="bg-[#05050a] text-white min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
