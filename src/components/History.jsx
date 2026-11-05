"use client";

import Image from "next/image";
import { companyDetails } from "@/data/company";
import { Calendar, History as HistoryIcon, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { history } = companyDetails;

  return (
    <section id="history" className="py-14 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#087F8C]/10 border border-[#087F8C]/20 text-[#087F8C] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Legacy & Heritage</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102B46] tracking-tight">
            {history.heading}
          </h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#20A4A8] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Side */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/10] sm:aspect-[4/3] group">
              <Image
                src="/images/about/history.jpg"
                alt="UM Global Exim established chemical distribution and long-term customer relationships"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102B46]/85 via-transparent to-transparent" />
              
              <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs uppercase font-semibold text-[#087F8C] tracking-wider">
                    Founding Year
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#102B46]">1970</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] sm:text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    Experience
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#20A4A8]">5+ Decades</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Authentic Verified Record */}
          <div className="lg:col-span-6">
            <div className="relative pl-5 sm:pl-8 border-l-2 border-[#087F8C]/30">
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Node pin */}
                <div className="absolute -left-[27px] sm:-left-[39px] top-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#087F8C] border-4 border-white shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div className="bg-[#F4F7F9] p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#102B46] text-white text-[10px] sm:text-xs font-bold tracking-wider mb-3">
                    <Calendar className="w-3 h-3 text-[#20A4A8]" />
                    <span>ESTABLISHED 1970</span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-[#102B46] mb-2 sm:mb-3">
                    {history.title}
                  </h3>

                  <p className="text-sm sm:text-lg text-[#263746] leading-relaxed">
                    {history.description}
                  </p>

                  <div className="mt-5 pt-4 sm:pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#20A4A8]/10 text-[#087F8C] flex items-center justify-center shrink-0">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#102B46]">
                        Long-Term Customer Relationships
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#087F8C]/10 text-[#087F8C] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#102B46]">
                        High-Quality Product Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
