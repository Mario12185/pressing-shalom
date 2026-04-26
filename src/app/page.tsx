"use client";

import { motion } from "framer-motion";
import { Shirt, Truck, Clock, ArrowRight, CheckCircle, Star } from "lucide-react";

// Composant d'animation réutilisable
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true, margin: "-50px" }} 
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-teal-100">
      
      {/* 🦸 HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/carousel/slide1.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-gray-50" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-teal-700 bg-teal-50 rounded-full border border-teal-100">
              ✨ Service Premium & Éco-responsable
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Votre lessive, <span className="text-teal-600">simplifiée.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Collectée, nettoyée, livrée. Fini les corvées, place à la qualité professionnelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/login" className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                Commander maintenant <ArrowRight size={20} />
              </a>
              <a href="#services" className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold border border-gray-200 shadow-sm transition-all hover:shadow-md">
                Voir nos services
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 🔄 COMMENT ÇA MARCHE */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn><h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche ?</h2></FadeIn>
          <FadeIn delay={0.1}><p className="text-gray-600 mb-16 max-w-2xl mx-auto">Un processus fluide en 4 étapes, entièrement gérable depuis votre téléphone.</p></FadeIn>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Clock size={32} />, title: "1. Commandez", desc: "Sélectionnez vos articles et choisissez votre créneau en ligne." },
              { icon: <Truck size={32} />, title: "2. Collecte", desc: "Notre coursier passe récupérer votre linge à l'adresse indiquée." },
              { icon: <Shirt size={32} />, title: "3. Nettoyage", desc: "Soin expert avec des produits professionnels et écologiques." },
              { icon: <CheckCircle size={32} />, title: "4. Livraison", desc: "Retrouvez vos vêtements impeccables, repassés et pliés." }
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
                  <div className="w-16 h-16 mx-auto mb-6 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      🧺 SERVICES & TARIFS
      <section id="services" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <FadeIn><h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Nos Services</h2></FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Pressing à sec", desc: "Idéal pour costumes, robes de soirée, manteaux et tissus délicats. Traitement des taches inclus.", price: "À partir de 8€ / pièce" },
              { title: "Blanchisserie", desc: "Lavage, séchage et repassage de votre linge du quotidien (draps, serviettes, vêtements courants).", price: "Au kg ou à la pièce" },
              { title: "Repassage seul", desc: "Vous lavez, nous repassons. Vos vêtements sont rendus sous pli protecteur, prêts à ranger.", price: "À partir de 2€ / pièce" }
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{s.desc}</p>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-teal-600 font-semibold">{s.price}</span>
                    <a href="/login" className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors">Commander →</a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      💡 POURQUOI NOUS CHOISIR
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn><h2 className="text-3xl md:text-4xl font-bold mb-12">Pourquoi PRESSING SHALOM ?</h2></FadeIn>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Gain de temps garanti", "Pratique & 100% en ligne", "Soin professionnel certifié", "Produits éco-responsables"
            ].map((val, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-center gap-3 p-5 bg-teal-50/50 rounded-xl text-gray-800 font-medium border border-teal-100">
                  <CheckCircle className="text-teal-600 shrink-0" size={20} /> {val}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      ⭐ TÉMOIGNAGES
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn><h2 className="text-3xl md:text-4xl font-bold mb-16">Ce que disent nos clients</h2></FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Aminata D.", text: "Service impeccable ! Mes vêtements sont comme neufs et livrés toujours à l'heure. Je ne reviens plus en arrière.", rating: 5 },
              { name: "Karim B.", text: "J'adore le système de commande en ligne. Plus besoin de faire la queue. Le suivi par WhatsApp est un vrai plus.", rating: 5 },
              { name: "Sophie L.", text: "Le repassage est parfait. Je recommande à 100% pour la qualité, la ponctualité et la gentillesse de l'équipe.", rating: 5 }
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-left h-full flex flex-col">
                  <div className="flex gap-1 text-yellow-400 mb-4">{"⭐".repeat(t.rating)}</div>
                  <p className="text-gray-700 mb-6 italic flex-grow">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">{t.name[0]}</div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      📱 FOOTER & CTA FINAL
      <footer className="py-20 px-4 bg-gray-900 text-white text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à simplifier votre quotidien ?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">Rejoignez des centaines de clients satisfaits. Première commande avec 10% de réduction.</p>
          <a href="/login" className="inline-flex items-center gap-2 px-10 py-5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-teal-600/30">
            Créer mon compte <ArrowRight size={20} />
          </a>
          <div className="mt-16 pt-8 border-t border-gray-800 text-sm text-gray-500">
            <p>© 2026 PRESSING SHALOM. Tous droits réservés. | <a href="#" className="hover:text-teal-400">Mentions légales</a> | <a href="#" className="hover:text-teal-400">Politique de confidentialité</a></p>
          </div>
        </FadeIn>
      </footer>
    </main>
  );
}