"use client";

import { companyDetails } from "@/data/company";
import { 
  ShieldCheck, 
  Smile, 
  HeartPulse, 
  GraduationCap, 
  Users, 
  Globe2, 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  ShieldCheck,
  Smile,
  HeartPulse,
  GraduationCap,
  Users,
  Globe2,
  TrendingUp,
};

export default function Values() {
  const { values } = companyDetails;

  return (
    <section id="values" className="py-14 sm:py-24 bg-[#F4F7F9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#20A4A8]/10 border border-[#20A4A8]/20 text-[#087F8C] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Policy & Guiding Principles</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102B46] tracking-tight">
            {values.heading}
          </h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#20A4A8] mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-xs sm:text-lg text-[#5C6F84]">
            {values.subheading}
          </p>
        </div>

        {/* 7 Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
          {values.items.map((item, index) => {
            const IconComponent = iconMap[item.iconName] || ShieldCheck;
            const isFeatured = index === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group rounded-2xl p-4 sm:p-7 transition-all duration-300 border ${
                  isFeatured 
                    ? "bg-gradient-to-br from-[#102B46] to-[#0B1E31] text-white border-[#102B46] shadow-md xl:col-span-2 sm:col-span-2" 
                    : "bg-white text-[#263746] border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#20A4A8]/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isFeatured 
                      ? "bg-[#20A4A8] text-white" 
                      : "bg-[#087F8C]/10 text-[#087F8C] group-hover:bg-[#087F8C] group-hover:text-white"
                  }`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isFeatured ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-500"
                  }`}>
                    0{index + 1}
                  </span>
                </div>

                <h3 className={`text-base sm:text-xl font-bold mb-1.5 sm:mb-2.5 transition-colors ${
                  isFeatured ? "text-white" : "text-[#102B46] group-hover:text-[#087F8C]"
                }`}>
                  {item.title}
                </h3>

                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isFeatured ? "text-slate-300" : "text-[#5C6F84]"
                }`}>
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
