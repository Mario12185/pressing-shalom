"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// @ts-ignore
export default function AdminPage() {
  const {  session, status } = useSession() as any;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (session?.user?.role !== "admin") { router.push("/dashboard"); return; }
    fetchOrders();
  }, [status, session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, status: newStatus })
    });
    fetchOrders();
  };

  if (loading || status === "loading") return <div className="p-8 text-center">Chargement...</div>;
  if (status === "unauthenticated" || session?.user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">👨‍💼 Admin - PRESSING SHALOM</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Client</th>
              <th className="p-3">Service</th>
              <th className="p-3">Total</th>
              <th className="p-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-t">
                <td className="p-3 font-mono text-sm">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-3">{order.user?.name || "Inconnu"}</td>
                <td className="p-3 capitalize">{order.serviceType}</td>
                <td className="p-3 font-semibold text-teal-700">{order.total?.toLocaleString()} FCFA</td>
                <td className="p-3">
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="px-2 py-1 rounded border text-sm">
                    <option value="pending">En attente</option>
                    <option value="en cours">En cours</option>
                    <option value="livré">Livré</option>
                    <option value="annulé">Annulé</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="p-4 text-gray-500 text-center">Aucune commande</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}