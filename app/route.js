import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/home");
  else redirect("/login");
}
