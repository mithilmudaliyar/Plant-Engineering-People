"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

type Supplier = { id: number; email: string; name?: string };

type Order = {
  id: number;
  whatNeeded: string;
  isTicket: boolean;
  status: string;
  createdAt: string;
  employeeNotes?: string | null;
};

export default function SupplierDashboard() {
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [whatNeeded, setWhatNeeded] = useState("");
  const [briefDetails, setBriefDetails] = useState("");
  const [isTicket, setIsTicket] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("supplier");
    if (!saved) {
      router.push("/supplier-login");
    } else {
      const s = JSON.parse(saved);
      setSupplier(s);
      fetchOrders(s.id);
    }
  }, [router]);

  const fetchOrders = async (supplierId: number) => {
    try {
      const res = await fetch(`/api/orders?supplierId=${supplierId}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("supplier");
    window.dispatchEvent(new Event("supplier-auth-change"));
    router.push("/");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: supplier.id,
          whatNeeded,
          briefDetails,
          isTicket,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormSuccess("Successfully submitted! You will receive an email confirmation shortly.");
        setWhatNeeded("");
        setBriefDetails("");
        setIsTicket(false);
        fetchOrders(supplier.id); // Refresh list
      } else {
        setFormError(data.message || "Failed to submit.");
      }
    } catch (err) {
      setFormError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (!supplier) return;
    if (!confirm("Are you sure you want to cancel this request?")) return;
    
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, supplierId: supplier.id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders(supplier.id);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error canceling order.");
    }
  };

  if (!supplier) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#1a3a52]">Supplier Portal</h1>
            <p className="mt-1 text-sm text-slate-500">Welcome back, {supplier.name || supplier.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          {/* Left Column: Form */}
          <div>
            <div className="surface p-6 sticky top-24">
              <h2 className="text-lg font-bold text-[#1a3a52] mb-1">New Request</h2>
              <p className="text-xs text-slate-500 mb-6 pb-4 border-b border-gray-100">Submit a new fabrication order or consultation ticket.</p>
              
              {formSuccess && (
                <div className="mb-4 rounded bg-green-50 p-3 text-sm font-semibold text-green-800 border border-green-200">
                  {formSuccess}
                </div>
              )}
              {formError && (
                <div className="mb-4 rounded bg-red-50 p-3 text-sm font-semibold text-red-800 border border-red-200">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Request Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" checked={!isTicket} onChange={() => setIsTicket(false)} className="text-[#1a3a52] focus:ring-[#1a3a52]" />
                      Fabrication Order
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" checked={isTicket} onChange={() => setIsTicket(true)} className="text-[#1a3a52] focus:ring-[#1a3a52]" />
                      Consultation Ticket
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Short Title / Scope</label>
                  <input
                    required
                    type="text"
                    value={whatNeeded}
                    onChange={(e) => setWhatNeeded(e.target.value)}
                    className="w-full rounded border-gray-300 p-2.5 text-sm focus:border-[#1a3a52] focus:ring-[#1a3a52] border"
                    placeholder="e.g. SS Storage Tank 5000L"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Detailed Description</label>
                  <textarea
                    rows={4}
                    value={briefDetails}
                    onChange={(e) => setBriefDetails(e.target.value)}
                    className="w-full rounded border-gray-300 p-2.5 text-sm focus:border-[#1a3a52] focus:ring-[#1a3a52] border"
                    placeholder="Provide dimensions, materials, or issue details..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded bg-[#1a3a52] px-4 py-3 text-sm font-bold text-white hover:bg-[#0f1f2e] disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: List */}
          <div>
            <h2 className="text-xl font-black text-[#1a3a52] mb-4">Your Submissions</h2>
            
            {loading ? (
              <div className="flex justify-center py-10"><span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Loading...</span></div>
            ) : orders.length === 0 ? (
              <div className="surface p-12 text-center border-dashed border-2 bg-slate-50">
                <p className="text-slate-500 font-medium">You haven't submitted any requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="surface p-5 transition-shadow hover:shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${order.isTicket ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {order.isTicket ? 'Ticket' : 'Order'}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">#PEPL-O-{order.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#1a3a52] leading-tight">{order.whatNeeded}</h3>
                        <p className="text-xs text-slate-400 mt-1">Submitted {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                        {order.status === "PENDING" && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-2"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>

                    {order.employeeNotes && (
                      <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1">PEPL Feedback</p>
                        <p className="text-sm text-blue-900">{order.employeeNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING": return "bg-amber-50 text-amber-700 border-amber-200";
    case "IN_PROGRESS": return "bg-blue-50 text-blue-700 border-blue-200";
    case "APPROVED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "COMPLETED": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "REJECTED": case "CANNOT_BE_DONE": return "bg-red-50 text-red-700 border-red-200";
    case "CANCELLED": return "bg-gray-50 text-gray-700 border-gray-200";
    case "FORWARDED_TO_SENIOR": return "bg-purple-50 text-purple-700 border-purple-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}
