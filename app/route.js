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
    "user-read-private user-modify-playback-state user-read-playback-state user-read-currently-playing streaming";

  const cookieStore = cookies();
  cookies().set("state", state);
  console.log(process.env.REDIRECT_URI);
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
