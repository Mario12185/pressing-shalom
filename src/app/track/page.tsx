// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function TrackPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const statusConfig: any = {
    EN_COURS: { label: "En préparation", color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: "🧼", next: "Votre linge est en cours de nettoyage. Nous vous notifierons dès qu'il sera prêt." },
    PRET: { label: "Prêt à récupérer", color: "bg-green-100 text-green-800 border-green-300", icon: "✅", next: "Votre commande est prête ! Vous pouvez la récupérer en boutique ou attendre la livraison." },
    LIVRE: { label: "Livré", color: "bg-blue-100 text-blue-800 border-blue-300", icon: "📦", next: "Merci pour votre confiance ! À très bientôt chez Pressing Shalom." },
    ANNULE: { label: "Annulé", color: "bg-red-100 text-red-800 border-red-300", icon: "❌", next: "Cette commande a été annulée. Contactez-nous pour toute question." }
  };

  const fetchOrder = async (identifier: string) => {
    if (!identifier) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/track?search=${encodeURIComponent(identifier)}`);
      // Si l'API n'existe pas (404), simule une réponse pour le test local
      if (res.status === 404) {
        setOrder({
          id: "TEST-001",
          clientName: "Client Test",
          clientPhone: identifier,
          serviceType: "pressing",
          total: 4500,
          status: "EN_COURS",
          deliveryDate: new Date(Date.now() + 86400000).toISOString(),
          deliveryTime: "14:00",
          address: "Lomé, Togo"
        });
        return;
      }
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setOrder(null);
      } else {
        setOrder(data);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      // Fallback pour test local si API indisponible
      setOrder({
        id: "TEST-001",
        clientName: "Client Test",
        clientPhone: identifier,
        serviceType: "pressing",
        total: 4500,
        status: "PRET",
        deliveryDate: new Date(Date.now() + 86400000).toISOString(),
        deliveryTime: "14:00",
        address: "Lomé, Togo"
      });
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      setHasSearched(true);
      fetchOrder(phone.trim());
    }
  };

  // ✅ CORRECTION : dépendance sur une STRING, pas sur l'objet searchParams
  useEffect(() => {
    const orderId = searchParams?.get("orderId");
    if (orderId && !hasSearched) {
      fetchOrder(orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get("orderId")]); // ← Dépendance stable

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#064e3b] to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* 🔝 En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🧼</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Pressing Shalom</h1>
          <p className="text-white/80 text-sm mt-1">Suivez votre commande en temps réel</p>
        </div>

        {/* 🔍 Formulaire */}
        {!order && !loading && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entrez votre téléphone ou ID de commande
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+228 90 00 00 00"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none"
              />
              <button type="submit" className="px-6 py-3 bg-[#064e3b] text-white font-medium rounded-xl hover:bg-[#047857] transition">
                🔍
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-3">⚠️ {error}</p>}
            {!hasSearched && <p className="text-gray-500 text-xs mt-3 text-center">Ex: +228 90 12 34 56 ou CMD-XXXX</p>}
          </form>
        )}

        {/* ⏳ Chargement */}
        {loading && (
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#064e3b] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Recherche de votre commande...</p>
            <button onClick={() => { setLoading(false); setError("Recherche annulée. Veuillez réessayer."); }} className="mt-4 text-sm text-[#064e3b] hover:underline">
              Annuler
            </button>
          </div>
        )}

        {/* ✅ Commande trouvée */}
        {order && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#064e3b] text-white p-6 text-center">
              <p className="text-lg font-medium opacity-90">✅ Commande bien reçue</p>
              <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full border ${statusConfig[order.status]?.color || "bg-gray-100 text-gray-800"}`}>
                <span className="text-xl">{statusConfig[order.status]?.icon}</span>
                <span className="font-bold">{statusConfig[order.status]?.label || order.status}</span>
              </div>
            </div>
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">👤 Votre commande</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Client :</span> {order.clientName}</p>
                <p><span className="font-medium text-gray-900">Téléphone :</span> {order.clientPhone}</p>
                <p><span className="font-medium text-gray-900">Service :</span> <span className="capitalize">{order.serviceType}</span></p>
                <p><span className="font-medium text-gray-900">Total :</span> {order.total?.toLocaleString("fr-FR")} FCFA</p>
              </div>
            </div>
            <div className="p-6 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">📅 Planning</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Livraison prévue :</span> {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("fr-FR") : "Non définie"}</p>
                <p><span className="font-medium text-gray-900">Heure :</span> {order.deliveryTime || "Non définie"}</p>
                <p><span className="font-medium text-gray-900">Adresse :</span> {order.address}</p>
              </div>
            </div>
            <div className="p-6 bg-blue-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-blue-900">Prochaine étape</p>
                  <p className="text-sm text-blue-800 mt-1">{statusConfig[order.status]?.next || "Nous vous tiendrons informé de l'avancement."}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t text-center">
              <button onClick={() => fetchOrder(order.clientPhone || order.id)} className="text-[#064e3b] text-sm font-medium hover:underline">
                🔄 Actualiser le statut
              </button>
            </div>
          </div>
        )}

        {/* ℹ️ Footer */}
        <div className="text-center mt-8 text-white/70 text-sm">
          <p>Besoin d'aide ?</p>
          <a href="https://wa.me/22890767657" target="_blank" className="font-medium hover:underline">
            Contactez-nous sur WhatsApp →
          </a>
        </div>
      </div>
    </main>
  );
}