"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

type Order = {
  id: number; whatNeeded: string; isTicket: boolean; status: string;
  createdAt: string; employeeNotes?: string | null;
  supplier: { name: string; email: string };
};

type Quote = {
  id: number; pricePerUnit: number; notes?: string | null; status: string;
  supplier: { id: number; name: string; email: string };
};

type BuyOrderItem = {
  id: number; productName: string; quantity: number; unit: string;
  specification?: string | null; quotes: Quote[];
};

type BuyOrderSheet = {
  id: number; title: string; description?: string | null;
  status: string; uploadedBy: string; createdAt: string; items: BuyOrderItem[];
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800", IN_PROGRESS: "bg-blue-100 text-blue-800",
  APPROVED: "bg-emerald-100 text-emerald-800", COMPLETED: "bg-indigo-100 text-indigo-800",
  REJECTED: "bg-red-100 text-red-800", CANCELLED: "bg-gray-100 text-gray-600",
  FORWARDED_TO_SENIOR: "bg-purple-100 text-purple-800", CANNOT_BE_DONE: "bg-rose-100 text-rose-800",
};

export default function EmployeeDashboard() {
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "procurement">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [sheets, setSheets] = useState<BuyOrderSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("employee");
    if (!saved) { router.push("/employee-login"); return; }
    setEmployee(JSON.parse(saved));
    fetchOrders();
    fetchSheets();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/employee/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchSheets = async () => {
    try {
      const res = await fetch("/api/employee/buy-orders");
      const data = await res.json();
      if (data.success) setSheets(data.sheets);
    } catch (e) { console.error(e); }
  };

  const updateOrder = async (orderId: number, status: string, notes: string) => {
    const res = await fetch("/api/employee/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status, employeeNotes: notes }),
    });
    const data = await res.json();
    if (data.success) fetchOrders(); else alert(data.message);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) return;
    setUploading(true); setUploadResult("");
    const fd = new FormData();
    fd.append("file", uploadFile);
    fd.append("title", uploadTitle);
    fd.append("description", uploadDesc);
    fd.append("uploadedBy", employee?.name || "Staff");
    try {
      const res = await fetch("/api/employee/buy-orders", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setUploadResult(`✅ Uploaded! ${data.sheet.items.length} items created.`);
        setUploadTitle(""); setUploadDesc(""); setUploadFile(null);
        if (fileRef.current) fileRef.current.value = "";
        fetchSheets();
      } else { setUploadResult("❌ " + data.message); }
    } catch { setUploadResult("❌ Upload failed."); } finally { setUploading(false); }
  };

  const confirmQuote = async (quoteId: number) => {
    if (!confirm("Confirm this quote? All other suppliers for this item will be marked as Outbid and notified by email.")) return;
    const res = await fetch("/api/employee/confirm-quote", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId }),
    });
    const data = await res.json();
    if (data.success) { fetchSheets(); } else { alert(data.message); }
  };

  if (!employee) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-[#d41f3d]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Internal Operations</span>
            </div>
            <h1 className="text-3xl font-black text-[#1a3a52]">Staff Portal</h1>
            <p className="mt-1 text-sm text-slate-500">Logged in as {employee.name}</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === "orders" ? "bg-[#1a3a52] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                Orders
              </button>
              <button onClick={() => setActiveTab("procurement")} className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === "procurement" ? "bg-[#1a3a52] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                Procurement
              </button>
            </div>
            <button onClick={() => { localStorage.removeItem("employee"); router.push("/"); }}
              className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        {activeTab === "orders" && (
          <div className="space-y-6 max-w-5xl">
            {loading ? (
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center py-10">Loading...</p>
            ) : orders.length === 0 ? (
              <p className="text-center py-10 text-slate-500">No orders found.</p>
            ) : (
              orders.map(order => <OrderCard key={order.id} order={order} onUpdate={updateOrder} statusColor={STATUS_COLOR} />)
            )}
          </div>
        )}

        {activeTab === "procurement" && (
          <div className="max-w-5xl space-y-8">
            {/* Upload Section */}
            <div className="surface p-6 md:p-8">
              <h2 className="text-xl font-black text-[#1a3a52] mb-1">Upload Procurement Sheet</h2>
              <p className="text-sm text-slate-500 mb-6">Upload an Excel file (.xlsx) with columns: <strong>Product Name</strong>, <strong>Quantity</strong>, <strong>Unit</strong>, <strong>Specification</strong></p>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Round Title *</label>
                    <input type="text" required value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
                      placeholder="e.g. June 2025 Steel Purchase"
                      className="w-full rounded border border-gray-300 p-2.5 text-sm focus:border-[#1a3a52] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                    <input type="text" value={uploadDesc} onChange={e => setUploadDesc(e.target.value)}
                      placeholder="Optional notes"
                      className="w-full rounded border border-gray-300 p-2.5 text-sm focus:border-[#1a3a52] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Excel File (.xlsx) *</label>
                  <input ref={fileRef} type="file" accept=".xlsx,.xls" required
                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full rounded border border-gray-300 p-2 text-sm focus:border-[#1a3a52] outline-none" />
                </div>
                {uploadResult && (
                  <p className={`text-sm font-semibold p-3 rounded ${uploadResult.startsWith("✅") ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                    {uploadResult}
                  </p>
                )}
                <button type="submit" disabled={uploading}
                  className="bg-[#1a3a52] text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-[#0f1f2e] disabled:opacity-50 transition-colors">
                  {uploading ? "Uploading..." : "Upload & Publish"}
                </button>
              </form>
            </div>

            {/* Procurement Rounds */}
            <div>
              <h2 className="text-xl font-black text-[#1a3a52] mb-4">Active Procurement Rounds</h2>
              {sheets.length === 0 ? (
                <p className="text-center py-8 text-slate-500 surface">No procurement rounds yet. Upload a sheet above.</p>
              ) : (
                sheets.map(sheet => (
                  <div key={sheet.id} className="surface mb-4 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 bg-[#1a3a52] text-white">
                      <div>
                        <p className="font-bold">{sheet.title}</p>
                        {sheet.description && <p className="text-xs text-slate-300 mt-0.5">{sheet.description}</p>}
                      </div>
                      <div className="text-right text-xs text-slate-300">
                        <p>By {sheet.uploadedBy}</p>
                        <p>{new Date(sheet.createdAt).toLocaleDateString()}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sheet.status === "OPEN" ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"}`}>{sheet.status}</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {sheet.items.map(item => (
                        <div key={item.id} className="px-6 py-4">
                          <div className="flex flex-wrap justify-between gap-2 mb-3">
                            <div>
                              <p className="font-bold text-[#1a3a52]">{item.productName}</p>
                              <p className="text-xs text-slate-500">Qty: {item.quantity} {item.unit} {item.specification && `• Spec: ${item.specification}`}</p>
                            </div>
                            <span className="text-xs text-slate-400">{item.quotes.length} quote{item.quotes.length !== 1 ? "s" : ""}</span>
                          </div>
                          {item.quotes.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">No quotes yet</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b">
                                    <th className="text-left py-2 font-bold">Rank</th>
                                    <th className="text-left py-2 font-bold">Supplier</th>
                                    <th className="text-left py-2 font-bold">Price / Unit</th>
                                    <th className="text-left py-2 font-bold">Notes</th>
                                    <th className="text-left py-2 font-bold">Status</th>
                                    <th className="text-left py-2 font-bold">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.quotes.map((q, idx) => (
                                    <tr key={q.id} className={`border-b last:border-0 ${idx === 0 ? "bg-emerald-50" : ""}`}>
                                      <td className="py-2 font-black text-slate-500">#{idx + 1}</td>
                                      <td className="py-2">
                                        <p className="font-semibold text-[#1a3a52]">{q.supplier.name || q.supplier.email}</p>
                                        <p className="text-[11px] text-slate-400">{q.supplier.email}</p>
                                      </td>
                                      <td className="py-2 font-black text-lg text-[#1a3a52]">₹{q.pricePerUnit.toFixed(2)}<span className="text-xs font-medium text-slate-400">/{item.unit}</span></td>
                                      <td className="py-2 text-slate-500 text-xs max-w-[150px]">{q.notes || "—"}</td>
                                      <td className="py-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${q.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : q.status === "OUTBID" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                                          {q.status}
                                        </span>
                                      </td>
                                      <td className="py-2">
                                        {q.status === "PENDING" && idx === 0 && (
                                          <button onClick={() => confirmQuote(q.id)}
                                            className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-700 transition-colors whitespace-nowrap">
                                            ✓ Confirm Order
                                          </button>
                                        )}
                                        {q.status === "CONFIRMED" && <span className="text-emerald-600 font-bold text-xs">✓ Confirmed</span>}
                                        {q.status === "OUTBID" && <span className="text-red-400 text-xs">Outbid</span>}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function OrderCard({ order, onUpdate, statusColor }: {
  order: Order; statusColor: Record<string, string>;
  onUpdate: (id: number, s: string, n: string) => void;
}) {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.employeeNotes || "");
  const [updating, setUpdating] = useState(false);

  return (
    <div className="surface p-6 border-l-4 border-l-[#1a3a52]">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${order.isTicket ? "bg-indigo-100 text-indigo-800" : "bg-emerald-100 text-emerald-800"}`}>
              {order.isTicket ? "Ticket" : "Order"}
            </span>
            <span className="text-xs text-slate-500 font-mono">#PEPL-O-{order.id}</span>
          </div>
          <h3 className="text-lg font-bold text-[#1a3a52]">{order.whatNeeded}</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded border border-gray-100">
            <div><p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Supplier</p><p className="font-semibold text-slate-700">{order.supplier.name}</p></div>
            <div><p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact</p><p className="font-semibold text-slate-700 break-all">{order.supplier.email}</p></div>
            <div><p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date Submitted</p><p className="font-semibold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</p></div>
          </div>
        </div>
        <div className="w-full md:w-72 space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Update Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full text-sm rounded border border-gray-300 p-2 focus:ring-[#1a3a52]">
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="FORWARDED_TO_SENIOR">Forward to Senior</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Feedback / Notes</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Will be emailed to supplier..."
              className="w-full text-sm rounded border border-gray-300 p-2 focus:ring-[#1a3a52]" />
          </div>
          <button onClick={async () => { setUpdating(true); await onUpdate(order.id, status, notes); setUpdating(false); }}
            disabled={updating || (status === order.status && notes === (order.employeeNotes || ""))}
            className="w-full bg-[#1a3a52] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#0f1f2e] disabled:opacity-50 transition-colors">
            {updating ? "Saving..." : "Save & Notify"}
          </button>
        </div>
      </div>
    </div>
  );
}
