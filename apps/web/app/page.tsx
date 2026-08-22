import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Services from "@/components/home/Services";
import WhyCelebrio from "@/components/home/WhyCelebrio";
import ConsultationCTA from "@/components/home/ConsultationCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <Hero />
      <HowItWorks />
      <Services />
      <WhyCelebrio />
      <ConsultationCTA />

      <Footer />
    </main>
  );
}