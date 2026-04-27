import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ⚠️ Suppression du typage explicite qui cause l'erreur GetServerSessionParams
export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        phone: { label: "Téléphone", type: "tel" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        
        return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
      }
    })
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) { token.role = user.role; token.phone = user.phone; }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Export compatible v4/v5 pour éviter l'erreur TypeScript au build
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;