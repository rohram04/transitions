"use server";
import { cookies } from "next/headers";

export default async function fetchData(url, method = { headers: {} }) {
  method["headers"]["Authorization"] = `Bearer ${
    cookies().get("access_token").value
  }`;
  let result = await fetch(url, method);
  if (result.status === 401) {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: cookies().get("refresh_token").value,
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
    if (!response.ok)
      throw Error("Error Retriving Access Token using Refresh Token");
    const { access_token } = await response.json();
    cookies().set("access_token", access_token);
    method["headers"]["Authorization"] = `Bearer ${access_token}`;
    result = await fetch(url, method);
  }
  return result;
}
