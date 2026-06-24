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
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    (async () => {
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
        setOrderSuccess(true);
        setOrderMsg("Order submitted successfully.");
        setNewOrder({ whatNeeded: "", dimensions: "", briefDetails: "", blueprintAvailable: false, isTicket: false });
        fetchOrders(supplier.id);
      } else {
        setOrderSuccess(false);
        setOrderMsg(data.message || "Failed to submit.");
      }
    } catch {
      setOrderSuccess(false);
      setOrderMsg("Failed to submit. Please try again.");
    } finally { setSubmittingOrder(false); }
  };

  if (!supplier) return null;

  const tabs = [
    { key: "orders", label: "My Orders" },
    { key: "market", label: "Market Board" },
    { key: "bids", label: "My Bids" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .market-sheet {
          animation: fadeUp 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .market-item {
          animation: fadeIn 0.28s ease both;
        }
        .market-item + .market-item {
          border-top: 1px solid #f1f5f9;
        }
        .quote-submit-btn {
          transition: background-color 0.15s ease, transform 0.12s ease;
        }
        .quote-submit-btn:hover:not(:disabled) {
          background-color: #b01830;
          transform: translateY(-1px);
        }
        .quote-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .price-field {
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .price-field:focus {
          border-color: #1a3a52;
          box-shadow: 0 0 0 3px rgba(26, 58, 82, 0.07);
          outline: none;
        }
        .note-field:focus {
          border-color: #1a3a52;
          outline: none;
        }
      `}</style>

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
            <div className="surface p-6 md:p-8">
              <h2 className="text-xl font-black text-[#1a3a52] mb-6">Submit a New Order / Consultation</h2>
              {orderMsg && (
                <p className={`mb-4 text-sm font-semibold p-3 rounded ${orderSuccess ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                  {orderMsg}
                </p>
              )}
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

            <div>
              <h2 className="text-xl font-black text-[#1a3a52] mb-4">Order History</h2>
              {loading ? <p className="text-slate-400 text-center py-8">Loading...</p> :
                orders.length === 0 ? <p className="text-slate-500 text-center py-8 surface">No orders submitted yet.</p> :
                orders.map(order => (
                  <div key={order.id} className="surface p-5 mb-3 border-t-2 border-t-[#1a3a52]">
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
            <div className="mb-8">
              <h2 className="text-xl font-black text-[#1a3a52]">Market Board</h2>
              <p className="text-sm text-slate-500 mt-1">Active procurement rounds from PEPPL. Submit your most competitive price to win the order.</p>
            </div>

            {sheets.length === 0 ? (
              <div className="surface py-16 text-center" style={{ animation: "fadeIn 0.3s ease both" }}>
                <p className="text-sm font-medium text-slate-400">No active procurement rounds.</p>
                <p className="text-sm text-slate-400 mt-1">New opportunities will appear here when published.</p>
              </div>
            ) : (
              sheets.map((sheet, si) => (
                <div
                  key={sheet.id}
                  className="market-sheet surface mb-5 overflow-hidden border border-slate-200"
                  style={{ animationDelay: `${si * 75}ms` }}
                >
                  {/* Sheet header */}
                  <div className="bg-[#1a3a52] px-6 py-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-bold text-white text-base leading-tight">{sheet.title}</p>
                        {sheet.description && (
                          <p className="text-slate-300 text-sm mt-1 leading-snug">{sheet.description}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-slate-300 text-xs">
                          {new Date(sheet.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {sheet.items.length} {sheet.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Line items */}
                  {sheet.items.map((item, ii) => {
                    const bestQuote = item.quotes[0];
                    const input = quoteInputs[item.id] || { price: "", notes: "" };
                    return (
                      <div
                        key={item.id}
                        className="market-item px-6 py-5"
                        style={{ animationDelay: `${si * 75 + (ii + 1) * 55}ms` }}
                      >
                        {/* Product info + current best */}
                        <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-[#1a3a52] text-base leading-snug">{item.productName}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                              <span className="text-xs text-slate-500">
                                Qty: <span className="font-semibold text-slate-700">{item.quantity} {item.unit}</span>
                              </span>
                              {item.specification && (
                                <span className="text-xs text-slate-500">
                                  Spec: <span className="font-semibold text-slate-700">{item.specification}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Current best — clean metric display, no badge box */}
                          <div className="text-right shrink-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Current Best</p>
                            {bestQuote ? (
                              <p className="font-mono text-xl font-bold text-[#1a3a52] leading-none tabular-nums">
                                ₹{bestQuote.pricePerUnit.toFixed(2)}
                                <span className="text-xs font-normal text-slate-400 ml-1">/{item.unit}</span>
                              </p>
                            ) : (
                              <p className="font-mono text-xl font-medium text-slate-300 leading-none select-none">—</p>
                            )}
                          </div>
                        </div>

                        {/* Quote form */}
                        <div className="flex flex-wrap gap-3 items-end pt-4 border-t border-slate-100">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                              Your Price (₹ per {item.unit})
                            </label>
                            <input
                              type="number" step="0.01" min="0" value={input.price}
                              onChange={e => setQuoteInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id] || { notes: "" }, price: e.target.value } }))}
                              placeholder="0.00"
                              className="price-field w-36 rounded border border-gray-200 px-3 py-2 text-sm font-bold"
                            />
                          </div>
                          <div className="flex-1 min-w-[180px]">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                              Note (Optional)
                            </label>
                            <input
                              type="text" value={input.notes}
                              onChange={e => setQuoteInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id] || { price: "" }, notes: e.target.value } }))}
                              placeholder="Lead time, brand, conditions, etc."
                              className="note-field w-full rounded border border-gray-200 px-3 py-2 text-sm transition-colors"
                            />
                          </div>
                          <button
                            onClick={() => submitQuote(item.id)}
                            disabled={submitting === item.id}
                            className="quote-submit-btn bg-[#d41f3d] text-white px-5 py-2 rounded text-sm font-bold disabled:opacity-50 whitespace-nowrap"
                          >
                            {submitting === item.id ? "Submitting..." : "Submit Quote"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
              <p className="text-center py-12 text-slate-500 surface">You haven't submitted any quotes yet. Visit the Market Board to get started.</p>
            ) : (
              <div className="space-y-3">
                {myQuotes.map(q => {
                  const bestPrice = q.item.quotes[0]?.pricePerUnit;
                  const isLeading = bestPrice != null && q.pricePerUnit <= bestPrice;
                  return (
                    <div key={q.id} className={`surface p-5 border-t-2 ${q.status === "CONFIRMED" ? "border-t-emerald-500" : q.status === "OUTBID" ? "border-t-red-400" : isLeading ? "border-t-amber-400" : "border-t-slate-200"}`}>
                      <div className="flex flex-wrap justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{q.item.sheet.title}</p>
                          <p className="font-bold text-[#1a3a52] text-base mt-0.5">{q.item.productName}</p>
                          <p className="text-xs text-slate-500">Required: {q.item.quantity} {q.item.unit}</p>
                          {q.notes && <p className="text-xs text-slate-500 italic mt-1">"{q.notes}"</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-[#1a3a52] font-mono tabular-nums">
                            ₹{q.pricePerUnit.toFixed(2)}
                            <span className="text-xs font-medium text-slate-400 font-sans">/{q.item.unit}</span>
                          </p>
                          <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-3 py-1 rounded-full ${STATUS_COLORS[q.status] || "bg-gray-100 text-gray-600"}`}>
                            {q.status}
                          </span>
                          {q.status === "OUTBID" && bestPrice != null && (
                            <p className="text-xs text-red-500 font-semibold mt-1">Winning: ₹{bestPrice.toFixed(2)}/{q.item.unit}</p>
                          )}
                          {q.status === "PENDING" && isLeading && (
                            <p className="text-xs text-amber-600 font-semibold mt-1">Leading bid</p>
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
