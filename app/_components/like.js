"use server";
import pg from "../connection";
import { getUser } from "@/app/home/_components/profile/action";

export const like = async (transition_id) => {
  const user = await getUser();
  if (!user) return;
  await pg("likes").insert({
    user_id: user.id,
    transition_id,
  });
};

export const unlike = async (transition_id) => {
  const user = await getUser();
  if (!user) return;
  await pg("likes")
    .where({ user_id: user.id, transition_id })
    .del();
};
