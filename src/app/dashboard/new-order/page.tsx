"use client";
import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "./actions";

export default function NewOrderPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(1500);
  const total = quantity * unitPrice;

  // ✅ Gestion propre de la Server Action (corrige l'erreur TypeScript)
  const [state, formAction, isPending] = useActionState(createOrder, null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🧺 Nouvelle Commande</h1>
      
      <form action={formAction} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
        {/* 👤 Infos Client */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email du client *</label>
            <input type="email" name="clientEmail" required placeholder="client@email.com" 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du client</label>
            <input type="text" name="clientName" placeholder="Ex: Koffi Mensah" 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input type="tel" name="clientPhone" placeholder="+228 90 00 00 00" 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
          </div>
        </div>

        {/* 🧼 Service & Prix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de service *</label>
            <select name="serviceType" required 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
              <option value="pressing">Pressing</option>
              <option value="blanchisserie">Blanchisserie</option>
              <option value="repassage">Repassage</option>
              <option value="nettoyage-sec">Nettoyage à sec</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantité *</label>
            <input type="number" name="quantity" min="1" value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} required 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix unitaire (FCFA) *</label>
            <input type="number" name="unitPrice" min="0" value={unitPrice} 
              onChange={(e) => setUnitPrice(parseInt(e.target.value) || 0)} required 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
          </div>
        </div>

        {/*  Total calculé automatiquement */}
        <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
          <span className="font-medium text-blue-800">💰 Total à payer :</span>
          <span className="text-xl font-bold text-blue-900">{total.toLocaleString("fr-FR")} FCFA</span>
        </div>
        <input type="hidden" name="total" value={total} />

        {/* 📦 Livraison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de livraison *</label>
            <input type="date" name="deliveryDate" required 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heure de livraison *</label>
            <input type="time" name="deliveryTime" required 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input type="text" name="address" placeholder="Lomé, Quartier..." 
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
          </div>
        </div>

        {/* ✅ Affichage des erreurs / succès */}
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ️ {state.error}
          </div>
        )}

        {/* 📤 Boutons */}
        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" disabled={isPending} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-50">
            {isPending ? "⏳ Enregistrement..." : "✅ Enregistrer la commande"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}