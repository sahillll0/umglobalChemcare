"use client";

import { useState } from "react";
import Image from "next/image";
import { companyDetails } from "@/data/company";
import { 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Share2, 
  ShieldCheck, 
  Layers 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const [showMore, setShowMore] = useState(false);
  const { about } = companyDetails;

  return (
    <section id="profile" className="py-14 sm:py-24 bg-[#F4F7F9] relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#087F8C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#20A4A8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102B46]/5 border border-[#102B46]/10 text-[#087F8C] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Company Profile</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102B46] tracking-tight">
            {about.heading}
          </h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#20A4A8] mx-auto mt-3 rounded-full" />
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Content & Roles */}
          <div className="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6">
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80">
              <p className="text-base sm:text-xl font-bold text-[#102B46] leading-relaxed mb-3 sm:mb-4">
                {about.primary}
              </p>

              <p className="text-[#263746] leading-relaxed text-sm sm:text-base mb-4">
                {about.extension}
              </p>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#F4F7F9] border-l-4 border-[#087F8C] mb-5">
                <p className="text-[#263746] font-medium italic text-xs sm:text-base leading-relaxed">
                  &ldquo;{about.solutions}&rdquo;
                </p>
              </div>

              {/* "We Act As" subsection */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-lg sm:text-xl font-bold text-[#102B46] mb-3 sm:mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#087F8C]" />
                  <span>{about.rolesHeading}</span>
                </h3>
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                  {about.roles.map((role, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/60"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#20A4A8] shrink-0 mt-0.5" />
                      <span className="text-[#263746] font-medium text-xs sm:text-base leading-snug">
                        {role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Read More / Read Less Additional Content */}
              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-5 pt-5 border-t border-slate-100 space-y-3 text-xs sm:text-base text-[#263746]"
                  >
                    {about.additionalParagraphs.map((para, i) => (
                      <p key={i} className="leading-relaxed bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                        {para}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Read More Button */}
              <div className="mt-5 text-center sm:text-left">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#087F8C] text-[#102B46] hover:text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  <span>{showMore ? "Read Less" : "Read Full Company Details"}</span>
                  {showMore ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Image & Feature Highlights */}
          <div className="lg:col-span-5 flex flex-col space-y-4 sm:space-y-6">
            <div 
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] group w-full"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <Image
                src="/images/about/company-profile.jpg"
                alt="UM Global Exim specialty chemicals analysis and laboratory sourcing facility"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102B46]/90 via-[#102B46]/30 to-transparent" />

              {/* Floating Stat Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#087F8C] text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-bold text-[#102B46]">50+ Years</h4>
                    <p className="text-[11px] sm:text-xs text-[#5C6F84] font-medium leading-tight">
                      Promoter Specialty Chemical Sourcing Track Record
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Sourcing Attributes */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#20A4A8]/10 text-[#087F8C] flex items-center justify-center mb-1.5">
                  <Share2 className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-[#102B46] text-xs sm:text-sm">Swift Channel</h5>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">Market connectivity for global suppliers</p>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#087F8C]/10 text-[#087F8C] flex items-center justify-center mb-1.5">
                  <Globe className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-[#102B46] text-xs sm:text-sm">Global Reach</h5>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">Sourcing specialty inputs across continents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
