import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Profile from "@/components/Profile";
import History from "@/components/History";
import Values from "@/components/Values";
import ProductCategories from "@/components/ProductCategories";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import ContactCTA from "@/components/ContactCTA";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MobileQuickBar from "@/components/MobileQuickBar";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Top Header & Sticky Navigation */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* About Company / Profile */}
        <Profile />

        {/* Company History */}
        <History />

        {/* Product Categories */}
        <ProductCategories />

        {/* Company Values */}
        <Values />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Testimonials */}
        <Testimonials />

        {/* Contact CTA */}
        <ContactCTA />

        {/* Contact Form & Contact Details */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Quick Action Bar (Call, WhatsApp, Enquire) */}
      <MobileQuickBar />

      {/* Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
}
