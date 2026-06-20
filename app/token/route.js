// Handled by NextAuth at /api/auth/callback/github
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(null, { status: 204 });
}
