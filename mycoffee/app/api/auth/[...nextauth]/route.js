
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      // Allow all Google accounts
      if (account?.provider === "google") {
        return !!(profile?.email_verified && profile?.email);
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
