import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pg from "@/app/connection";

export const authOptions = {
  // Credentials provider requires JWT sessions (no DB adapter).
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
        if (!user?.passwordhash) return null;

        const ok = await bcrypt.compare(password, user.passwordhash);
        if (!ok) return null;

        // NextAuth `user` shape; carried into the jwt callback below.
        return {
          id: user.spotifyid,
          name: user.displayname,
          image: user.avatarurl || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // GitHub: upsert the user row. Credentials: row already exists (signup).
      if (account?.provider === "github") {
        await pg("users")
          .insert({
            spotifyid: String(profile.id),
            displayname: profile.login,
            avatarurl: profile.avatar_url,
          })
          .onConflict("spotifyid")
          .merge(["displayname", "avatarurl"]);
      }
      return true;
    },
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "github" && profile) {
        token.id = String(profile.id);
        token.login = profile.login;
        token.avatarUrl = profile.avatar_url;
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
