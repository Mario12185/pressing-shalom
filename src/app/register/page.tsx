"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, Mail, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const formatPhone = (val: string) => {
    const numbers = val.replace(/\D/g, "").slice(0, 8);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0,2)} ${numbers.slice(2)}`;
    if (numbers.length <= 6) return `${numbers.slice(0,2)} ${numbers.slice(2,4)} ${numbers.slice(4)}`;
    return `${numbers.slice(0,2)} ${numbers.slice(2,4)} ${numbers.slice(4,6)} ${numbers.slice(6)}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (pwd !== confirm) { setError("Les mots de passe ne correspondent pas"); setLoading(false); return; }
    if (pwd.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères"); setLoading(false); return; }
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password: pwd })
      });
      const data = await res.json();
      
      if (!res.ok) { setError(data.error || "Erreur lors de l'inscription"); } 
      else { router.push("/login?registered=true"); }
    } catch (err) { setError("Erreur de connexion au serveur"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/login" className="p-2 hover:bg-gray-100 rounded-lg transition"><ArrowLeft size={20} className="text-gray-600" /></Link>
          <h1 className="text-2xl font-semibold text-gray-900">Créer un compte</h1>
        </div>
        
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">{error}</div>}
        
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Nom complet *" value={name} onChange={e => setName(e.target.value)} required className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition" /></div>
          <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" placeholder="Adresse e-mail *" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition" /></div>
          <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="tel" placeholder="Téléphone Togo (ex: 22 12 34 56)" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition" /></div>
          <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" placeholder="Mot de passe * (min. 6 caractères)" value={pwd} onChange={e => setPwd(e.target.value)} required minLength={6} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition" /></div>
          <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" placeholder="Confirmer le mot de passe *" value={confirm} onChange={e => setConfirm(e.target.value)} required className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition" /></div>
          
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition shadow-lg shadow-teal-600/20 disabled:opacity-70">
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">Déjà un compte ? <Link href="/login" className="text-teal-600 hover:underline font-medium">Se connecter</Link></p>
        <p className="text-center text-xs text-gray-500 mt-4">🇹🇬 Votre numéro servira aux notifications WhatsApp & livraison</p>
      </div>
    </div>
  );
}
