"use client";

import { companyDetails } from "@/data/company";
import { 
  Award, 
  Handshake, 
  Truck, 
  CheckCircle2, 
  Receipt, 
  Headphones,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  Award,
  Handshake,
  Truck,
  CheckCircle2,
  ReceiptCheck: Receipt,
  Headphones,
};

export default function WhyChooseUs() {
  const { whyChooseUs } = companyDetails;

  return (
    <section className="py-14 sm:py-24 bg-[#F4F7F9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#087F8C]/10 border border-[#087F8C]/20 text-[#087F8C] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Value Proposition</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102B46] tracking-tight">
            {whyChooseUs.heading}
          </h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#20A4A8] mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-xs sm:text-lg text-[#5C6F84]">
            {whyChooseUs.subheading}
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {whyChooseUs.points.map((point, index) => {
            const IconComponent = iconMap[point.iconName] || CheckCircle2;

            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F4F7F9] border border-slate-200 text-[#087F8C] group-hover:bg-[#087F8C] group-hover:text-white flex items-center justify-center transition-colors mb-4 sm:mb-6 shadow-sm">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-[#102B46] mb-2 sm:mb-3 group-hover:text-[#087F8C] transition-colors">
                    {point.title}
                  </h3>

                  <p className="text-[#5C6F84] text-xs sm:text-base leading-relaxed">
                    {point.description}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#087F8C]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#20A4A8]" />
                  <span>UM Global Exim Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
