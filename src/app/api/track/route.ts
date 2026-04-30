// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ✅ Aussi pour l'API

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    
    if (!search) {
      return NextResponse.json({ error: "Téléphone ou ID requis" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: search },
          { user: { phone: search } }
        ]
      },
      include: { user: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Aucune commande trouvée" }, { status: 404 });
    }

    return NextResponse.json({
      id: order.id,
      clientName: order.user?.name || "Client",
      clientPhone: order.user?.phone || "",
      serviceType: order.serviceType,
      total: order.total,
      status: order.status,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime,
      address: order.address
    });
  } catch (error: any) {
    console.error("❌ Erreur API track:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}