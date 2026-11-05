"use client";

import { useState } from "react";
import { testimonialsData } from "@/data/testimonials";
import { Quote, MessageSquare, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = testimonialsData.testimonials;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section id="testimonials" className="py-14 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102B46]/5 border border-[#102B46]/10 text-[#087F8C] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Client Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102B46] tracking-tight">
            {testimonialsData.heading}
          </h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#20A4A8] mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-xs sm:text-lg text-[#5C6F84]">
            {testimonialsData.subheading}
          </p>
        </div>

        {/* Carousel for Featured View + Full Grid for Desktop */}
        <div className="max-w-4xl mx-auto">
          {/* Featured Carousel Card */}
          <div className="relative bg-gradient-to-br from-[#102B46] to-[#0B1E31] rounded-2xl sm:rounded-3xl p-5 sm:p-12 text-white shadow-xl overflow-hidden border border-[#102B46]">
            <Quote className="absolute top-4 right-4 sm:top-6 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 text-white/5 pointer-events-none" />

            <div className="min-h-[160px] sm:min-h-[170px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-1 mb-3 sm:mb-6 text-[#20A4A8]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-sm sm:text-xl md:text-2xl font-medium leading-relaxed italic text-slate-100 mb-5 sm:mb-8">
                    &ldquo;{items[currentIndex].quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#20A4A8] text-white flex items-center justify-center font-bold text-sm sm:text-lg shadow-md shrink-0">
                      {items[currentIndex].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        {items[currentIndex].name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-[#20A4A8] font-medium uppercase tracking-wider">
                        Verified Business Partner
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`View testimonial ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? "w-6 sm:w-8 bg-[#20A4A8]" : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                  className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                  className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Selector Pills Below Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  currentIndex === idx
                    ? "bg-[#F4F7F9] border-[#087F8C] shadow-sm font-semibold"
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-[#102B46] truncate">{item.name}</div>
                <div className="text-[10px] text-slate-400">Feedback 0{idx + 1}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
