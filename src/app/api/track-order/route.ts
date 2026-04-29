import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return NextResponse.json({ error: "Veuillez entrer un téléphone ou un ID de commande" }, { status: 400 });
    }

    // 🔧 Nettoie la requête : enlève tous les espaces, tirets, points
    const cleanQuery = query.replace(/[\s\-\.\(\)]/g, "");

    // Cherche par ID exact OU par téléphone (en nettoyant aussi les téléphones en base)
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: cleanQuery }, // Recherche par ID de commande
          { 
            user: { 
              phone: { 
                // On compare les deux versions nettoyées
                contains: cleanQuery 
              } 
            } 
          }
        ]
      },
      include: { user: true }
    });

    if (!order) {
      // 🔍 Debug : affiche ce qu'on a cherché (dans ton terminal PowerShell)
      console.log("🔍 Recherche sans résultat :", { cleanQuery, original: query });
      return NextResponse.json({ error: "Aucune commande trouvée. Vérifiez le numéro ou l'ID." }, { status: 404 });
    }

    const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
      EN_COURS: { label: "En cours de traitement", color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
      PRET:     { label: "Prêt à récupérer", color: "bg-green-100 text-green-800", icon: "✅" },
      LIVRE:    { label: "Livré", color: "bg-blue-100 text-blue-800", icon: "📦" },
      ANNULE:   { label: "Annulé", color: "bg-red-100 text-red-800", icon: "❌" }
    };

    const status = statusLabels[order.status] || { label: order.status, color: "bg-gray-100 text-gray-800", icon: "📋" };

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        clientName: order.user?.name || "Client",
        serviceType: order.serviceType,
        total: order.total,
        status: status.label,
        statusColor: status.color,
        statusIcon: status.icon,
        deliveryDate: new Date(order.deliveryDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
        deliveryTime: order.deliveryTime,
        address: order.address,
        createdAt: new Date(order.createdAt).toLocaleDateString("fr-FR")
      }
    });
  } catch (error: any) {
    console.error("❌ Erreur suivi commande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}