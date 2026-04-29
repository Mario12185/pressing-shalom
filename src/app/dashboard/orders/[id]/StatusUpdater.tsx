"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = ["EN_COURS", "PRET", "LIVRE", "ANNULE"];
const getStatusColor = (status: string) => {
  const s = status.toUpperCase();
  if (s === "EN_COURS") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (s === "PRET") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "LIVRE") return "bg-blue-100 text-blue-800 border-blue-200";
  return "bg-red-100 text-red-800 border-red-200";
};

export function StatusUpdaterClient({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus?.toUpperCase() || "EN_COURS");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ✅ Attendre que le router soit prêt
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleUpdate = async (newStatus: string) => {
    if (!isReady) return;
    setLoading(true);
    try {
      // 🔄 Simulation API (remplace par ton endpoint réel)
      await new Promise(r => setTimeout(r, 300));
      setStatus(newStatus);
      router.refresh();
    } catch (err) {
      console.warn("⚠️ Échec mise à jour (démo)");
      setStatus(newStatus);
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) return <span className="text-xs text-gray-400">Chargement...</span>;

  return (
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>{status}</span>
      <select
        value={status}
        onChange={(e) => handleUpdate(e.target.value)}
        disabled={loading}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#064e3b] outline-none disabled:opacity-70"
      >
        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}