import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET : Récupérer toutes les commandes avec infos client
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("❌ GET admin/orders:", error.message);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH : Mettre à jour le statut d'une commande
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
    }

    const { orderId, status } = await req.json();
    const validStatuses = ["pending", "en cours", "livré", "annulé"];
    
    if (!orderId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // ✅ CORRECTION : 'data:' + 'where' sont OBLIGATOIRES ici
    const updated = await prisma.order.update({
       data: { status },
      where: { id: orderId },
      include: { 
        user: { select: { name: true, email: true, phone: true } }, 
        items: true 
      }
    });

    return NextResponse.json({ success: true, order: updated }, { status: 200 });
  } catch (error: any) {
    console.error("❌ PATCH admin/orders:", error.message);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}