"use client"; // ✅ Obligatoire pour onClick

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusUpdaterClient } from "./StatusUpdater";

// 🎨 Données de démo (remplace par Prisma plus tard)
const DEMO_ORDER = {
  id: "demo-123",
  clientName: "Koffi Mensah",
  clientPhone: "+228 90 12 34 56",
  clientAddress: "Lomé, Nyékonakpoè",
  serviceId: "pressing",
  quantity: 3,
  unitPrice: 1500,
  total: 4500,
  status: "EN_COURS",
  deliveryType: "pickup",
  notes: "Tache légère sur le col.",
  createdAt: new Date(),
  updatedAt: new Date()
};

const formatFCFA = (amount: number) => new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
const formatDate = (date: any) => date ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "Non défini";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  
  // ✅ Attendre que le router soit prêt
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const order = DEMO_ORDER; // 🔁 Remplace par ta logique Prisma plus tard
  const displayId = String(order?.id || params?.id || "inconnu").slice(0, 8);

  const getStatusStyle = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "EN_COURS") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s === "PRET") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (s === "LIVRE") return "bg-blue-100 text-blue-800 border-blue-200";
    if (s === "ANNULE") return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (!isReady) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/orders" className="text-sm text-gray-500 hover:text-[#064e3b] transition">← Commandes</Link>
            <h1 className="text-xl font-bold text-[#064e3b]">Commande #{displayId}</h1>
          </div>
          {/* Bouton Imprimer inline */}
          <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition print:hidden">
            🖨️ Imprimer
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{order.clientName}</h2>
            <p className="text-gray-500 text-sm">{order.clientPhone} • {order.clientAddress}</p>
          </div>
          <StatusUpdaterClient orderId={order.id} currentStatus={order.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#064e3b] border-b border-gray-200 pb-2 mb-4">Service & Montant</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Service :</span> <span className="font-medium capitalize">{order.serviceId}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Quantité :</span> <span className="font-medium">{order.quantity} unité(s)</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Prix unitaire :</span> <span className="font-medium">{formatFCFA(order.unitPrice)}</span></div>
              {order.deliveryType === "delivery" && <div className="flex justify-between"><span className="text-gray-600">Livraison :</span> <span className="font-medium text-emerald-600">+1 000 FCFA</span></div>}
              <div className="flex justify-between text-lg font-bold text-[#064e3b] pt-3 border-t border-gray-200">
                <span>Total :</span> <span>{formatFCFA(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#064e3b] border-b border-gray-200 pb-2 mb-4">Dates & Suivi</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Créée le :</span> <span className="font-medium">{formatDate(order.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Dernière modif :</span> <span className="font-medium">{formatDate(order.updatedAt)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Statut :</span>
                <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>{order.status}</span>
              </div>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#064e3b] border-b border-gray-200 pb-2 mb-3">Notes</h3>
            <p className="text-gray-700 leading-relaxed">{order.notes}</p>
          </div>
        )}
      </div>
    </main>
  );
}