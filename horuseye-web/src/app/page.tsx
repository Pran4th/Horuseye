import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Architecture from "@/components/landing/Architecture";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import ChatBot from "@/components/landing/ChatBot";

export default function Home() {
  return (
    <div className="from-background via-background to-primary/5 min-h-screen bg-gradient-to-br">
      <Header />
      <Hero />
      <Features />
      <Architecture />
      <Testimonials />
      <CTA />
      <Footer />
      <ChatBot />
    </div>
  );
}
