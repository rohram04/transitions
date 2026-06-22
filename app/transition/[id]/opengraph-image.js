import { ImageResponse } from "next/server";
import { getTransition } from "./_actions/getTransition";

// Generated, per-transition share card: both covers split down the middle by
// the signature amber "cut", with the wordmark, track titles and uploader.
// Runs on the Node runtime because it reads the transition from Postgres.
export const runtime = "nodejs";
export const alt = "A song-to-song transition on Transitions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0e1a";
const CUE = "#FFB020";

// Google Fonts -> Satori needs a ttf/otf (it can't parse woff2). With a
// non-browser User-Agent, the css2 endpoint serves truetype, which Satori can
// read. We deliberately send no browser UA so we don't get woff2 back.
async function loadGoogleFont(family, weight) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+"
  )}:wght@${weight}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\(['"]?(?:opentype|truetype)['"]?\)/
  );
  if (!resource) throw new Error(`No usable font face for ${family}`);
  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error(`Font download failed for ${family}`);
  return res.arrayBuffer();
}

const artistsOf = (track) =>
  (track?.album?.artists || track?.artists || [])
    .map((a) => a.name)
    .filter(Boolean)
    .join(", ");

export default async function Image({ params }) {
  const data = await getTransition(params.id);

  // Fallback card if the transition is gone — still branded, never broken.
  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: BG,
            color: "#fff",
            fontSize: 56,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          Transitions
        </div>
      ),
      size
    );
  }

  const { transition: t, tracks } = data;
  const track1 = tracks[t.track1_id];
  const track2 = tracks[t.track2_id];
  const art1 = track1?.album?.images?.[0]?.url || "";
  const art2 = track2?.album?.images?.[0]?.url || "";
  const uploader = t.profile?.display_name || "a listener";

  let fonts;
  try {
    const [syne800, syne700, mono700] = await Promise.all([
      loadGoogleFont("Syne", 800),
      loadGoogleFont("Syne", 700),
      loadGoogleFont("Space Mono", 700),
    ]);
    fonts = [
      { name: "Syne", data: syne800, weight: 800, style: "normal" },
      { name: "Syne", data: syne700, weight: 700, style: "normal" },
      { name: "Space Mono", data: mono700, weight: 700, style: "normal" },
    ];
  } catch (err) {
    console.error("OG font load failed, using default:", err);
    fonts = undefined;
  }

  const display = fonts ? "Syne" : undefined;
  const mono = fonts ? "Space Mono" : undefined;

  const cover = (src, fallback) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element -- Satori (ImageResponse) renders raw <img>, not next/image
      <img
        src={src}
        alt=""
        width={600}
        height={630}
        style={{ width: 600, height: 630, objectFit: "cover" }}
      />
    ) : (
      <div style={{ width: 600, height: 630, backgroundColor: fallback }} />
    );

  const titleStyle = {
    fontFamily: display,
    fontSize: 46,
    fontWeight: 700,
    color: "#fff",
    maxWidth: 470,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const artistStyle = {
    fontFamily: mono,
    fontSize: 24,
    fontWeight: 700,
    color: "rgba(255,255,255,0.72)",
    maxWidth: 470,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: BG,
        }}
      >
        {cover(art1, "#2B2780")}
        {cover(art2, "#7A1F47")}

        {/* legibility scrim */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "linear-gradient(180deg, rgba(10,14,26,0.72) 0%, rgba(10,14,26,0.12) 32%, rgba(10,14,26,0.45) 64%, rgba(10,14,26,0.97) 100%)",
          }}
        />

        {/* the cut — amber seam + label */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 597,
            width: 6,
            backgroundColor: CUE,
            boxShadow: "0 0 44px 10px rgba(255,176,32,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 600,
            top: 292,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: CUE,
            color: BG,
            fontFamily: mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 6,
            padding: "8px 16px 8px 22px",
            borderRadius: 999,
          }}
        >
          CUT
        </div>

        {/* content */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontFamily: display,
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 8,
                color: "#fff",
                textTransform: "uppercase",
              }}
            >
              Transitions
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 4,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              SEGUE
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={titleStyle}>{track1?.name || "Track one"}</div>
                <div style={artistStyle}>{artistsOf(track1)}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                }}
              >
                <div style={titleStyle}>{track2?.name || "Track two"}</div>
                <div style={artistStyle}>{artistsOf(track2)}</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontFamily: mono,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              shared by {uploader}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
