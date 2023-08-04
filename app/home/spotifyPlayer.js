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
          // const state = await player.getCurrentState();
          // console.log("STATE", state);
          window.addEventListener("beforeunload", (ev) => {
            return player.disconnect();
          });

          window.addEventListener("popstate", (ev) => {
            return player.disconnect();
          });
        });

        player.addListener("player_state_changed", (state) => {
          console.log(state);
          setPlayerState(state);

          // let ids = state.track_window.current_track.id;

          // state.track_window.next_tracks.forEach(({ id }) => {
          //   ids += "," + id;
          // });

          // console.log(ids);

          // fetch(
          //   "https://api.spotify.com/v1/tracks?" + new URLSearchParams({ ids }),
          //   {
          //     method: "GET",
          //     headers: {
          //       Authorization: `Bearer ${token}`,
          //       "Content-Type": "application/json",
          //     },
          //   }
          // )
          //   .then((response) => response.json())
          //   .then((data) => console.log(data));

          // player.getCurrentState().then((state) => {
          //   !state ? setActive(false) : setActive(true);
          // });
        });

        console.log("creating player");
        player.connect();

        // player.connect();

        // player.addListener("not_ready", ({ device_id }) => {
        //   console.log("Device ID has gone offline", device_id);
        // });
        // preview(did, [selectedTracks[0].uri, selectedTracks[1].uri]);
      };
    }

    if (playerStore == null) createPlayer();
  }, [playerStore]);

  return { player: playerStore, device_id, playerState };
}
