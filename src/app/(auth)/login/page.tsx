"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Phone, Lock, Mail } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  { src: "/images/carousel/slide1.jpg", text: "Soin délicat pour vos lingerie fines" },
  { src: "/images/carousel/slide2.jpg", text: "Collecte et livraison gratuites" },
  { src: "/images/carousel/slide3.jpg", text: "Produits 100% éco-responsables" },
];

export default function LoginPage() {
  const [idx, setIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const formatPhone = (val: string) => {
    const numbers = val.replace(/\D/g, "").slice(0, 8);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0,2)} ${numbers.slice(2)}`;
    if (numbers.length <= 6) return `${numbers.slice(0,2)} ${numbers.slice(2,4)} ${numbers.slice(4)}`;
    return `${numbers.slice(0,2)} ${numbers.slice(2,4)} ${numbers.slice(4,6)} ${numbers.slice(6)}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (phone) localStorage.setItem("userPhone", phone);
    
    const res = await signIn("credentials", { 
      email, 
      password: pwd, 
      redirect: false 
    });
    
    setLoading(false);
    
    if (res?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Carousel - Gauche */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.5 }} 
            className="absolute inset-0"
          >
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${SLIDES[idx].src})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-10 left-8 text-white text-xl font-medium max-w-md">{SLIDES[idx].text}</div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIdx(i)} 
              className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75"}`} 
            />
          ))}
        </div>

        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">PS</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">PRESSING SHALOM</span>
        </div>
      </div>

      {/* Formulaire - Droite */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <form className="w-full max-w-sm space-y-4" onSubmit={handleLogin}>
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-semibold text-gray-900">Connexion 🔐</h1>
            <p className="mt-1 text-gray-600 text-sm">Accédez à votre espace client</p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              placeholder="Adresse e-mail *" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition" 
            />
          </div>
          
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="tel" 
              placeholder="Téléphone Togo (ex: 22 12 34 56)" 
              value={phone} 
              onChange={e => setPhone(formatPhone(e.target.value))} 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition" 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              placeholder="Mot de passe *" 
              value={pwd} 
              onChange={e => setPwd(e.target.value)} 
              required 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition shadow-lg shadow-teal-600/20 disabled:opacity-70"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          
          <div className="text-center">
            <Link href="/register" className="text-teal-600 hover:underline text-sm font-medium">
              Pas encore de compte ? Créer un compte
            </Link>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-2">
            🇹🇬 Format Togo : 8 chiffres • Notifications WhatsApp & SMS
          </p>
        </form>
      </div>
    </div>
  );
}