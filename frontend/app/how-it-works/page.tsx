import { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import HowItWorks from "@/components/landing/HowItWorks";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "How It Works — VoiceIQ",
  description:
    "See exactly how VoiceIQ turns a lead list into booked meetings — from import to warm handoff — in four simple steps.",
};

export default function HowItWorksPage() {
  return (
    <main className="bg-[#05050a] text-white min-h-screen">
      <Navbar />
      <div className="pt-16">
        <HowItWorks />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
