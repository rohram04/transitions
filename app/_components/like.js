"use server";
import pg from "../connection";
import { getUser } from "@/app/home/_components/profile/action";

export const like = async (transitionid) => {
  const user = await getUser();
  if (!user) return;
  await pg("likes").insert({
    userid: user.id,
    transitionid,
  });
};

export const unlike = async (transitionid) => {
  const user = await getUser();
  if (!user) return;
  await pg("likes")
    .where({ userid: user.id, transitionid })
    .del();
};
