"use server";
import pg from "../connection";

export const like = async (userid, transitionid) => {
  await pg("likes").insert({ userid, transitionid });
};

export const unlike = async (userid, transitionid) => {
  await pg("likes").where({ userid, transitionid }).del();
};
