"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const clientEmail = formData.get("clientEmail") as string;
  const clientName = formData.get("clientName") as string;
  const clientPhone = formData.get("clientPhone") as string;
  const serviceType = formData.get("serviceType") as string;
  const total = parseInt(formData.get("total") as string) || 0;
  const address = formData.get("address") as string;
  const deliveryDate = formData.get("deliveryDate") as string;
  const deliveryTime = formData.get("deliveryTime") as string;

  // Validation basique
  if (!clientEmail || !serviceType || !deliveryDate || !deliveryTime) {
    return { error: "Veuillez remplir tous les champs obligatoires (*)" };
  }

  try {
    // Cherche ou crée le client automatiquement
    let user = await prisma.user.findUnique({ where: { email: clientEmail } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: clientName || "Client",
          email: clientEmail,
          phone: clientPhone || "",
          password: "$2b$10$defaulthashedpassword123", // Placeholder sécurisé pour le dev local
          role: "user"
        }
      });
    }

    // Crée la commande avec les champs requis de ton schéma
    await prisma.order.create({
      data: {
        userId: user.id,
        serviceType: serviceType,
        status: "EN_COURS",
        total: total,
        address: address || "Non spécifié",
        deliveryDate: new Date(deliveryDate),
        deliveryTime: deliveryTime
      }
    });

    revalidatePath("/dashboard");
    redirect("/dashboard?success=true");
    
  } catch (error: any) {
    console.error("❌ Erreur création commande:", error);
    return { error: "Une erreur est survenue : " + error.message };
  }
}