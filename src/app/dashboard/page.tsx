"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Phone, LogOut, Package, Calendar, MapPin, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const {  session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders")
        .then(res => res.json())
        .then(data => { setOrders(data.orders || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-600">Chargement...</p></div>;
  }
  
  if (status === "unauthenticated") { router.push("/login"); return null; }

  const userPhone = typeof window !== "undefined" ? localStorage.getItem("userPhone") : null;
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    "en cours": "bg-blue-100 text-blue-800",
    livré: "bg-green-100 text-green-800"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center"><span className="text-white font-bold">PS</span></div>
            <div><h1 className="font-semibold text-gray-900">PRESSING SHALOM</h1><p className="text-xs text-gray-500">Espace client</p></div>
          </div>
          <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"><LogOut size={16} /> Déconnexion</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-1">Bonjour, {session?.user?.name} 👋</h2>
          <p className="text-teal-100">Gérez vos commandes de pressing en toute simplicité</p>
        </div>

        {/* Profil */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mon profil</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500">Email</p><p className="font-medium text-gray-900 mt-1">{session?.user?.email}</p></div>
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
              <div className="flex items-center gap-2 text-teal-800"><Phone size={18} /><p className="text-sm font-medium">Téléphone</p></div>
              <p className="font-semibold text-gray-900 mt-2 ml-6">{userPhone || session?.user?.phone || <span className="text-gray-400 italic">Non renseigné</span>}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/commande" className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 transition"><Package className="text-teal-600 group-hover:text-white" size={24} /></div>
            <h4 className="font-semibold text-gray-900">Nouvelle commande</h4>
            <p className="text-sm text-gray-500 mt-1">Commandez un service de pressing</p>
          </Link>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4"><Calendar className="text-gray-600" size={24} /></div>
            <h4 className="font-semibold text-gray-900">Historique</h4>
            <p className="text-sm text-gray-500 mt-1">{orders.length} commande{orders.length>1?'s':''} au total</p>
          </div>
        </div>

        {/* Commandes */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Mes commandes</h3>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="mb-4">Aucune commande pour le moment</p>
              <Link href="/commande" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition">Passer ma première commande</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} className="p-4 border border-gray-100 rounded-xl hover:border-teal-200 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Commande #{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">{new Date(order.deliveryDate).toLocaleDateString('fr-FR')} • {order.deliveryTime === "matin" ? "8h-12h" : "14h-18h"}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {order.status === "pending" ? "En attente" : order.status === "en cours" ? "En cours" : "Livré"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={14} /> <span className="truncate max-w-[200px]">{order.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Package size={14} /> <span>{order.items?.length || 0} article{order.items?.length>1?'s':''} • {order.serviceType}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-lg font-bold text-teal-600">{order.total?.toLocaleString()} FCFA</span>
                    {order.status === "pending" && (
                      <button className="text-xs text-teal-600 hover:underline">Modifier</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badge WhatsApp */}
        {userPhone && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div><p className="text-green-800 font-medium">Notifications WhatsApp activées</p><p className="text-green-700 text-sm">Vous recevrez des mises à jour sur <strong>{userPhone}</strong></p></div>
          </div>
        )}
      </main>
    </div>
  );
}