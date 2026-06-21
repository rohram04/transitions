"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 text-center">
        <h1 className="text-xl font-bold text-white tracking-tight">Sign out</h1>
        <p className="text-white/60 text-sm mt-2 mb-6">
          Are you sure you want to sign out of transitions?
        </p>

        <button
          onClick={() => {
            setLoading(true);
            signOut({ callbackUrl: "/login" });
          }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 font-semibold py-2.5 hover:opacity-90 transition disabled:opacity-60"
        >
          {loading && <CgSpinner className="animate-spin" />}
          Sign out
        </button>

        <button
          onClick={() => router.push("/home")}
          disabled={loading}
          className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 py-2.5 font-medium text-white transition hover:bg-white/10 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
