"use client";

import { companyDetails } from "@/data/company";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import { MessageSquareText } from "lucide-react";

export default function ContactSection() {
  const { contact } = companyDetails;

  return (
    <section id="contact" className="py-14 sm:py-24 bg-[#F4F7F9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102B46]/5 border border-[#102B46]/10 text-[#087F8C] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Connect With Us</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102B46] tracking-tight">
            {contact.heading}
          </h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#20A4A8] mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-xs sm:text-lg text-[#5C6F84] leading-relaxed">
            {contact.intro}
          </p>
        </div>

        {/* Two-Column Grid: Form Left, Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
