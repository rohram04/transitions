import GitHubProvider from "next-auth/providers/github";
import pg from "@/app/connection";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      await pg("users")
        .insert({
          spotifyid: String(profile.id),
          displayname: profile.login,
          avatarurl: profile.avatar_url,
        })
        .onConflict("spotifyid")
        .merge(["displayname", "avatarurl"]);
      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.githubId = String(profile.id);
        token.login = profile.login;
        token.avatarUrl = profile.avatar_url;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.githubId;
      session.user.login = token.login;
      session.user.image = token.avatarUrl;
      return session;
    },
  },
};
