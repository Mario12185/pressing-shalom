// @ts-nocheck
"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerAndOrder(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const serviceType = formData.get("serviceType") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 1;
  const unitPrice = parseInt(formData.get("unitPrice") as string) || 0;
  const address = formData.get("address") as string;
  const deliveryDate = formData.get("deliveryDate") as string;
  const deliveryTime = formData.get("deliveryTime") as string;

  if (!email || !password || !phone || !serviceType || !deliveryDate || !deliveryTime) {
    return { error: "Champs obligatoires manquants (*)" };
  }

  let createdUserId = "";

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "Email déjà utilisé." };

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name: name || "Client",
        email,
        phone,
        password: hashedPassword,
        role: "user"
      }
    });

    await prisma.order.create({
      data: {
        userId: user.id,
        serviceType,
        status: "EN_COURS",
        total: quantity * unitPrice,
        address: address || "Lomé, Togo",
        deliveryDate: new Date(deliveryDate),
        deliveryTime
      }
    });

    createdUserId = user.id;
  } catch (error: any) {
    console.error("🔴 ERREUR :", error.message);
    return { error: "Erreur base de données." };
  }

  redirect("/client");
}