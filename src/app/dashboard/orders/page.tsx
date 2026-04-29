"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 🎨 Thème
const THEME = {
  primary: "#064e3b",
  primaryHover: "#047857",
  secondary: "#722F37",
};

// 💰 Données de démo (24 commandes)
const DEMO_ORDERS = Array.from({ length: 24 }, (_, i) => ({
  id: `CMD-${String(i + 1).padStart(4, "0")}`,
  clientName: ["Koffi Mensah", "Ama Dossou", "Jean-Paul Adjo", "Fatou Diallo", "Michel Akakpo"][i % 5],
  clientPhone: `+228 9${i} ${12 + i} ${34 + i} ${56 + i}`,
  serviceId: ["pressing", "blanchisserie", "repassage", "nettoyage_sec", "couette"][i % 5],
  quantity: Math.floor(Math.random() * 5) + 1,
  total: (Math.floor(Math.random() * 20) + 5) * 1000,
  status: ["EN_COURS", "PRET", "LIVRE", "ANNULE"][i % 4],
  createdAt: new Date(Date.now() - i * 86400000),
}));

// 🔧 Helpers
const formatFCFA = (amount: number) => new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
const formatDate = (date: any) => new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const STATUS_OPTIONS = ["TOUS", "EN_COURS", "PRET", "LIVRE", "ANNULE"];

const getStatusStyle = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "EN_COURS") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (s === "PRET") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "LIVRE") return "bg-blue-100 text-blue-800 border-blue-200";
  if (s === "ANNULE") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

export default function OrdersListPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ✅ Sécurité router
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // 🔍 Filtrage intelligent
  const filteredOrders = useMemo(() => {
    let result = DEMO_ORDERS;
    if (statusFilter !== "TOUS") {
      result = result.filter(o => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o => 
        o.clientName.toLowerCase().includes(q) || 
        o.id.toLowerCase().includes(q) ||
        o.clientPhone.includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [search, statusFilter]);

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // 🔄 Reset page 1 si filtres changent
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#064e3b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#064e3b] transition">← Dashboard</Link>
            <h1 className="text-xl font-bold text-[#064e3b]">Commandes</h1>
          </div>
          <Link href="/dashboard/orders/new" className="px-4 py-2 text-sm font-semibold text-white bg-[#064e3b] rounded-lg hover:bg-[#047857] transition shadow-md">
            + Nouvelle commande
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* 🔍 Recherche & Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par client, ID ou téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064e3b] outline-none transition"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {STATUS_OPTIONS.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition whitespace-nowrap ${
                    statusFilter === status
                      ? "bg-[#064e3b] text-white border-[#064e3b]"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            {filteredOrders.length} résultat{filteredOrders.length > 1 ? "s" : ""} • Page {page}/{totalPages}
          </div>
        </div>

        {/* 📋 Tableau */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Service</th>
                  <th className="px-6 py-3 font-medium">Montant</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedOrders.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Aucune commande trouvée.</td></tr>
                ) : (
                  paginatedOrders.map(order => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gray-50/80 transition cursor-pointer group"
                      onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(-4)}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 group-hover:text-[#064e3b] transition">{order.clientName}</div>
                        <div className="text-xs text-gray-500">{order.clientPhone}</div>
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-700">{order.serviceId.replace("_", " ")}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatFCFA(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[#064e3b] font-medium transition group-hover:underline">Voir →</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 📄 Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  page === num ? "bg-[#064e3b] text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}