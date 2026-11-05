"use client";

import { companyDetails } from "@/data/company";
import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  UserCheck, 
  Building,
  MessageCircle
} from "lucide-react";

export default function ContactInfo() {
  const { contact } = companyDetails;

  return (
    <div className="bg-[#102B46] text-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-[#102B46] flex flex-col justify-between space-y-6 sm:space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 text-[#20A4A8] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
          <Building className="w-3.5 h-3.5" />
          <span>Official Corporate Office</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
          Contact Details
        </h3>

        {/* Address Card */}
        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 mb-4 sm:mb-6">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#20A4A8]/20 text-[#20A4A8] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <div className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              Company Address
            </div>
            <address className="not-italic text-slate-200 leading-relaxed font-normal">
              {contact.address.line1}<br />
              {contact.address.line2}<br />
              {contact.address.city}, {contact.address.state} - {contact.address.pincode}, {contact.address.country}
            </address>

            <a
              href={contact.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-[#20A4A8] hover:text-white transition-colors"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Primary Contact Number with Call & WhatsApp buttons */}
        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 mb-4 sm:mb-6">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#20A4A8]/20 text-[#20A4A8] flex items-center justify-center shrink-0 mt-0.5">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <div className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              Direct Phone & WhatsApp
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <a
                href={`tel:${contact.primaryPhone.value}`}
                className="text-base sm:text-lg font-bold text-white hover:text-[#20A4A8] tracking-wide transition-colors"
              >
                {contact.primaryPhone.display}
              </a>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${contact.primaryPhone.value}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#20A4A8] text-white text-xs font-bold hover:bg-[#198d91] active:scale-[0.98] transition-all"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/917304305372?text=Hello%20UM%20Global%20Exim,%20I%20am%20interested%20in%20chemical%20sourcing`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 active:scale-[0.98] transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Official Email */}
        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 mb-4 sm:mb-6">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#20A4A8]/20 text-[#20A4A8] flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <div className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              Official Email
            </div>
            <div className="flex flex-col gap-1 mt-1">
              {contact.emails.map((email, idx) => (
                <a
                  key={idx}
                  href={`mailto:${email}`}
                  className="text-sm sm:text-base text-white hover:text-[#20A4A8] font-semibold transition-colors break-all"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Verified Division */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0B1E31]/80 border border-white/10">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase font-bold text-[#20A4A8] tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Dedicated Contact Division</span>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="font-bold text-white text-xs sm:text-sm">Export & Sourcing Division</div>
            <div className="text-[11px] text-slate-400 mb-1.5">UM Global Exim</div>
            <a
              href={`tel:${contact.primaryPhone.value}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#20A4A8] hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{contact.primaryPhone.display}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="pt-3 sm:pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
        <span>UM Global Exim</span>
        <span className="text-[#20A4A8] font-medium text-[11px] sm:text-xs">Global Chemicals Resourcing</span>
      </div>
    </div>
  );
}
