import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { subscribeToNewsletter } from "./newsletter";

const providers: NextAuthOptions["providers"] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }),
];

// Dev-only login so the gated/unlocked state is testable without Google OAuth.
if (process.env.NODE_ENV === "development") {
  providers.push(
    CredentialsProvider({
      name: "Dev Login",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(credentials) {
        if (credentials?.email !== "dev@noslop.dev") return null;
        let user = await prisma.user.findUnique({ where: { email: "dev@noslop.dev" } });
        if (!user) {
          user = await prisma.user.create({
            data: { email: "dev@noslop.dev", name: "Dev User" },
          });
        }
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  events: {
    // New account created -> subscribe them to the newsletter (best effort).
    async createUser({ user }) {
      if (user.email) subscribeToNewsletter(user.email, user.name);
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.userId;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
