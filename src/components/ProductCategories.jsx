"use client";

import Image from "next/image";
import Link from "next/link";
import { productData } from "@/data/products";
import { ArrowUpRight, Box, ShieldCheck, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCategories() {
  return (
    <section id="products" className="py-14 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102B46]/5 border border-[#102B46]/10 text-[#087F8C] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <Box className="w-3.5 h-3.5" />
            <span>Applications & Sourcing</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102B46] tracking-tight">
            {productData.heading}
          </h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#20A4A8] mx-auto mt-3 rounded-full" />
          
          <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F4F7F9] border border-slate-200/80 inline-block text-left sm:text-center">
            <p className="text-xs sm:text-base text-[#263746] font-medium leading-relaxed max-w-2xl mx-auto">
              &ldquo;{productData.introduction}&rdquo;
            </p>
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {productData.categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#102B46] shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col h-[320px] sm:h-[380px] lg:h-[400px]"
              style={{ position: "relative", overflow: "hidden" }}
            >
              {/* Background Image with Zoom on Hover */}
              <div className="absolute inset-0" style={{ position: "absolute", inset: 0 }}>
                <Image
                  src={category.image}
                  alt={category.altText}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                {/* Dark gradient overlay for contrast */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-[#0B1E31] via-[#102B46]/75 to-[#102B46]/35" 
                  style={{ position: "absolute", inset: 0 }}
                />
              </div>

              {/* Top Badge: Stock-n-Sale */}
              <div className="relative z-10 p-4 sm:p-6 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold tracking-wide">
                  Category 0{index + 1}
                </span>

                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#20A4A8] transition-all">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 mt-auto p-4 sm:p-6 flex flex-col justify-end">
                <div className="inline-flex items-center gap-1 text-[#20A4A8] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Regulatory Compliant</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5 group-hover:text-[#20A4A8] transition-colors">
                  {category.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-2 mb-3">
                  {category.summary}
                </p>

                <div className="pt-2.5 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs">
                    <Check className="w-3 h-3 text-[#20A4A8]" />
                    <span>Just-in-Time Delivery</span>
                  </span>
                  <Link
                    href="#contact"
                    className="text-[#20A4A8] hover:text-white font-semibold transition-colors py-1 px-2 rounded hover:bg-white/10"
                  >
                    Enquire Now →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
