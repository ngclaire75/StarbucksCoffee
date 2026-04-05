
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// Ensure NEXTAUTH_URL is always set (Vercel auto-sets VERCEL_URL as fallback)
if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

// Trim any accidental whitespace from secrets
const clientId     = (process.env.GOOGLE_CLIENT_ID     || "").trim();
const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
const secret       = (process.env.NEXTAUTH_SECRET       || "").trim();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret,
  pages: {
    signIn:  "/signin",
    signOut: "/",
    error:   "/signin",   // redirect auth errors to sign-in page
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!(profile?.email_verified && profile?.email)) return false;
        // Upsert the Google user into the database so they have a stable DB id
        try {
          await prisma.user.upsert({
            where: { email: profile.email },
            update: { googleId: profile.sub, name: profile.name, image: profile.picture },
            create: {
              googleId: profile.sub,
              email: profile.email,
              name: profile.name,
              firstName: profile.given_name || profile.name?.split(" ")[0] || "",
              lastName: profile.family_name || "",
              image: profile.picture,
            },
          });
        } catch (err) {
          console.error("NextAuth signIn upsert error:", err);
        }
        return true;
      }
      return true;
    },
    async session({ session, token }) {
      if (token?.sub)   session.user.id    = token.sub;
      if (token?.email) session.user.email = token.email;
      if (token?.name)  session.user.name  = token.name;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {}
      return baseUrl;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        token.email = profile.email;
        token.name  = profile.name;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
