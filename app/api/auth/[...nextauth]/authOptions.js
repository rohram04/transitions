import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pg from "@/app/connection";

// Upsert a users row from an OAuth profile (GitHub / Google).
async function upsertOAuthUser({ id, display_name, avatar_url }) {
  await pg("users")
    .insert({ id: String(id), display_name, avatar_url })
    .onConflict("id")
    .merge(["display_name", "avatar_url"]);
}

// Normalize a provider's profile into { id, display_name, avatar_url }.
function normalizeOAuthProfile(provider, profile) {
  if (provider === "github") {
    return {
      id: profile.id,
      display_name: profile.login,
      avatar_url: profile.avatar_url,
    };
  }
  if (provider === "google") {
    return {
      id: profile.sub,
      display_name: profile.name,
      avatar_url: profile.picture,
    };
  }
  return null;
}

export const authOptions = {
  // Credentials provider requires JWT sessions (no DB adapter).
  session: { strategy: "jwt" },
  pages: { signIn: "/login", signOut: "/logout" },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Username and password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;
        if (!username || !password) return null;

        const user = await pg("users").where({ username }).first();
        if (!user?.password_hash) return null;

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return null;

        // NextAuth `user` shape; carried into the jwt callback below.
        return {
          id: user.id,
          name: user.display_name,
          image: user.avatar_url || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // OAuth (GitHub/Google): upsert the user row. Credentials: row already exists.
      const normalized = normalizeOAuthProfile(account?.provider, profile);
      if (normalized) await upsertOAuthUser(normalized);
      return true;
    },
    async jwt({ token, account, profile, user }) {
      const normalized = normalizeOAuthProfile(account?.provider, profile);
      if (normalized) {
        token.id = String(normalized.id);
        token.login = normalized.display_name;
        token.avatarUrl = normalized.avatar_url;
      } else if (user) {
        // Credentials sign-in: `user` is the object returned from authorize().
        token.id = user.id;
        token.login = user.name;
        token.avatarUrl = user.image || null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.login = token.login;
      session.user.image = token.avatarUrl;
      return session;
    },
  },
};
