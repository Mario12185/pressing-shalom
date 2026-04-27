"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, ArrowLeft, Check, Plus, Minus, Shirt, Droplets, Wind, MapPin, Calendar } from "lucide-react";

const SERVICES = [
  { id: "pressing", name: "Pressing à sec", icon: Shirt, price: 800, desc: "Costumes, robes, soie" },
  { id: "blanchisserie", name: "Blanchisserie", icon: Droplets, price: 400, desc: "Linge courant, draps" },
  { id: "repassage", name: "Repassage seul", icon: Wind, price: 200, desc: "Vous lavez, nous repassons" }
];

const ITEMS = [
  { id: "chemise", name: "Chemise", price: 1500 },
  { id: "pantalon", name: "Pantalon", price: 2000 },
  { id: "robe", name: "Robe", price: 2500 },
  { id: "drap", name: "Drap simple", price: 1200 },
  { id: "costume", name: "Costume complet", price: 5000 },
  { id: "couette", name: "Couette", price: 3500 }
];

export default function CommandePage() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [service, setService] = useState<string | null>(null);
  const [cart, setCart] = useState<{ id: string; name: string; qty: number }[]>([]);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("matin");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getServicePrice = () => SERVICES.find(s => s.id === service)?.price || 0;
  const getTotal = () => cart.reduce((sum, item) => {
    const base = ITEMS.find(i => i.id === item.id)?.price || 0;
    return sum + (base * item.qty);
  }, 0);

  const updateQty = (id: string, name: string, delta: number) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === id);
      if (exists) {
        const newQty = Math.max(0, exists.qty + delta);
        return newQty === 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, qty: newQty } : i);
      }
      if (delta > 0) return [...prev, { id, name, qty: 1 }];
      return prev;
    });
  };

   const handleSubmit = async () => {
  setLoading(true);
  try {
    // 1. Vérification des champs obligatoires
    if (!service || cart.length === 0 || !address || !date) {
      alert("❌ Veuillez remplir : Service, au moins 1 article, Adresse et Date");
      setLoading(false);
      return;
    }

    // 2. Récupérer la session NextAuth pour avoir userId ET email
    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();
    
    // 3. Préparer les données avec userId + userEmail (fallback)
    const payload = {
      serviceType: service,
      items: cart,
      address,
      deliveryDate: date,
      deliveryTime: time,
      userId: sessionData?.user?.id,       // ← NOUVEAU : ID utilisateur
      userEmail: sessionData?.user?.email  // ← NOUVEAU : Email en secours
    };

    console.log("📦 Envoi à l'API :", payload);

    // 4. Appel à l'API
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    
    if (res.ok) {
      alert("✅ " + data.message);
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("❌ " + (data.error || "Erreur lors de la commande"));
      // Afficher le debug si l'API en renvoie
      if (data.debug) console.log("🔍 Debug API:", data.debug);
    }
  } catch (err) {
    console.error("❌ Erreur handleSubmit:", err);
    alert("❌ Erreur de connexion au serveur");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center text-sm">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`flex items-center gap-2 ${step >= s ? "text-teal-600 font-medium" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${step > s ? "bg-teal-600 border-teal-600 text-white" : step === s ? "border-teal-600 text-teal-600" : "border-gray-300"}`}>
                  {step > s ? <Check size={12} /> : s}
                </div>
                <span className="hidden sm:inline">{s === 1 ? "Service" : s === 2 ? "Articles" : s === 3 ? "Créneau" : "Récap"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Choisissez votre service</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {SERVICES.map(s => (
                  <button key={s.id} onClick={() => setService(s.id)} className={`p-4 rounded-xl border-2 text-left transition ${service === s.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <s.icon className={`mb-2 ${service === s.id ? "text-teal-600" : "text-gray-500"}`} size={24} />
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                    <p className="text-sm font-bold text-teal-600 mt-2">{s.price.toLocaleString()} FCFA</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Ajoutez vos articles</h2>
              <div className="divide-y divide-gray-100">
                {ITEMS.map(item => {
                  const qty = cart.find(c => c.id === item.id)?.qty || 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price.toLocaleString()} FCFA / pièce</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                        <button onClick={() => updateQty(item.id, item.name, -1)} className="p-1 hover:bg-gray-200 rounded"><Minus size={16} /></button>
                        <span className="w-6 text-center font-medium">{qty}</span>
                        <button onClick={() => updateQty(item.id, item.name, 1)} className="p-1 hover:bg-gray-200 rounded"><Plus size={16} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-right text-lg font-bold text-teal-600">Total articles : {getTotal().toLocaleString()} FCFA</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Retrait / Livraison</h2>
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input type="text" placeholder="Adresse complète (quartier, rue, repère)" value={address} onChange={e => setAddress(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                  </div>
                  <select value={time} onChange={e => setTime(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none">
                    <option value="matin">🌅 Matin (8h-12h)</option>
                    <option value="apres-midi">☀️ Après-midi (14h-18h)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Récapitulatif</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Service</span><span className="font-medium">{SERVICES.find(s => s.id === service)?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Articles ({cart.reduce((a, b) => a + b.qty, 0)})</span><span className="font-medium">{getTotal().toLocaleString()} FCFA</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Adresse</span><span className="font-medium text-right max-w-[60%]">{address || "Non renseignée"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Créneau</span><span className="font-medium">{date} • {time === "matin" ? "8h-12h" : "14h-18h"}</span></div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-bold text-teal-600">
                  <span>Total</span><span>{(getTotal() + getServicePrice()).toLocaleString()} FCFA</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">💳 Paiement à la livraison ou via Mobile Money</p>
            </div>
          )}
        </div>

        {/* Navigation - CORRECTION ICI 👇 */}
        <div className="px-6 pb-6 flex justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : router.push("/dashboard")} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-700">
            <ArrowLeft size={18} /> {step === 1 ? "Annuler" : "Précédent"}
          </button>
          <button
            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
            // ✅ CORRECTION : ajout de (!address || !date) pour bloquer si la date est vide
            disabled={loading || (step === 1 && !service) || (step === 2 && cart.length === 0) || (step === 3 && (!address || !date))}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Enregistrement..." : step === 4 ? "Confirmer la commande" : "Continuer"} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}