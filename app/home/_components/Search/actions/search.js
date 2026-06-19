"use server";

function normalizeTrack(result) {
  const artworkUrl = result.artworkUrl100
    ? result.artworkUrl100.replace("100x100bb", "600x600bb")
    : "";
  return {
    id: String(result.trackId),
    name: result.trackName,
    duration_ms: result.trackTimeMillis || 0,
    explicit: result.trackExplicitness !== "notExplicit",
    uri: "",
    album: {
      name: result.collectionName || "",
      images: [{ url: artworkUrl }],
      artists: [{ name: result.artistName || "" }],
    },
    artists: [{ name: result.artistName || "" }],
  };
}

export default async function search(song) {
  if (!song || !song.trim()) return { tracks: { items: [] } };
  const url =
    "https://itunes.apple.com/search?" +
    new URLSearchParams({
      term: song,
      media: "music",
      entity: "song",
      limit: 10,
    });
  const response = await fetch(url);
  const data = await response.json();
  return {
    tracks: {
      items: (data.results || []).map(normalizeTrack),
    },
  };
}
