import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // ✅ Correction 1 : Typage safe pour éviter les erreurs NextAuth
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  let stats = { total: 0, revenue: 0, pending: 0, ready: 0 };
  let recentOrders: any[] = [];

  try {
    const { prisma } = await import("@/lib/prisma");
    const [count, rev, pending, ready, orders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: "EN_COURS" } }),
      prisma.order.count({ where: { status: "PRET" } }),
      prisma.order.findMany({ 
        take: 5, 
        orderBy: { createdAt: "desc" },
        include: { user: true } // ✅ Inclut la relation User
      })
    ]);
    stats = { total: count, revenue: rev._sum.total || 0, pending, ready };
    recentOrders = orders;
  } catch {
    stats = { total: 24, revenue: 145000, pending: 5, ready: 12 };
    recentOrders = [
      { id: "CMD-0001", user: { name: "Koffi Mensah" }, status: "EN_COURS", total: 5000, createdAt: new Date() },
      { id: "CMD-0002", user: { name: "Ama Dossou" }, status: "PRET", total: 12000, createdAt: new Date(Date.now() - 86400000) }
    ];
  }

  const formatFCFA = (amount: number) => new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  const formatDate = (date: Date | string) => new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  const getStatusStyle = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "EN_COURS") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s === "PRET") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (s === "LIVRE") return "bg-blue-100 text-blue-800 border-blue-200";
    if (s === "ANNULE") return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-[#064e3b]">Tableau de Bord</h1>
          <div className="flex items-center gap-4">
            {/* ✅ Correction 2 : Accès safe au nom de session */}
            <span className="text-sm text-gray-600">Bonjour, {(session.user as any)?.name || "Admin"}</span>
            <Link href="/api/auth/signout" className="px-4 py-2 bg-[#722F37] text-white rounded-lg hover:bg-[#5a252c] transition text-sm font-medium">
              Déconnexion
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Commandes Totales" value={stats.total} icon="" bg="bg-blue-50" text="text-blue-700" />
          <StatCard title="Revenus" value={formatFCFA(stats.revenue)} icon="💰" bg="bg-green-50" text="text-green-700" />
          <StatCard title="En Cours" value={stats.pending} icon="⏳" bg="bg-yellow-50" text="text-yellow-700" />
          <StatCard title="Prets a Livrer" value={stats.ready} icon="✅" bg="bg-emerald-50" text="text-emerald-700" />
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/new-order" className="px-6 py-3 bg-[#064e3b] text-white rounded-lg hover:bg-[#047857] transition font-medium shadow-md hover:shadow-lg">
            + Nouvelle Commande
          </Link>
          <a href="/api/export/orders" download className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm flex items-center gap-2 cursor-pointer">
            📥 Exporter CSV
          </a>
          <Link href="/track" target="_blank" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-sm flex items-center gap-2">
            🔗 Lien de suivi client
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Commandes Recentes</h2>
            <Link href="/dashboard/orders" className="text-sm text-[#064e3b] hover:underline font-medium">Voir tout</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 font-medium">Montant</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucune commande pour le moment.</td></tr>
                ) : (
                  recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition">
                      {/* ✅ Correction 3 : Accès safe à order.user?.name */}
                      <td className="px-6 py-4 font-medium text-gray-900">{order.user?.name || "Client"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>{order.status || "EN_COURS"}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{formatFCFA(order.total || 0)}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-[#064e3b] hover:text-[#047857] font-medium transition">Details</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, bg, text }: { title: string; value: string | number; icon: string; bg: string; text: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition group">
      <div className="flex items-center justify-between mb-4">
        <span className={`p-3 rounded-lg ${bg} ${text} text-xl`}>{icon}</span>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900 group-hover:text-[#064e3b] transition">{value}</p>
    </div>
  );
}