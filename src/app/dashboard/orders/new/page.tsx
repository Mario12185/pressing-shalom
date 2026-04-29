"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 🎨 Couleurs du thème
const THEME = {
  primary: "#064e3b",
  primaryHover: "#047857",
  secondary: "#722F37",
  secondaryHover: "#5a252c",
  bg: "bg-gray-50",
  card: "bg-white",
};

// 💰 Services & tarifs (FCFA)
const SERVICES = [
  { id: "pressing", name: "Pressing (Chemise/Pantalon)", price: 1500 },
  { id: "blanchisserie", name: "Blanchisserie (Draps/Serviettes)", price: 2500 },
  { id: "repassage", name: "Repassage uniquement", price: 1000 },
  { id: "nettoyage_sec", name: "Nettoyage à sec (Costume/Robe)", price: 3500 },
  { id: "couette", name: "Couette / Edredon", price: 5000 },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    serviceId: "pressing",
    quantity: 1,
    notes: "",
    pickupDate: "",
    deliveryType: "pickup",
  });

  // ✅ Attendre que le router soit prêt (fix du bug Next.js)
  useEffect(() => {
    const timer = setTimeout(() => setIsRouterReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const selectedService = SERVICES.find(s => s.id === form.serviceId);
  const unitPrice = selectedService?.price || 0;
  const total = unitPrice * form.quantity + (form.deliveryType === "delivery" ? 1000 : 0);

  const formatFCFA = (amount: number) => 
    new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ Protection : ne pas soumettre si router pas prêt
    if (!isRouterReady) {
      setError("Chargement... Veuillez réessayer dans une seconde.");
      return;
    }
    
    setLoading(true);
    setError(null);

    if (!form.clientName || !form.clientPhone) {
      setError("Nom et téléphone du client sont obligatoires");
      setLoading(false);
      return;
    }

    try {
      // 🔄 Simulation API (remplace par ton endpoint réel)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log("✅ Commande créée (démo):", { ...form, total, unitPrice });
      
      // ✅ Redirection sécurisée
      if (isRouterReady) {
        router.push("/dashboard/orders");
        router.refresh();
      }
    } catch (err: any) {
      console.error("❌ Erreur:", err);
      setError(err.message || "Une erreur est survenue. Réessaye.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Affichage de chargement pendant l'init du router
  if (!isRouterReady) {
    return (
      <main className={`min-h-screen ${THEME.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#064e3b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${THEME.bg}`}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#064e3b] transition">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-[#064e3b]">Nouvelle Commande</h1>
          </div>
          <Link href="/dashboard/orders" className="px-4 py-2 text-sm font-medium text-white bg-[#722F37] rounded-lg hover:bg-[#5a252c] transition">
            Voir les commandes
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className={`${THEME.card} rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6`}>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* 👤 Client */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-[#064e3b] border-b border-gray-200 pb-2">Informations Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input type="text" name="clientName" value={form.clientName} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064e3b] outline-none" placeholder="Ex: Koffi Mensah" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input type="tel" name="clientPhone" value={form.clientPhone} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064e3b] outline-none" placeholder="+228 90 12 34 56" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de collecte</label>
              <input type="text" name="clientAddress" value={form.clientAddress} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064e3b] outline-none" placeholder="Lomé, Quartier..." />
            </div>
          </section>

          {/* 🧺 Service */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-[#064e3b] border-b border-gray-200 pb-2">Détails du Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de service *</label>
                <select name="serviceId" value={form.serviceId} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064e3b] outline-none bg-white">
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {formatFCFA(s.price)}/unité</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
                <input type="number" name="quantity" min="1" value={form.quantity} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064e3b] outline-none" />
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Prix unitaire :</span><span className="font-medium">{formatFCFA(unitPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Quantité :</span><span className="font-medium">{form.quantity}</span>
              </div>
              {form.deliveryType === "delivery" && (
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Livraison :</span><span className="font-medium">+1 000 FCFA</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[#064e3b] pt-2 border-t border-gray-200">
                <span>Total :</span><span>{formatFCFA(total)}</span>
              </div>
            </div>
          </section>

          {/* 📅 Livraison */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-[#064e3b] border-b border-gray-200 pb-2">Livraison</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="deliveryType" value="pickup" checked={form.deliveryType === "pickup"} onChange={handleChange} className="text-[#064e3b]" />
                <span className="text-sm text-gray-700">Collecte au pressing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="deliveryType" value="delivery" checked={form.deliveryType === "delivery"} onChange={handleChange} className="text-[#064e3b]" />
                <span className="text-sm text-gray-700">Livraison à domicile (+1000 FCFA)</span>
              </label>
            </div>
            {form.deliveryType === "delivery" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
                <input type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064e3b] outline-none" />
              </div>
            )}
          </section>

          {/* 📝 Notes */}
          <section>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064e3b] outline-none resize-none"
              placeholder="Ex: Tache de vin, pliage spécial..." />
          </section>

          {/* 🎯 Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <button type="submit" disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition shadow-md disabled:opacity-70 ${loading ? "bg-gray-400" : "bg-[#064e3b] hover:bg-[#047857]"}`}>
              {loading ? "Création..." : "✅ Créer la commande"}
            </button>
            <Link href="/dashboard/orders" className="px-6 py-3 rounded-lg font-semibold text-[#722F37] border border-[#722F37]/40 hover:bg-[#722F37]/10 transition text-center">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}