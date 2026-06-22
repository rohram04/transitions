"use server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import pg from "@/app/connection";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

// Create a username/password account. Returns { ok } / { ok:false, error }.
// No session is set here — the client signs in via next-auth right after.
export async function signup(username, password) {
  username = (username || "").trim();

  if (!USERNAME_RE.test(username)) {
    return {
      ok: false,
      error: "Username must be 3–30 letters, numbers, or underscores.",
    };
  }
  if (!password || password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const existing = await pg("users").where({ username }).first();
  if (existing) return { ok: false, error: "That username is taken." };

  const password_hash = await bcrypt.hash(password, 12);
  try {
    await pg("users").insert({
      id: randomUUID(),
      username,
      password_hash,
      display_name: username,
      avatar_url: null,
    });
  } catch (err) {
    // Unique-violation race between the check above and the insert.
    if (err?.code === "23505") return { ok: false, error: "That username is taken." };
    return { ok: false, error: "Could not create the account. Please try again." };
  }

  return { ok: true };
}
