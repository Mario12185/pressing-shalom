import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session as any)?.user?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // ✅ AJOUT : include: { user: true } pour récupérer nom & téléphone
  const commandes = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  // En-têtes CSV
  const headers = ["ID Commande", "Client", "Téléphone", "Service", "Statut", "Total (FCFA)", "Date"];

  // Lignes CSV
  const lignes = commandes.map(o => [
    `"${o.id}"`,
    `"${(o.user?.name || "").replace(/"/g, '""')}"`, // ✅ Correction clientName
    `"${(o.user?.phone || "").replace(/"/g, '""')}"`, // ✅ Correction clientPhone
    `"${o.serviceType}"`,
    `"${o.status}"`,
    `"${o.total}"`,
    `"${new Date(o.createdAt).toLocaleDateString("fr-FR")}"`
  ]);

  // Assemblage CSV avec saut de ligne Windows (\r\n) pour Excel
  const csvContent = [headers, ...lignes].map(row => row.join(",")).join("\r\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=commandes-pressing-shalom.csv"
    }
  });
}