"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

type Order = {
  id: number;
  whatNeeded: string;
  isTicket: boolean;
  status: string;
  createdAt: string;
  employeeNotes?: string | null;
  supplier: { name: string; email: string };
};

export default function EmployeeDashboard() {
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("employee");
    if (!saved) {
      router.push("/employee-login");
    } else {
      setEmployee(JSON.parse(saved));
      fetchOrders();
    }
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/employee/orders`);
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

  const updateOrder = async (orderId: number, status: string, notes: string) => {
    try {
      const res = await fetch("/api/employee/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, employeeNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error updating order.");
    }
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
            <p className="mt-1 text-sm text-slate-500">Logged in as {employee.name} ({employee.role})</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem("employee"); router.push("/"); }}
            className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="space-y-6 max-w-5xl">
          {loading ? (
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center py-10">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center py-10 text-slate-500">No orders found.</p>
          ) : (
            orders.map(order => (
              <OrderCard key={order.id} order={order} onUpdate={updateOrder} />
            ))
          )}
        </div>
      </Container>
    </div>
  );
}

function OrderCard({ order, onUpdate }: { order: Order, onUpdate: (id: number, s: string, n: string) => void }) {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.employeeNotes || "");
  const [updating, setUpdating] = useState(false);

  const handleSave = async () => {
    setUpdating(true);
    await onUpdate(order.id, status, notes);
    setUpdating(false);
  };

  return (
    <div className="surface p-6 border-l-4 border-l-[#1a3a52]">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${order.isTicket ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {order.isTicket ? 'Ticket' : 'Order'}
            </span>
            <span className="text-xs text-slate-500 font-mono">#PEPL-O-{order.id}</span>
          </div>
          <h3 className="text-lg font-bold text-[#1a3a52]">{order.whatNeeded}</h3>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded border border-gray-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Supplier</p>
              <p className="font-semibold text-slate-700">{order.supplier.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact</p>
              <p className="font-semibold text-slate-700 break-all">{order.supplier.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date Submitted</p>
              <p className="font-semibold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm rounded border-gray-300 p-2 focus:ring-[#1a3a52]"
            >
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
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Will be emailed to supplier..."
              className="w-full text-sm rounded border-gray-300 p-2 focus:ring-[#1a3a52]"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={updating || (status === order.status && notes === (order.employeeNotes || ""))}
            className="w-full bg-[#1a3a52] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#0f1f2e] disabled:opacity-50 transition-colors"
          >
            {updating ? "Saving..." : "Save & Notify"}
          </button>
        </div>
      </div>
    </div>
  );
}
