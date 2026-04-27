import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        phone: { label: "Téléphone", type: "tel" }
      },
      // Ajout de _req et typage flexible pour régler l'erreur NextAuth v5
      async authorize(credentials: any, _req: any) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) return null;
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        };
      }
    })
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    // Typage :any règle les erreurs "role/phone n'existent pas"
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;