"use client";

import Image from "next/image";
import Link from "next/link";
import { companyDetails } from "@/data/company";
import { ArrowRight, PhoneCall, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactCTA() {
  const { cta } = companyDetails;

  return (
    <section className="relative py-14 sm:py-24 bg-[#102B46] text-white overflow-hidden">
      {/* Background Graphic Asset */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta/cta-bg.jpg"
          alt="UM Global Exim chemical supply chain and sourcing partnership"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1E31]/95 via-[#102B46]/90 to-[#087F8C]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#20A4A8] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Partner With Us</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3 sm:mb-4">
              {cta.heading}
            </h2>

            <p className="text-sm sm:text-xl text-slate-200 font-medium mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              {cta.subheading}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <Link
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-[#20A4A8] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#20A4A8]/30 hover:bg-[#198d91] active:scale-[0.98] transition-all group"
              >
                <span>{cta.buttonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href={`tel:${companyDetails.contact.primaryPhone.value}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#20A4A8]" />
                <span>Call {companyDetails.contact.primaryPhone.display}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
