import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
          if (!user || !user.password) return null;
          
          const isValid = await bcrypt.compare(credentials.password as string, user.password);
          console.log("🔍 AUTH v4 -", { email: credentials.email, isValid });
          
          return isValid ? { id: user.id, name: user.name, email: user.email, role: user.role } : null;
        } catch { return null; }
      }
    })
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => { if (user) { token.role = (user as any).role; } return token; },
    session: ({ session, token }) => { if (session.user) { (session.user as any).role = token.role; } return session; }
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };