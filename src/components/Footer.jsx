"use client";

import Image from "next/image";
import Link from "next/link";
import { companyDetails } from "@/data/company";
import { productData } from "@/data/products";
import { 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  ShieldCheck 
} from "lucide-react";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#0B1E31] text-slate-300 border-t border-white/10 relative overflow-hidden pb-20 sm:pb-0">
      {/* Top Footer Banner */}
      <div className="border-b border-white/10 bg-[#102B46]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-white p-1 shrink-0">
              <Image
                src="/images/logo.png"
                alt="UM Global Exim Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                {companyDetails.name}
              </span>
              <p className="text-[11px] sm:text-xs text-[#20A4A8] font-medium">
                {companyDetails.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#20A4A8]" />
              <span>Full Regulatory Compliance</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Estd. 1970</span>
            <span className="hidden sm:inline">•</span>
            <span>50+ Years Experience</span>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          {/* Column 1: Brand & Overview */}
          <div className="lg:col-span-4 flex flex-col space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
              About UM Global Exim
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              UM Global Exim&apos;s promoters are in the business of sourcing and consolidating specialty chemicals and ingredients for more than five decades, delivering transparent, reliable, and cost-effective supply chain solutions.
            </p>
            <div className="pt-1 text-[11px] sm:text-xs text-slate-400">
              <span className="text-[#20A4A8] font-semibold">Resourcing Partner:</span> One-stop sourcing agents for global companies, export agents for locally manufactured goods, and local sourcing agents for overseas clients.
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm">
              {companyDetails.navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#20A4A8] transition-colors py-1 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#20A4A8] group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {productData.categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href="#products"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#20A4A8] transition-colors py-0.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#20A4A8] group-hover:translate-x-0.5 transition-transform" />
                    <span>{cat.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="lg:col-span-3">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
              Contact Information
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#20A4A8] shrink-0 mt-0.5" />
                <address className="not-italic text-xs leading-relaxed text-slate-300">
                  {companyDetails.contact.address.line1}, {companyDetails.contact.address.line2}, {companyDetails.contact.address.city}, {companyDetails.contact.address.state} - {companyDetails.contact.address.pincode}, {companyDetails.contact.address.country}
                </address>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#20A4A8] shrink-0 mt-0.5" />
                <div className="flex flex-col text-xs space-y-0.5">
                  <a 
                    href={`tel:${companyDetails.contact.primaryPhone.value}`}
                    className="text-slate-200 hover:text-[#20A4A8] transition-colors font-medium text-sm"
                  >
                    {companyDetails.contact.primaryPhone.display}
                  </a>
                  <span className="text-slate-400 text-[11px]">
                    Export & Sourcing Division
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#20A4A8] shrink-0 mt-0.5" />
                <div className="flex flex-col text-xs space-y-0.5">
                  {companyDetails.contact.emails.map((email, idx) => (
                    <a
                      key={idx}
                      href={`mailto:${email}`}
                      className="text-slate-300 hover:text-[#20A4A8] transition-colors break-all"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-[#06121E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 text-center sm:text-left">
          <p>© {currentYear} UM Global Exim. All Rights Reserved.</p>
          <p className="text-slate-400 text-[11px] sm:text-xs">
            Specialty Chemicals Sourcing & Consolidation
          </p>
        </div>
      </div>
    </footer>
  );
}
