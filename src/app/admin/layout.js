export const metadata = {
  title: "Admin · UM Global Exim",
  description: "Admin dashboard for managing customer enquiries.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
}
