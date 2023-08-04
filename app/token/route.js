import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";
import request from "request";
import pg from "../connection";

export async function GET(req) {
  console.log(req.nextUrl.searchParams.get("code"));
  var code = req.nextUrl.searchParams.get("code") || null;
  var state = req.nextUrl.searchParams.get("state") || null;
  const storedState = cookies().get("state").value;

  if (state === null || state != storedState) {
    // THROW SOME ERROR
  } else {
    let body = new URLSearchParams({
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(
            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
          ).toString("base64"),
      },
      body: body,
    });

    const tokenInfo = await response.json();

    cookies().set("access_token", tokenInfo.access_token);
    cookies().set("refresh_token", tokenInfo.refresh_token);

    const userDataResponse = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
      },
    });
    const result = await userDataResponse.json();
    cookies().set("user", JSON.stringify(result));

    await pg("users")
      .insert({ spotifyid: result.id, displayname: result.id })
      .onConflict("spotifyid")
      .ignore();

    return NextResponse.redirect("http://localhost:3000/home");
  }
}
