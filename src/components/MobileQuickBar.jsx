"use client";

import { Phone, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { companyDetails } from "@/data/company";

export default function MobileQuickBar() {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1E31]/95 backdrop-blur-lg border-t border-white/10 px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-3 gap-2">
        {/* Direct Call */}
        <a
          href={`tel:${companyDetails.contact.primaryPhone.value}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-white/10 active:bg-white/20 text-white transition-colors"
        >
          <Phone className="w-4 h-4 text-[#20A4A8] mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Call Now</span>
        </a>

        {/* WhatsApp Chat */}
        <a
          href="https://wa.me/917304305372?text=Hello%20UM%20Global%20Exim,%20I%20am%20interested%20in%20chemical%20sourcing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white shadow-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4 mb-0.5 text-white" />
          <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* Instant Enquiry */}
        <Link
          href="#contact"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-[#20A4A8] active:bg-[#198d91] text-white shadow-sm transition-colors"
        >
          <Send className="w-4 h-4 mb-0.5 text-white" />
          <span className="text-[10px] font-bold tracking-tight">Enquire</span>
        </Link>
      </div>
    </div>
  );
}

