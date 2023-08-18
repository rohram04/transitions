"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pg from "../../../connection";

export const getUser = async () => {
  return JSON.parse(cookies().get("user").value);
};

export const logout = async () => {
  await cookies().set({
    name: "access_token",
    value: "",
    path: "/",
    maxAge: 0,
  });
  await cookies().set({
    name: "refresh_token",
    value: "",
    path: "/",
    maxAge: 0,
  });
  await cookies().set({
    name: "user",
    value: "",
    path: "/",
    maxAge: 0,
  });
  redirect("https://accounts.spotify.com/en/logout");
};

export async function deleteAccount() {
  const user = await getUser();
  return await pg("users").where("spotifyid", user.id).del();
}
