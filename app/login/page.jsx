"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { CgSpinner } from "react-icons/cg";
import { signup } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await signup(username, password);
        if (!res?.ok) {
          setError(res?.error || "Could not create the account.");
          return;
        }
      }
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError(
          mode === "signup"
            ? "Account created, but sign-in failed — try signing in."
            : "Invalid username or password."
        );
        return;
      }
      router.push("/home");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-white text-center tracking-tight">
          transitions
        </h1>
        <p className="text-white/50 text-sm text-center mt-1 mb-6">
          {mode === "signin" ? "Sign in to continue" : "Create an account"}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => signIn("github", { callbackUrl: "/home" })}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 transition text-white py-2.5 font-medium"
          >
            <FaGithub /> Continue with GitHub
          </button>
          <button
            onClick={() => signIn("google", { callbackUrl: "/home" })}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 transition text-white py-2.5 font-medium"
          >
            <FcGoogle size={18} /> Continue with Google
          </button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/40 text-xs">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/40 outline-none focus:bg-white/10 focus:border-white/20 transition"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/40 outline-none focus:bg-white/10 focus:border-white/20 transition"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 font-semibold py-2.5 hover:opacity-90 transition disabled:opacity-60"
          >
            {loading && <CgSpinner className="animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => {
            setError("");
            setMode(mode === "signin" ? "signup" : "signin");
          }}
          className="w-full text-center text-white/60 hover:text-white text-sm mt-4 transition"
        >
          {mode === "signin"
            ? "Don't have an account? Create one"
            : "Already have an account? Sign in"}
        </button>

        <div className="mt-6 pt-5 border-t border-white/10">
          <button
            onClick={() => router.push("/home")}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2.5 font-medium text-white/90 hover:bg-white/10 hover:text-white transition"
          >
            Browse without an account
            <span aria-hidden>→</span>
          </button>
          <p className="mt-2 text-center text-xs text-white/40">
            You can sign up later to upload your own transitions.
          </p>
        </div>
      </div>
    </div>
  );
}
