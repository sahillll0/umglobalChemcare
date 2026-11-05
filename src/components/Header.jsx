"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { companyDetails } from "@/data/company";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight,
  MessageCircle,
  ArrowRight
} from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ["home", "profile", "history", "products", "testimonials", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Contact Bar - Hidden on mobile, visible on tablet+ for a clean, distraction-free mobile header */}
      <div 
        className={`hidden sm:block bg-[#0B1E31] text-xs text-slate-300 border-b border-white/10 transition-all duration-300 ${
          isScrolled ? "py-1.5" : "py-2.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-y-2">
          <div className="flex items-center gap-6">
            <a 
              href={`tel:${companyDetails.contact.primaryPhone.value}`}
              className="inline-flex items-center gap-2 hover:text-[#20A4A8] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#20A4A8]" />
              <span>Tel: {companyDetails.contact.primaryPhone.display}</span>
            </a>
            <a 
              href={`mailto:${companyDetails.contact.emails[0]}`}
              className="hidden md:inline-flex items-center gap-2 hover:text-[#20A4A8] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#20A4A8]" />
              <span>{companyDetails.contact.emails[0]}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#20A4A8]" />
              <span>Mumbai, India</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-medium">
              Estd. 1970 • 50+ Years Experience
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`transition-all duration-300 ${
          isScrolled 
            ? "bg-white/98 backdrop-blur-md shadow-md py-2.5 sm:py-3" 
            : "bg-[#102B46]/95 sm:bg-[#102B46]/90 backdrop-blur-md py-3 sm:py-4 border-b border-white/10 sm:border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link 
            href="#home"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white p-1 shrink-0 border border-slate-200">
              <Image
                src="/images/logo.png"
                alt="UM Global Exim Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-base sm:text-xl font-bold tracking-tight uppercase leading-tight transition-colors ${
                isScrolled ? "text-[#102B46]" : "text-white"
              }`}>
                {companyDetails.name}
              </span>
              <span className={`text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold transition-colors ${
                isScrolled ? "text-[#087F8C]" : "text-[#20A4A8]"
              }`}>
                Specialty Chemicals • Estd. 1970
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {companyDetails.navigation.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isScrolled
                      ? isActive
                        ? "text-[#087F8C] bg-slate-100 font-semibold"
                        : "text-[#263746] hover:text-[#087F8C] hover:bg-slate-50"
                      : isActive
                        ? "text-white bg-white/15 font-semibold"
                        : "text-slate-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="#contact"
              className={`ml-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                isScrolled
                  ? "bg-[#102B46] text-white hover:bg-[#087F8C]"
                  : "bg-[#20A4A8] text-white hover:bg-[#1b8c8f]"
              }`}
            >
              Get Sourcing Quote
            </Link>
          </div>

          {/* Mobile Right Controls: Quick Call Button + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:${companyDetails.contact.primaryPhone.value}`}
              aria-label="Direct Phone Call"
              className="p-2 rounded-lg bg-[#20A4A8] text-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className={`p-2 rounded-lg focus:outline-none transition-colors ${
                isScrolled 
                  ? "text-[#102B46] hover:bg-slate-100 bg-slate-50" 
                  : "text-white hover:bg-white/10 bg-white/10"
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] sm:top-[68px] z-50 bg-[#0B1E31]/80 backdrop-blur-md flex flex-col justify-between">
          <div className="bg-white text-[#263746] rounded-b-3xl px-5 py-6 shadow-2xl border-t border-slate-100 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Menu Navigation
              </span>
              <span className="text-xs font-semibold text-[#087F8C] bg-[#E0F5F6] px-2.5 py-0.5 rounded-full">
                50+ Years of Trust
              </span>
            </div>

            <div className="flex flex-col space-y-1.5">
              {companyDetails.navigation.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-[#F4F7F9] text-[#087F8C] font-bold border-l-4 border-[#087F8C]"
                        : "text-[#263746] hover:bg-slate-50 active:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Direct Action Buttons */}
            <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
              <Link
                href="#contact"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#102B46] text-white rounded-xl font-bold text-sm shadow hover:bg-[#087F8C] transition-colors"
              >
                <span>Request Sourcing Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${companyDetails.contact.primaryPhone.value}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-[#102B46] font-semibold text-xs border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-[#087F8C]" />
                  <span>Call Us</span>
                </a>
                <a
                  href={`https://wa.me/917304305372?text=Hello%20UM%20Global%20Exim,%20I%20am%20interested%20in%20chemical%20sourcing`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={`mailto:${companyDetails.contact.emails[0]}`}
                  className="text-xs text-slate-500 hover:text-[#087F8C] transition-colors break-all"
                >
                  {companyDetails.contact.emails[0]}
                </a>
              </div>
            </div>
          </div>

          {/* Clickable backdrop area to dismiss */}
          <div 
            className="flex-1 cursor-pointer"
            onClick={closeMobileMenu} 
            aria-hidden="true" 
          />
        </div>
      )}
    </header>
  );
}
