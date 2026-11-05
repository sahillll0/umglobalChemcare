export default function sitemap() {
  const baseUrl = "https://umglobalexim.com";
  const lastModDate = new Date("2026-11-01T00:00:00.000Z");

  return [
    {
      url: baseUrl,
      lastModified: lastModDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#profile`,
      lastModified: lastModDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#history`,
      lastModified: lastModDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#products`,
      lastModified: lastModDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#testimonials`,
      lastModified: lastModDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: lastModDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
