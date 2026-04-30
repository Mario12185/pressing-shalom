// @ts-nocheck
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ✅ Server Action mise à jour statut
async function updateStatus(formData: FormData) {
  "use server";
  const id = formData.get("orderId") as string;
  const newStatus = formData.get("newStatus") as string;

  // ✅ CORRECTION : "where" et "data:" sont OBLIGATOIRES
  await prisma.order.update({
    where: { id },
    data: { status: newStatus }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/orders/${id}`);
}

// ✅ Next.js 15+ : params est une Promise
export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session as any)?.user?.role !== "admin") redirect("/login");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!order) notFound();

  const formatFCFA = (amount: number) => new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  const formatDate = (date: Date) => new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow border">
        <Link href="/dashboard" className="text-[#064e3b] hover:underline mb-4 inline-block font-medium">
          ← Retour au tableau de bord
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Détails Commande #{order.id.slice(-6).toUpperCase()}
        </h1>

        {/* 👤 Client */}
        <div className="bg-blue-50 p-5 rounded-lg mb-6 border border-blue-100">
          <h2 className="font-semibold text-blue-900 mb-2">👤 Client</h2>
          <p className="text-lg font-bold text-gray-900">{order.user?.name || "Non renseigné"}</p>
          <p className="text-gray-600">{order.user?.phone || "N/A"}</p>
          <p className="text-sm text-gray-500 mt-1">📍 {order.address}</p>
        </div>

        {/* 📦 Service & Montant */}
        <div className="grid grid-cols-2 gap-6 mb-6 border-b pb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Service</h3>
            <p className="font-semibold capitalize">{order.serviceType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total</h3>
            <p className="font-semibold text-[#064e3b] text-lg">{formatFCFA(order.total)}</p>
          </div>
        </div>

        {/* 📊 Statut & Dates */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Statut actuel</h3>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold ${
              order.status === 'PRET' ? 'bg-green-100 text-green-800' : 
              order.status === 'LIVRE' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Créée le : {formatDate(order.createdAt)}</p>
            <p>Modifiée le : {formatDate(order.updatedAt)}</p>
          </div>
        </div>

        {/* 🔄 Mise à jour statut */}
        <form action={updateStatus} className="border-t pt-6">
          <input type="hidden" name="orderId" value={order.id} />
          <label className="block text-sm font-medium text-gray-700 mb-2">Changer le statut</label>
          <div className="flex gap-4">
            <select name="newStatus" defaultValue={order.status} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#064e3b] outline-none">
              <option value="EN_COURS">⏳ En cours</option>
              <option value="PRET">✅ Prêt à livrer</option>
              <option value="LIVRE">📦 Livré</option>
              <option value="ANNULE">❌ Annulé</option>
            </select>
            <button type="submit" className="px-6 py-3 bg-[#064e3b] text-white font-medium rounded-lg hover:bg-[#047857] transition shadow-sm">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}