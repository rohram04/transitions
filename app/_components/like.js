"use server";
import pg from "../connection";
import { cookies } from "next/headers";

export const like = async (transitionid) => {
  console.log(cookies().get("user"));
  const res = await pg("likes").insert({
    userid: JSON.parse(cookies().get("user").value).id,
    transitionid,
  });
  console.log(res);
};

export const unlike = async (transitionid) => {
  await pg("likes")
    .where({ userid: JSON.parse(cookies().get("user").value).id, transitionid })
    .del();
};
