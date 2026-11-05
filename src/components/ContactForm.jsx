"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactFormSchema } from "@/lib/validation";
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare 
} from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      address: "",
      message: "",
      honeypot: "",
    },
  });

  const onSubmit = async (data) => {
    if (data.honeypot) {
      console.warn("Spam submission blocked.");
      return;
    }

    const validation = contactFormSchema.safeParse(data);
    if (!validation.success) {
      setSubmissionStatus({
        type: "error",
        message: validation.error.issues[0]?.message || "Please check your inputs.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to submit enquiry.");
      }

      setSubmissionStatus({
        type: "success",
        message: resData.message || "Your message has been sent successfully!",
      });
      reset();
    } catch (err) {
      setSubmissionStatus({
        type: "error",
        message: err.message || "An error occurred while sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md sm:shadow-lg">
      <div className="mb-5 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-[#102B46] mb-1 sm:mb-2">
          Send Us an Enquiry
        </h3>
        <p className="text-xs sm:text-sm text-[#5C6F84]">
          Fill in your chemical requirements and our sourcing team will respond promptly.
        </p>
      </div>

      {submissionStatus && (
        <div
          role="alert"
          className={`mb-5 p-3.5 sm:p-4 rounded-xl flex items-start gap-2.5 border ${
            submissionStatus.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {submissionStatus.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs sm:text-sm font-medium leading-relaxed">
            {submissionStatus.message}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5" noValidate>
        {/* Anti-spam honeypot */}
        <input
          type="text"
          {...register("honeypot")}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {/* Full Name */}
        <div>
          <label 
            htmlFor="fullName" 
            className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#102B46] mb-1.5"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="fullName"
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register("fullName", {
                required: "Full Name is required.",
                minLength: { value: 2, message: "Name must be at least 2 characters." },
              })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base sm:text-sm text-[#263746] bg-[#F8FAFC] focus:bg-white focus:outline-none transition-all ${
                errors.fullName ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#20A4A8]"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Mobile Number & Email Address (2 columns on sm, 1 col on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Mobile Number */}
          <div>
            <label 
              htmlFor="mobileNumber" 
              className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#102B46] mb-1.5"
            >
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="mobileNumber"
                type="tel"
                placeholder="+91 98765 43210"
                {...register("mobileNumber", {
                  required: "Mobile Number is required.",
                  pattern: {
                    value: /^[+]?[0-9\s\-()]{7,20}$/,
                    message: "Please enter a valid mobile number.",
                  },
                })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base sm:text-sm text-[#263746] bg-[#F8FAFC] focus:bg-white focus:outline-none transition-all ${
                  errors.mobileNumber ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#20A4A8]"
                }`}
              />
            </div>
            {errors.mobileNumber && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.mobileNumber.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#102B46] mb-1.5"
            >
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register("email", {
                  required: "Email address is required.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address.",
                  },
                })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base sm:text-sm text-[#263746] bg-[#F8FAFC] focus:bg-white focus:outline-none transition-all ${
                  errors.email ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#20A4A8]"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label 
            htmlFor="address" 
            className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#102B46] mb-1.5"
          >
            Address / Location <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              id="address"
              type="text"
              placeholder="City, State, Country"
              {...register("address", {
                required: "Address is required.",
                minLength: { value: 5, message: "Address must be at least 5 characters." },
              })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base sm:text-sm text-[#263746] bg-[#F8FAFC] focus:bg-white focus:outline-none transition-all ${
                errors.address ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#20A4A8]"
              }`}
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.address.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label 
            htmlFor="message" 
            className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#102B46] mb-1.5"
          >
            Message / Sourcing Query <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <textarea
              id="message"
              rows={4}
              placeholder="Please specify your product interest, requirements, or sourcing queries..."
              {...register("message", {
                required: "Message is required.",
                minLength: { value: 10, message: "Message must be at least 10 characters." },
              })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base sm:text-sm text-[#263746] bg-[#F8FAFC] focus:bg-white focus:outline-none transition-all resize-y ${
                errors.message ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#20A4A8]"
              }`}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 sm:py-4 rounded-xl bg-[#102B46] text-white font-bold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-[#102B46]/20 hover:bg-[#087F8C] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#20A4A8]" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
