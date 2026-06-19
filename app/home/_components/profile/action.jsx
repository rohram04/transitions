"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import pg from "@/app/connection";

export const getUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return {
    id: session.user.id,
    display_name: session.user.name || session.user.login,
    avatarurl: session.user.image,
    country: null,
  };
};

export const logout = async () => {
  redirect("/api/auth/signout");
};

export async function deleteAccount() {
  const user = await getUser();
  if (!user) return;
  return await pg("users").where("spotifyid", user.id).del();
}
