import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ClientSpace() {
  const session = await getServerSession(authOptions);
  
  // Sécurité : si admin, rediriger vers le dashboard
  if (!session || (session.user as any)?.role === "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border">
        {/* 👋 En-tête personnalisé */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#064e3b] rounded-full mb-4">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue, {(session.user as any)?.name || "Client"} !
          </h1>
          <p className="text-gray-600 mt-2">Votre espace personnel est prêt.</p>
        </div>

        {/* 📋 Instructions claires : "Que faire maintenant ?" */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-blue-900 mb-3">🧭 Que faire maintenant ?</h2>
          <ol className="space-y-3 text-blue-800 text-sm">
            <li className="flex items-start gap-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">1</span>
              <span><strong>Passez votre première commande</strong> en cliquant sur le bouton vert ci-dessous.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">2</span>
              <span><strong>Notez votre numéro de téléphone</strong> (+228...). C'est votre identifiant pour suivre vos colis.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">3</span>
              <span><strong>Revenez ici à tout moment</strong> pour voir vos commandes ou en passer de nouvelles.</span>
            </li>
          </ol>
        </div>

        {/* 🎯 Boutons d'action principaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link href="/register" className="flex items-center justify-center gap-2 px-6 py-4 bg-[#064e3b] text-white rounded-xl font-bold hover:bg-[#047857] transition shadow-md">
             Nouvelle Commande
          </Link>
          <Link href="/track" className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#064e3b] text-[#064e3b] rounded-xl font-bold hover:bg-gray-50 transition">
            🔍 Suivre un colis
          </Link>
        </div>

        {/* ℹ️ Info pratique */}
        <div className="text-center text-sm text-gray-500 border-t pt-6">
          <p>💡 Besoin d'aide ? Contactez-nous sur WhatsApp</p>
          <a href="https://wa.me/22890000000" target="_blank" className="text-[#064e3b] font-medium hover:underline">
            Ouvrir la conversation →
          </a>
        </div>
      </div>
    </main>
  );
}