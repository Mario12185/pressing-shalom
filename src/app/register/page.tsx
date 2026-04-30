"use client";
import { useState, useActionState } from "react";
import { registerAndOrder } from "./actions";
import Link from "next/link";

export default function RegisterPage() {
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(1500);
  const total = quantity * unitPrice;
  const [state, formAction, isPending] = useActionState(registerAndOrder, null);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#064e3b]">🧼 Créer mon compte & Commander</h1>
          <p className="text-gray-600 mt-2">Inscrivez-vous et passez votre première commande en 1 minute.</p>
        </div>

        {/* Formulaire */}
        <form action={formAction} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border space-y-6">
          
          {/* 👤 Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet *</label>
              <input name="name" required placeholder="Koffi Mensah" className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#064e3b] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone (WhatsApp) *</label>
              <input name="phone" type="tel" required placeholder="+228 90 00 00 00" className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#064e3b] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input name="email" type="email" required placeholder="votre@email.com" className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#064e3b] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
              <input name="password" type="password" required minLength={6} placeholder="Minimum 6 caractères" className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#064e3b] outline-none" />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 🧺 Commande */}
          <h3 className="font-semibold text-gray-900">📦 Détails de la commande</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service *</label>
              <select name="serviceType" required className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none">
                <option value="pressing">Pressing</option>
                <option value="blanchisserie">Blanchisserie</option>
                <option value="repassage">Repassage</option>
                <option value="nettoyage-sec">Nettoyage à sec</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantité *</label>
              <input type="number" name="quantity" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} required className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix unitaire (FCFA) *</label>
              <input type="number" name="unitPrice" min="0" value={unitPrice} onChange={(e) => setUnitPrice(parseInt(e.target.value) || 0)} required className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" />
            </div>
          </div>

          {/* 💰 Total */}
          <div className="bg-[#064e3b]/5 p-4 rounded-lg flex justify-between items-center">
            <span className="font-medium text-[#064e3b]">💰 Total estimé :</span>
            <span className="text-xl font-bold text-[#064e3b]">{total.toLocaleString("fr-FR")} FCFA</span>
          </div>
          <input type="hidden" name="total" value={total} />

          {/* 📍 Livraison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de livraison *</label>
              <input type="date" name="deliveryDate" required className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure de livraison *</label>
              <input type="time" name="deliveryTime" required className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse de livraison</label>
              <input name="address" placeholder="Quartier, repère..." className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" />
            </div>
          </div>

          {/* ✅ Bouton */}
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">️ {state.error}</div>
          )}
          
          <button type="submit" disabled={isPending} className="w-full py-4 bg-[#064e3b] text-white font-bold text-lg rounded-xl hover:bg-[#047857] transition disabled:opacity-50 shadow-lg">
            {isPending ? "⏳ Création en cours..." : "✅ Créer mon compte & Commander"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Déjà un compte ? <Link href="/login" className="text-[#064e3b] font-medium hover:underline">Se connecter</Link>
          </p>
        </form>
      </div>
    </main>
  );
}