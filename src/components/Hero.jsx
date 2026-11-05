"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  PhoneCall
} from "lucide-react";
import { companyDetails } from "@/data/company";

const heroSlides = [
  {
    heading: "One Stop for All Types of Chemicals",
    tagline: "Global Chemical Sourcing & Consolidation",
    description:
      "Promoters in the business of sourcing and consolidating specialty chemicals and ingredients for more than five decades. Becoming an extension of your company in your supply chain solution.",
    image: "/images/hero/slide1.jpg",
    alt: "Modern chemical processing facility and international distribution network",
    badge: "Specialty Chemicals Leader",
    icon: Building2,
  },
  {
    heading: "Eco-Friendly Chemicals",
    tagline: "Sustainable & Compliant Sourcing",
    description:
      "Delivering high-purity, environmentally compliant chemical solutions tailored for pharmaceutical, personal care, and modern green manufacturing requirements.",
    image: "/images/hero/slide2.jpg",
    alt: "Eco-friendly sustainable chemical research and laboratory formulation",
    badge: "Responsible Sourcing",
    icon: Leaf,
  },
  {
    heading: "Committed to Quality",
    tagline: "Just-in-Time Regulatory Adherence",
    description:
      "Assuring consistent product quality, transparent pricing, and responsive personalized customer service with full compliance to regulatory standards.",
    image: "/images/hero/slide3.jpg",
    alt: "Scientific quality control testing and laboratory precision analysis",
    badge: "50+ Years Sourcing Excellence",
    icon: ShieldCheck,
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const activeSlideData = heroSlides[currentSlide];
  const CurrentIcon = activeSlideData.icon;

  return (
    <section id="home" className="relative min-h-[88vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#102B46]">
      {/* Background Images with AnimatePresence */}
      <div className="absolute inset-0 z-0" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={activeSlideData.image}
              alt={activeSlideData.alt}
              fill
              priority
              className="object-cover object-center"
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-layered dark overlay for maximum text contrast & corporate tone */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1E31]/95 via-[#102B46]/90 to-[#0B1E31]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(32,164,168,0.22),transparent_70%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:py-36 md:py-44 flex flex-col justify-center min-h-[85vh] sm:min-h-screen">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#20A4A8] text-[11px] sm:text-xs font-semibold tracking-wide uppercase mb-3 sm:mb-5"
          >
            <CurrentIcon className="w-3.5 h-3.5 text-[#20A4A8] shrink-0" />
            <span className="text-white font-medium truncate">{activeSlideData.tagline}</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-[#20A4A8] hidden sm:inline">{activeSlideData.badge}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            key={`heading-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] mb-3 sm:mb-5"
          >
            {activeSlideData.heading}
          </motion.h1>

          {/* Supporting Description */}
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm sm:text-base md:text-xl text-slate-200 leading-relaxed font-normal mb-6 sm:mb-9 max-w-2xl"
          >
            {activeSlideData.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <Link
              href="#profile"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-[#20A4A8] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#20A4A8]/30 hover:bg-[#198d91] active:scale-[0.98] transition-all group"
            >
              <span>Explore Our Company</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href={`tel:${companyDetails.contact.primaryPhone.value}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/25 backdrop-blur-md active:scale-[0.98] transition-all"
            >
              <PhoneCall className="w-4 h-4 text-[#20A4A8]" />
              <span>Call +91 7304305372</span>
            </a>
          </motion.div>

          {/* Trust Highlights Strip - Mobile-Friendly 2x2 grid on mobile, 4-col on sm */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-white"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-0 sm:bg-transparent sm:border-0 text-center sm:text-left">
              <div className="text-xl sm:text-3xl font-bold text-white tracking-tight">1970</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Established</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-0 sm:bg-transparent sm:border-0 text-center sm:text-left">
              <div className="text-xl sm:text-3xl font-bold text-[#20A4A8] tracking-tight">50+ Yrs</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Experience</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-0 sm:bg-transparent sm:border-0 text-center sm:text-left">
              <div className="text-xl sm:text-3xl font-bold text-white tracking-tight">Global</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Sourcing</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-0 sm:bg-transparent sm:border-0 text-center sm:text-left">
              <div className="text-xl sm:text-3xl font-bold text-[#20A4A8] tracking-tight">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Compliant</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide Controls & Dots - Clean bottom alignment */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-sm p-1.5 rounded-full border border-white/10">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-1.5 sm:p-2 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex items-center gap-1.5 px-1">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-6 sm:w-8 bg-[#20A4A8]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-1.5 sm:p-2 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
}
