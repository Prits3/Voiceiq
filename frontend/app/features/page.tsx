import { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import PanelManager from "@/components/landing/PanelManager";

export const metadata: Metadata = {
  title: "Features — VoiceIQ",
  description:
    "Explore VoiceIQ's full feature set — AI voice calling, lead qualification, CRM integrations, real-time analytics, and more.",
};

export default function FeaturesPage() {
  return (
    <main className="bg-[#05050a] text-white min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Features />
        <FinalCTA />
        <Footer />
      </div>
      <PanelManager />
    </main>
  );
}
