import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
        role: "user"
      }
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });

  } catch (error) {
    console.error("❌ ERREUR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}