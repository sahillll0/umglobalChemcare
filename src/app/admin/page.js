"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
    accent: "text-amber-600",
    tint: "bg-amber-50/60",
  },
  {
    value: "in_progress",
    label: "In Progress",
    dot: "bg-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    bar: "bg-blue-600",
    accent: "text-blue-600",
    tint: "bg-blue-50/60",
  },
  {
    value: "completed",
    label: "Completed",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    accent: "text-emerald-600",
    tint: "bg-emerald-50/60",
  },
  {
    value: "rejected",
    label: "Rejected",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    bar: "bg-rose-500",
    accent: "text-rose-600",
    tint: "bg-rose-50/60",
  },
];

const STAT_CARDS = [
  { key: "total", label: "Total", accent: "text-slate-900", bar: "bg-slate-900", tint: "bg-white" },
  { key: "pending", label: "Pending", accent: "text-amber-600", bar: "bg-amber-500", tint: "bg-amber-50/60" },
  { key: "in_progress", label: "In Progress", accent: "text-blue-600", bar: "bg-blue-600", tint: "bg-blue-50/60" },
  { key: "completed", label: "Completed", accent: "text-emerald-600", bar: "bg-emerald-500", tint: "bg-emerald-50/60" },
  { key: "rejected", label: "Rejected", accent: "text-rose-600", bar: "bg-rose-500", tint: "bg-rose-50/60" },
];

const FILTERS = [{ value: "all", label: "All", dot: null }, ...STATUS_OPTIONS];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatShort(iso) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function firstName(name) {
  return (name || "there").split(" ")[0];
}

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState("");

  // reply modal state
  const [replyTo, setReplyTo] = useState(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/enquiries", { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const data = await res.json();
    if (data?.success) setEnquiries(data.enquiries || []);
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        const sres = await fetch("/api/auth/session", { cache: "no-store" });
        const sdata = await sres.json();
        if (!sdata.authed) {
          router.replace("/admin/login");
          return;
        }
        await load();
      } catch {
        setNotice("Failed to load dashboard.");
      } finally {
        setChecking(false);
      }
    })();
  }, [load, router]);

  useEffect(() => {
    const s = {
      total: enquiries.length,
      pending: 0,
      in_progress: 0,
      completed: 0,
      rejected: 0,
    };
    for (const e of enquiries) {
      if (s[e.status] !== undefined) s[e.status] += 1;
    }
    setStats(s);
  }, [enquiries]);

  const filtered = useMemo(() => {
    let list =
      filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((e) =>
        [e.fullName, e.email, e.mobileNumber, e.address, e.message]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    return list;
  }, [enquiries, filter, search]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    setNotice("");
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setNotice("Failed to update status.");
        return;
      }
      const data = await res.json();
      setEnquiries((prev) => prev.map((e) => (e.id === id ? data.enquiry : e)));
    } catch {
      setNotice("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setNotice("Failed to delete enquiry.");
        return;
      }
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setNotice("Failed to delete enquiry.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const openReply = (e) => {
    setReplyTo(e);
    setReplySubject(`Re: Your enquiry with UM Global Exim`);
    setReplyMessage(
      `Hi ${firstName(e.fullName)},\n\nThank you for reaching out to UM Global Exim. `
    );
    setReplyError("");
  };

  const closeReply = () => {
    setReplyTo(null);
    setReplyError("");
  };

  const mailtoHref = useMemo(() => {
    if (!replyTo) return "#";
    return `mailto:${replyTo.email}?subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyMessage)}`;
  }, [replyTo, replySubject, replyMessage]);

  const openWhatsApp = () => {
    if (!replyTo) return;
    const num = (replyTo.mobileNumber || "").replace(/[^0-9]/g, "");
    if (!num) {
      setReplyError("This enquiry has no valid phone number.");
      return;
    }
    const text = `${replySubject}\n\n${replyMessage}`;
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
  };

  const sendReplyEmail = async () => {
    if (!replyTo) return;
    setSending(true);
    setReplyError("");
    try {
      const res = await fetch(`/api/admin/enquiries/${replyTo.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === replyTo.id ? data.enquiry : e))
        );
        setNotice(`Reply email sent to ${replyTo.email}.`);
        setReplyTo(null);
      } else {
        setReplyError(data.message || "Failed to send email.");
      }
    } catch {
      setReplyError("Network error while sending email.");
    } finally {
      setSending(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">UM Global Exim</p>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customer Enquiries</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review submissions, update status, and reply to customers.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_CARDS.map((c) => (
            <div
              key={c.key}
              className={`relative overflow-hidden rounded-xl border border-slate-200 p-4 ${c.tint}`}
            >
              <span className={`absolute inset-x-0 top-0 h-1 ${c.bar}`} />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {c.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${c.accent}`}>
                {stats[c.key] ?? 0}
              </p>
            </div>
          ))}
        </div>

        {notice && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {notice}
          </div>
        )}

        {/* Controls: search + filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, message…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((t) => {
              const active = filter === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setFilter(t.value)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t.dot && <span className={`h-2 w-2 rounded-full ${t.dot}`} />}
                  {t.label}
                  <span
                    className={`text-xs ${active ? "text-slate-300" : "text-slate-400"}`}
                  >
                    {t.value === "all" ? stats.total : stats[t.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <Inbox className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No enquiries to show.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((e) => {
                    const opt =
                      STATUS_OPTIONS.find((o) => o.value === e.status) ||
                      STATUS_OPTIONS[0];
                    return (
                      <tr key={e.id} className="align-top hover:bg-slate-50/70">
                        <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                          {formatDate(e.createdAt)}
                          {e.lastReplyAt && (
                            <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              Replied {formatShort(e.lastReplyAt)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900">
                            {e.fullName}
                          </p>
                          <div className="mt-1 space-y-1 text-xs text-slate-500">
                            <a
                              href={`tel:${e.mobileNumber}`}
                              className="flex items-center gap-1.5 hover:text-blue-600"
                            >
                              <Phone className="h-3.5 w-3.5" /> {e.mobileNumber}
                            </a>
                            <a
                              href={`mailto:${e.email}`}
                              className="flex items-center gap-1.5 hover:text-blue-600"
                            >
                              <Mail className="h-3.5 w-3.5" /> {e.email}
                            </a>
                            <p className="flex items-start gap-1.5">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              {e.address}
                            </p>
                          </div>
                        </td>
                        <td className="max-w-xs px-4 py-4 text-slate-600">
                          <p
                            className="line-clamp-3 whitespace-pre-wrap"
                            title={e.message}
                          >
                            {e.message}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${opt.badge}`}
                          >
                            <span
                              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${opt.dot}`}
                            />
                            {opt.label}
                          </span>
                          <select
                            value={e.status}
                            disabled={updatingId === e.id}
                            onChange={(ev) =>
                              handleStatusChange(e.id, ev.target.value)
                            }
                            className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => openReply(e)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Reply
                            </button>
                            <button
                              onClick={() => handleDelete(e.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                            >
                              {updatingId === e.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Reply modal */}
      {replyTo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={closeReply}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">
                  Reply to {replyTo.fullName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {replyTo.email} · {replyTo.mobileNumber}
                </p>
              </div>
              <button
                onClick={closeReply}
                className="-mr-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </label>
                <input
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {replyError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {replyError}{" "}
                  <a
                    href={mailtoHref}
                    className="font-semibold underline"
                  >
                    Open in your email app instead
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <button
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </button>
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  <Mail className="h-4 w-4" />
                  Email app
                </a>
              </div>
              <button
                onClick={sendReplyEmail}
                disabled={sending}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
