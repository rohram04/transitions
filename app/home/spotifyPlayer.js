import getToken from "../token/getToken";
import { useEffect, useState } from "react";

export default function usePlayer() {
  // const store = useStore(usePlayerStore, (state) => state);
  const [playerStore, setPlayer] = useState(null);
  const [device_id, setDeviceId] = useState(null);
  const [playerState, setPlayerState] = useState(null);

  useEffect(() => {
    async function createPlayer() {
      const token = await getToken();
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK NEW",
          getOAuthToken: (cb) => {
            cb(token);
          },
          volume: 0.2,
        });

        player.addListener("ready", async ({ device_id }) => {
          setPlayer(player);
          setDeviceId(device_id);
          window.addEventListener("beforeunload", (ev) => {
            return player.disconnect();
          });

          window.addEventListener("popstate", (ev) => {
            return player.disconnect();
          });
        });

        player.addListener("player_state_changed", (state) => {
          setPlayerState(state);
        });
        player.connect();
      };
    }

    if (playerStore == null) createPlayer();
  }, [playerStore]);

  return { player: playerStore, device_id, playerState };
}
