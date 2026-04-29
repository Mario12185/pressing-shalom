"use client";
import { useState } from "react";

// ✅ Server Action intégrée directement dans ce fichier
async function trackOrder(query: string) {
  const res = await fetch("/api/track-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  return res.json();
}

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await trackOrder(query);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* 🎨 En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-3xl">🧼</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pressing Shalom</h1>
          <p className="text-gray-600 mt-1">Suivez votre commande en temps réel</p>
        </div>

        {/* 🔍 Formulaire de recherche */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-lg border mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre téléphone ou ID de commande
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="+228 90 00 00 00 ou CMD-..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "🔍..." : "Suivre"}
            </button>
          </div>
        </form>

        {/* ❌ Message d'erreur */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ⚠️ {result.error}
          </div>
        )}

        {/* ✅ Résultat de suivi */}
        {result?.success && result.order && (
          <div className="bg-white p-6 rounded-xl shadow-lg border animate-fade-in">
            {/* Statut principal */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${result.order.statusColor} mb-4`}>
              <span>{result.order.statusIcon}</span>
              <span>{result.order.status}</span>
            </div>

            {/* Détails */}
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Client</span>
                <span className="font-medium">{result.order.clientName}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Service</span>
                <span className="font-medium capitalize">{result.order.serviceType}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-blue-600">{result.order.total.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Livraison prévue</span>
                <span className="font-medium">{result.order.deliveryDate} à {result.order.deliveryTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Adresse</span>
                <span className="font-medium text-right">{result.order.address}</span>
              </div>
            </div>

            {/* Bouton WhatsApp */}
            <a
              href={`https://wa.me/22890000000?text=Bonjour, je souhaite des infos sur ma commande ${result.order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
            >
              💬 Contacter le pressing
            </a>
          </div>
        )}

        {/* ℹ️ Aide */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>💡 Astuce : Entrez le numéro de téléphone utilisé lors de la commande</p>
        </div>
      </div>
    </div>
  );
}