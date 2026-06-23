"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

type Supplier = { id: number; email: string; name?: string };

type BestQuote = { pricePerUnit: number; status: string } | null;

type BuyOrderItem = {
  id: number; productName: string; quantity: number; unit: string;
  specification?: string | null; quotes: BestQuote[];
};

type BuyOrderSheet = {
  id: number; title: string; description?: string | null; createdAt: string;
  items: BuyOrderItem[];
};

type MyQuote = {
  id: number; pricePerUnit: number; notes?: string | null; status: string; createdAt: string;
  item: {
    productName: string; quantity: number; unit: string;
    sheet: { title: string };
    quotes: { pricePerUnit: number }[];
  };
};

type Order = {
  id: number; whatNeeded: string; isTicket: boolean; status: string; createdAt: string; employeeNotes?: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800", IN_PROGRESS: "bg-blue-100 text-blue-800",
  APPROVED: "bg-emerald-100 text-emerald-800", COMPLETED: "bg-indigo-100 text-indigo-800",
  REJECTED: "bg-red-100 text-red-800", CANCELLED: "bg-gray-100 text-gray-600",
  FORWARDED_TO_SENIOR: "bg-purple-100 text-purple-800", CANNOT_BE_DONE: "bg-rose-100 text-rose-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800", OUTBID: "bg-red-100 text-red-700",
};

