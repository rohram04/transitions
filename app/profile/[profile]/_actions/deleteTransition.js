"use server";
import pg from "@/app/connection";
import { getUser } from "@/app/home/_components/profile/action";

// Delete a transition the logged-in user owns. Likes referencing it
// are removed automatically via the schema's ON DELETE CASCADE constraints.
export async function deleteTransition(transitionId) {
  const user = await getUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const transition = await pg("transitions")
    .where({ id: transitionId })
    .first();

  if (!transition) return { ok: false, error: "not_found" };
  if (String(transition.user_id) !== String(user.id)) {
    return { ok: false, error: "forbidden" };
  }

  await pg("transitions").where({ id: transitionId }).del();
  return { ok: true };
}
