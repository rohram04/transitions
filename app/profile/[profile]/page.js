import { getProfile } from "./_components/getProfile.js";
import ProfileView from "./client";

export async function generateMetadata({ params }) {
  const profile = await getProfile(params.profile);
  if (!profile) {
    return { title: "Profile" };
  }
  const name = profile.display_name || "A listener";
  return {
    title: name,
    description: `${name}'s transitions on Transitions — seamless hand-offs between two songs.`,
    openGraph: {
      title: `${name} · Transitions`,
      description: `${name}'s transitions — seamless hand-offs between two songs.`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
  };
}

export default function Page({ params }) {
  return <ProfileView params={params} />;
}
