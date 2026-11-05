import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Full Name must be at least 2 characters." })
    .max(100, { message: "Full Name cannot exceed 100 characters." }),
  mobileNumber: z
    .string()
    .trim()
    .min(7, { message: "Please enter a valid phone number." })
    .max(20, { message: "Phone number is too long." })
    .regex(/^[+]?[0-9\s\-()]{7,20}$/, {
      message: "Please enter a valid mobile number (e.g., +91 98765 43210).",
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." }),
  address: z
    .string()
    .trim()
    .min(5, { message: "Address must be at least 5 characters." })
    .max(250, { message: "Address cannot exceed 250 characters." }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(2000, { message: "Message cannot exceed 2000 characters." }),
});

