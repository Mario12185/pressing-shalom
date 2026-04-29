"use server";
import { prisma } from "@/lib/prisma";

export async function trackOrder(query: string) {
  if (!query) return { error: "Veuillez entrer un téléphone ou un ID de commande" };

  const cleanQuery = query.trim().replace(/\s/g, "");

  // Cherche par téléphone (dans la table User) OU par ID de commande
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: cleanQuery },
        { user: { phone: { contains: cleanQuery } } }
      ]
    },
    include: { user: true }
  });

  if (!order) {
    return { error: "Aucune commande trouvée avec ces informations" };
  }

  // Formatage pour l'affichage
  const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
    EN_COURS: { label: "En cours de traitement", color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
    PRET:     { label: "Prêt à récupérer", color: "bg-green-100 text-green-800", icon: "✅" },
    LIVRE:    { label: "Livré", color: "bg-blue-100 text-blue-800", icon: "📦" },
    ANNULE:   { label: "Annulé", color: "bg-red-100 text-red-800", icon: "❌" }
  };

  const status = statusLabels[order.status] || { label: order.status, color: "bg-gray-100 text-gray-800", icon: "📋" };

  return {
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
  };
}