export default function SupplierDashboard() {
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "market" | "bids">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [sheets, setSheets] = useState<BuyOrderSheet[]>([]);
  const [myQuotes, setMyQuotes] = useState<MyQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteInputs, setQuoteInputs] = useState<Record<number, { price: string; notes: string }>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [newOrder, setNewOrder] = useState({ whatNeeded: "", dimensions: "", briefDetails: "", blueprintAvailable: false, isTicket: false });
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderMsg, setOrderMsg] = useState("");

  useEffect(() => {
    (async () => {
      // Identity comes from the secure unified-account session cookie.
      const res = await fetch("/api/careers/me");
      const data = await res.json();
      if (!data.authenticated) { router.push("/login"); return; }
      setSupplier(data.applicant);
      fetchOrders(data.applicant.id);
      fetchMarket();
      fetchMyQuotes(data.applicant.id);
    })();
  }, [router]);

  const fetchOrders = async (id: number) => {
    try {
      const res = await fetch(`/api/orders?supplierId=${id}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) {} finally { setLoading(false); }
  };

  const fetchMarket = async () => {
    try {
      const res = await fetch("/api/buy-orders");
      const data = await res.json();
      if (data.success) setSheets(data.sheets);
    } catch (e) {}
  };

  const fetchMyQuotes = async (id: number) => {
    try {
      const res = await fetch(`/api/quotes?supplierId=${id}`);
      const data = await res.json();
      if (data.success) setMyQuotes(data.quotes);
    } catch (e) {}
  };

  const submitQuote = async (itemId: number) => {
    if (!supplier) return;
    const input = quoteInputs[itemId];
    if (!input?.price || isNaN(parseFloat(input.price))) {
      alert("Please enter a valid price."); return;
    }
    setSubmitting(itemId);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, supplierId: supplier.id, pricePerUnit: parseFloat(input.price), notes: input.notes }),
      });
      const data = await res.json();
      if (data.success) {
        setQuoteInputs(prev => ({ ...prev, [itemId]: { price: "", notes: "" } }));
        fetchMarket(); fetchMyQuotes(supplier.id);
      } else { alert(data.message); }
    } catch { alert("Failed to submit quote."); } finally { setSubmitting(null); }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;
    setSubmittingOrder(true); setOrderMsg("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId: supplier.id, ...newOrder }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderMsg("✅ Order submitted successfully!");
        setNewOrder({ whatNeeded: "", dimensions: "", briefDetails: "", blueprintAvailable: false, isTicket: false });
        fetchOrders(supplier.id);
      } else { setOrderMsg("❌ " + data.message); }
    } catch { setOrderMsg("❌ Failed to submit."); } finally { setSubmittingOrder(false); }
  };

  if (!supplier) return null;

  const tabs = [
    { key: "orders", label: "My Orders" },
    { key: "market", label: "🏪 Market Board" },
    { key: "bids", label: "My Bids" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-[#d41f3d]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Supplier Portal</span>
            </div>
            <h1 className="text-3xl font-black text-[#1a3a52]">Welcome, {supplier.name || supplier.email}</h1>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === t.key ? "bg-[#1a3a52] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={async () => { await fetch("/api/careers/logout", { method: "POST" }).catch(() => {}); window.dispatchEvent(new Event("account-auth-change")); router.push("/"); }}
              className="text-sm font-bold text-red-600 hover:text-red-800">Sign Out</button>
          </div>
        </div>

        {/* MY ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="max-w-5xl space-y-6">
            {/* Submit Order Form */}
            <div className="surface p-6 md:p-8">
              <h2 className="text-xl font-black text-[#1a3a52] mb-6">Submit a New Order / Consultation</h2>
              {orderMsg && <p className={`mb-4 text-sm font-semibold p-3 rounded ${orderMsg.startsWith("✅") ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{orderMsg}</p>}
              <form onSubmit={submitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">What is needed? *</label>
                  <textarea rows={3} required value={newOrder.whatNeeded} onChange={e => setNewOrder(p => ({ ...p, whatNeeded: e.target.value }))}
                    placeholder="Describe the product or service you need..." className="w-full rounded border border-gray-300 p-2.5 text-sm outline-none focus:border-[#1a3a52]" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Dimensions / Specifications</label>
                    <input type="text" value={newOrder.dimensions} onChange={e => setNewOrder(p => ({ ...p, dimensions: e.target.value }))}
                      placeholder="e.g. 2 inch, Schedule 40" className="w-full rounded border border-gray-300 p-2.5 text-sm outline-none focus:border-[#1a3a52]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Additional Details</label>
                    <input type="text" value={newOrder.briefDetails} onChange={e => setNewOrder(p => ({ ...p, briefDetails: e.target.value }))}
                      placeholder="Delivery requirements, etc." className="w-full rounded border border-gray-300 p-2.5 text-sm outline-none focus:border-[#1a3a52]" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={newOrder.blueprintAvailable} onChange={e => setNewOrder(p => ({ ...p, blueprintAvailable: e.target.checked }))} className="w-4 h-4" />
                    Blueprint Available
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={newOrder.isTicket} onChange={e => setNewOrder(p => ({ ...p, isTicket: e.target.checked }))} className="w-4 h-4" />
                    This is a Consultation Request
                  </label>
                </div>
                <button type="submit" disabled={submittingOrder}
                  className="bg-[#1a3a52] text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-[#0f1f2e] disabled:opacity-50 transition-colors">
                  {submittingOrder ? "Submitting..." : "Submit Order"}
                </button>
              </form>
            </div>

            {/* Order History */}
            <div>
              <h2 className="text-xl font-black text-[#1a3a52] mb-4">Order History</h2>
              {loading ? <p className="text-slate-400 text-center py-8">Loading...</p> :
                orders.length === 0 ? <p className="text-slate-500 text-center py-8 surface">No orders submitted yet.</p> :
                orders.map(order => (
                  <div key={order.id} className="surface p-5 mb-3 border-l-4 border-l-[#1a3a52]">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${order.isTicket ? "bg-indigo-100 text-indigo-800" : "bg-emerald-100 text-emerald-800"}`}>
                            {order.isTicket ? "Ticket" : "Order"}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">#PEPPL-O-{order.id}</span>
                        </div>
                        <p className="font-bold text-[#1a3a52]">{order.whatNeeded}</p>
                        {order.employeeNotes && (
                          <p className="text-sm text-slate-600 mt-1 italic border-l-2 border-amber-400 pl-2">"{order.employeeNotes}"</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-block text-[10px] font-bold uppercase px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* MARKET BOARD TAB */}
        {activeTab === "market" && (
          <div className="max-w-5xl">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#1a3a52]">Market Board</h2>
              <p className="text-sm text-slate-500 mt-1">Open procurement rounds from PEPPL. Submit your best price to win the order.</p>
            </div>
            {sheets.length === 0 ? (
              <p className="text-center py-12 text-slate-500 surface">No open procurement rounds at the moment. Check back soon!</p>
            ) : (
              sheets.map(sheet => (
                <div key={sheet.id} className="surface mb-6 overflow-hidden">
                  <div className="bg-[#1a3a52] px-6 py-4 text-white flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{sheet.title}</p>
                      {sheet.description && <p className="text-sm text-slate-300 mt-0.5">{sheet.description}</p>}
                    </div>
                    <p className="text-xs text-slate-300">{new Date(sheet.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {sheet.items.map(item => {
                      const bestQuote = item.quotes[0];
                      const input = quoteInputs[item.id] || { price: "", notes: "" };
                      return (
                        <div key={item.id} className="p-6">
                          <div className="flex flex-wrap gap-4 justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-[#1a3a52] text-base">{item.productName}</h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Required: <strong>{item.quantity} {item.unit}</strong>
                                {item.specification && <> · Spec: <strong>{item.specification}</strong></>}
                              </p>
                            </div>
                            {/* Current Best Quote Badge */}
                            {bestQuote ? (
                              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                                <span className="text-amber-500 text-lg">🏆</span>
                                <div>
                                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Current Best</p>
                                  <p className="text-lg font-black text-amber-800">₹{bestQuote.pricePerUnit.toFixed(2)}<span className="text-xs font-medium">/{item.unit}</span></p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                                <span className="text-blue-400 text-lg">⭐</span>
                                <div>
                                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">No Quotes Yet</p>
                                  <p className="text-sm font-bold text-blue-800">Be the first to bid!</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Quote Input */}
                          <div className="flex flex-wrap gap-3 items-end bg-slate-50 p-4 rounded-lg border border-gray-100">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Your Price (₹ per {item.unit})</label>
                              <input type="number" step="0.01" min="0" value={input.price}
                                onChange={e => setQuoteInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id] || { notes: "" }, price: e.target.value } }))}
                                placeholder="Enter your price"
                                className="w-40 rounded border border-gray-300 p-2 text-sm font-bold outline-none focus:border-[#1a3a52]" />
                            </div>
                            <div className="flex-1 min-w-[180px]">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Note (Optional)</label>
                              <input type="text" value={input.notes}
                                onChange={e => setQuoteInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id] || { price: "" }, notes: e.target.value } }))}
                                placeholder="Delivery time, brand, etc."
                                className="w-full rounded border border-gray-300 p-2 text-sm outline-none focus:border-[#1a3a52]" />
                            </div>
                            <button onClick={() => submitQuote(item.id)} disabled={submitting === item.id}
                              className="bg-[#d41f3d] text-white px-5 py-2 rounded text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-colors whitespace-nowrap">
                              {submitting === item.id ? "Submitting..." : "Submit Quote"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MY BIDS TAB */}
        {activeTab === "bids" && (
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#1a3a52]">My Bids</h2>
              <p className="text-sm text-slate-500 mt-1">All quotes you have submitted. You can update a Pending quote by re-submitting from the Market Board.</p>
            </div>
            {myQuotes.length === 0 ? (
              <p className="text-center py-12 text-slate-500 surface">You haven't submitted any quotes yet. Visit the Market Board to get started!</p>
            ) : (
              <div className="space-y-3">
                {myQuotes.map(q => {
                  const bestPrice = q.item.quotes[0]?.pricePerUnit;
                  const isLeading = bestPrice != null && q.pricePerUnit <= bestPrice;
                  return (
                    <div key={q.id} className={`surface p-5 border-l-4 ${q.status === "CONFIRMED" ? "border-l-emerald-500" : q.status === "OUTBID" ? "border-l-red-400" : isLeading ? "border-l-amber-400" : "border-l-slate-300"}`}>
                      <div className="flex flex-wrap justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{q.item.sheet.title}</p>
                          <p className="font-bold text-[#1a3a52] text-base mt-0.5">{q.item.productName}</p>
                          <p className="text-xs text-slate-500">Required: {q.item.quantity} {q.item.unit}</p>
                          {q.notes && <p className="text-xs text-slate-500 italic mt-1">"{q.notes}"</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-[#1a3a52]">₹{q.pricePerUnit.toFixed(2)}<span className="text-xs font-medium text-slate-400">/{q.item.unit}</span></p>
                          <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-3 py-1 rounded-full ${STATUS_COLORS[q.status] || "bg-gray-100 text-gray-600"}`}>
                            {q.status}
                          </span>
                          {q.status === "OUTBID" && bestPrice != null && (
                            <p className="text-xs text-red-500 font-semibold mt-1">Winning: ₹{bestPrice.toFixed(2)}/{q.item.unit}</p>
                          )}
                          {q.status === "PENDING" && isLeading && (
                            <p className="text-xs text-amber-600 font-semibold mt-1">🏆 You're Leading!</p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">{new Date(q.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
