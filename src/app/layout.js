import "./globals.css";

export const metadata = {
  title: "UM Global Exim | Sourcing & Consolidating Specialty Chemicals",
  description:
    "UM Global Exim - Over five decades of expertise in sourcing, consolidating, and distributing specialty chemicals and ingredients across pharmaceuticals, personal care, colour cosmetics, dermatology, and cleaning industries.",
  keywords: [
    "UM Global Exim",
    "Specialty Chemicals",
    "Chemical Sourcing India",
    "Pharmaceutical Ingredients",
    "Personal Care Chemicals",
    "Colour Cosmetics Ingredients",
    "Dermatology Chemicals",
    "Industrial Cleaning Chemicals",
    "Stock and Sale Chemicals Mumbai",
    "B2B Chemical Supplier",
  ],
  authors: [{ name: "UM Global Exim" }],
  creator: "UM Global Exim",
  publisher: "UM Global Exim",
  metadataBase: new URL("https://umglobalexim.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/images/logo.png" },
      { url: "/icon.png" },
    ],
    apple: [
      { url: "/images/logo.png" },
    ],
  },
  openGraph: {
    title: "UM Global Exim | One Stop for All Types of Chemicals",
    description:
      "Promoters in the business of sourcing and consolidating specialty chemicals and ingredients for more than five decades. Transparent, reliable and cost-effective supply chain solutions.",
    url: "https://umglobalexim.com",
    siteName: "UM Global Exim",
    images: [
      {
        url: "/images/hero/slide1.jpg",
        width: 1200,
        height: 630,
        alt: "UM Global Exim Industrial Facility",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UM Global Exim | Sourcing & Consolidating Specialty Chemicals",
    description:
      "One Stop for All Types of Chemicals. Eco-Friendly Chemicals. Committed to Quality. Established 1970.",
    images: ["/images/hero/slide1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: "#102B46",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "UM Global Exim",
    "alternateName": "UM Global Exim",
    "url": "https://umglobalexim.com",
    "logo": "https://umglobalexim.com/images/logo.png",
    "foundingDate": "1970",
    "description":
      "Promoters in the business of sourcing and consolidating specialty chemicals and ingredients for more than five decades. Transparent, reliable, and cost-effective supply chain solutions.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ground Floor, Shop No 4 and 5, Aidun Building B, 1st Dhobi Talao Lane, Opp. Kyani Bakery",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400002",
      "addressCountry": "IN"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-7304305372",
        "contactType": "sales",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Gujarati"]
      }
    ],
    "email": [
      "export@umglobalexim.com"
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#20A4A8] selection:text-white">
        {children}
      </body>
    </html>
  );
}
