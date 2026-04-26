"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const {  session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetch("/api/admin/orders").then(r => r.json()).then(d => setOrders(d.orders || [])).catch(() => {});
  }, [status]);

  if (status === "loading") return <div className="p-10 text-center">Chargement...</div>;
  if (status !== "authenticated" || session?.user?.role !== "admin") return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">👨‍💼 Admin</h1>
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100"><tr><th className="p-2">ID</th><th className="p-2">Client</th><th className="p-2">Total</th><th className="p-2">Statut</th></tr></thead>
          <tbody>
            {orders.map((o:any) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">#{o.id.slice(-6)}</td>
                <td className="p-2">{o.user?.name || "?"}</td>
                <td className="p-2">{o.total} FCFA</td>
                <td className="p-2 capitalize">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
