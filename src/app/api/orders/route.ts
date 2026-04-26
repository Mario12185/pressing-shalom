import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ 
      include: { items: true }, 
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("GET error:", error.message);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serviceType, items, address, deliveryDate, deliveryTime, userEmail } = body;
    
    if (!serviceType || !items?.length || !address || !deliveryDate || !userEmail) {
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    }
    
    let user = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase().trim() } });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    
    const sP = { pressing: 800, blanchisserie: 400, repassage: 200 };
    const iP = { chemise: 1500, pantalon: 2000, robe: 2500, drap: 1200, costume: 5000, couette: 3500 };
    const total = (sP[serviceType]||0) + items.reduce((s:number,i:any)=>s+(iP[i.id]||0)*i.qty,0);
    
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        serviceType,
        address,
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        status: "pending",
        total,
        items: { create: items.map((i:any)=>({ name:i.name, quantity:i.qty, price:iP[i.id]||0 })) }
      },
      include: { items: true }
    });
    
    return NextResponse.json({ success: true, orderId: order.id, message: "Commande enregistrée !" }, { status: 201 });
  } catch (error: any) {
    console.error("POST error:", error.message);
    return NextResponse.json({ error: "Erreur création", details: error.message }, { status: 500 });
  }
}