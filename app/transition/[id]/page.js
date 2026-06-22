import { notFound } from "next/navigation";
import { getTransition } from "./_actions/getTransition";
import TransitionView from "./client";

const artistsOf = (track) =>
  (track?.album?.artists || track?.artists || [])
    .map((a) => a.name)
    .filter(Boolean)
    .join(", ");

// Per-transition share metadata. The opengraph-image / twitter-image files in
// this segment are wired automatically into the OG + Twitter image tags, so a
// pasted link unfurls as the generated composite cover.
export async function generateMetadata({ params }) {
  const data = await getTransition(params.id);
  if (!data) return { title: "Transition not found" };

  const { transition: t, tracks } = data;
  const n1 = tracks[t.track1_id]?.name || "a song";
  const n2 = tracks[t.track2_id]?.name || "another song";
  const a1 = artistsOf(tracks[t.track1_id]);
  const a2 = artistsOf(tracks[t.track2_id]);
  const uploader = t.profile?.display_name || "a listener";

  const title = `${n1} → ${n2}`;
  const description = `${n1}${a1 ? ` by ${a1}` : ""} into ${n2}${
    a2 ? ` by ${a2}` : ""
  } — a transition shared by ${uploader} on Transitions.`;

  return {
    title,
    description,
    openGraph: { type: "music.song", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }) {
  const data = await getTransition(params.id);
  if (!data) notFound();

  return <TransitionView transition={data.transition} tracks={data.tracks} />;
}
