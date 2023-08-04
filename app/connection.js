"use server";
import knex from "knex";

const pg = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  debug: true,
});

export default pg;
