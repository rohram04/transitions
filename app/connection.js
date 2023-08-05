"use server";
import knex from "knex";

const pg = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  debug: true,
  pool: { min: 0, max: 5 },
});

export default pg;
