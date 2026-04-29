import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 🔝 Navigation */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#064e3b]">🧼 Pressing Shalom</h1>
          <nav className="flex items-center gap-4">
            <Link href="/track" className="text-gray-700 hover:text-[#064e3b] font-medium transition">
              Suivre ma commande
            </Link>
            <Link href="/login" className="px-4 py-2 bg-[#722F37] text-white rounded-lg hover:bg-[#5a252c] transition font-medium">
              Espace Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* 🎯 Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Votre linge, notre <span className="text-[#064e3b]">expertise</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Pressing professionnel à Lomé. Gestion intelligente, suivi en temps réel et service de qualité pour vos vêtements.
        </p>

        {/* 📸 IMAGE */}
        <div className="mb-10 flex justify-center">
          <img 
            src="/images/hero.jpg.png" 
            alt="Pressing professionnel - Chemises fraîches" 
            className="rounded-2xl shadow-xl max-w-3xl w-full border border-gray-100"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/track" className="px-6 py-3 bg-[#064e3b] text-white rounded-lg hover:bg-[#047857] transition font-medium shadow-md">
            🔍 Suivre ma commande
          </Link>
          <Link href="/login" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
            👨‍💼 Accès Professionnel
          </Link>
        </div>
      </section>

      {/* 🧼 Services */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">Nos Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: "👔", title: "Pressing Classique", desc: "Nettoyage en profondeur pour vêtements délicats." },
              { icon: "🧺", title: "Blanchisserie", desc: "Lavage et repassage pour grandes quantités." },
              { icon: "✨", title: "Repassage", desc: "Finition impeccable pour un look professionnel." },
              { icon: "🧴", title: "Nettoyage à Sec", desc: "Solution idéale pour cuir, laine et soie." }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📦 Comment ça marche */}
      <section className="py-16 container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">Comment ça marche ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h4 className="font-semibold mb-2">Déposez ou Commandez</h4>
            <p className="text-gray-600 text-sm">Apportez votre linge ou passez commande via notre tableau de bord.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h4 className="font-semibold mb-2">Suivez en temps réel</h4>
            <p className="text-gray-600 text-sm">Consultez le statut sur /track ou recevez des notifications WhatsApp.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h4 className="font-semibold mb-2">Récupérez ou Livré</h4>
            <p className="text-gray-600 text-sm">Retrait en boutique ou livraison directe à votre adresse.</p>
          </div>
        </div>
      </section>

      {/* 📍 Footer */}
      <footer className="bg-[#064e3b] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h4 className="text-xl font-bold mb-2">🧼 Pressing Shalom</h4>
          <p className="text-gray-300 text-sm mb-4">Lomé, Agoè Cacaveli CEET Togo • Qualité • Rapidité • Confiance</p>
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Pressing Shalom. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}