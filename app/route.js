import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import querystring from "querystring";

const generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export async function GET(request) {
  var state = generateRandomString(16);
  var scope =
    "user-read-private user-read-email user-modify-playback-state user-read-playback-state streaming";

  const cookieStore = cookies();
  cookies().set("state", state);

  return NextResponse.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state,
      })
  );
}
