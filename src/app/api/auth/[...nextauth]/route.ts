import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ✅ Typage explicite pour éviter les erreurs TypeScript
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        phone: { label: "Téléphone", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.phone) {
          throw new Error("Email ou téléphone requis");
        }

        // Recherche par email OU téléphone
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { phone: credentials.phone }
            ]
          }
        });

        if (!user) {
          throw new Error("Utilisateur non trouvé");
        }

        // Vérification du mot de passe (en local, on accepte un fallback)
        const isValid = await bcrypt.compare(
          credentials.password || "",
          user.password
        ).catch(() => false);

        // En dev local : accepter si mot de passe = "admin123" ou "test123"
        const isDev = process.env.NODE_ENV === "development";
        const devPassword = credentials.password === "admin123" || credentials.password === "test123";

        if (isValid || (isDev && devPassword)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
          };
        }

        throw new Error("Mot de passe incorrect");
      }
    })
  ],

  // ✅ Typage explicite de la stratégie de session
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60 // 30 jours
  },

  pages: {
    signIn: "/login",
    error: "/login"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
      }
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };