"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthorLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Email or password is incorrect.");
      setLoading(false);
      return;
    }

    router.push("/author/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-mn-ivory">
      <div className="grid min-h-[calc(100vh-88px)] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Brand Panel */}
        <section className="relative hidden overflow-hidden bg-mn-navy-deep lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(18,103,214,0.28),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(212,166,42,0.16),transparent_30%)]" />

          <div className="relative flex w-full flex-col justify-between px-12 py-14 xl:px-20">
            <div>
              <Link href="/" aria-label="Meri Nazmein Home">
                <Image
                  src="/meri-nazmein-logo.png"
                  alt="Meri Nazmein"
                  width={420}
                  height={280}
                  priority
                  className="h-auto w-[280px] xl:w-[340px]"
                />
              </Link>

              <div className="mt-10 max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-mn-gold-light">
                  Author Space
                </p>

                <h1 className="mt-5 font-poetry text-5xl font-semibold leading-[1.05] text-white xl:text-6xl">
                  Wapas aaiye,
                  <br />
                  apne alfaaz ke paas.
                </h1>

                <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 xl:text-lg">
                  Apni nazmein, ghazals aur shayari ko manage kijiye aur apni
                  awaaz ko duniya tak pahunchaiye.
                </p>
              </div>
            </div>

            <div>
              <div className="mb-5 h-px w-28 bg-mn-gold" />

              <p className="font-poetry text-2xl italic leading-relaxed text-slate-200">
                “Har lafz ki apni ek kahani hai,
                <br />
                use duniya tak pahunchaiye.”
              </p>

              <p className="mt-4 text-xs uppercase tracking-[0.28em] text-mn-gold-light">
                Shayari • Soch • Zindagi
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-mn-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-28 h-72 w-72 rounded-full bg-mn-gold/10 blur-3xl" />
        </section>

        {/* Login Panel */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-xl">
            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">
              <Link href="/" aria-label="Meri Nazmein Home">
                <Image
                  src="/meri-nazmein-logo.png"
                  alt="Meri Nazmein"
                  width={300}
                  height={200}
                  priority
                  className="h-auto w-[210px]"
                />
              </Link>

              <div className="mt-6 h-px w-20 bg-mn-gold" />
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-mn-gold-dark">
                Welcome Back
              </p>

              <h2 className="mt-3 font-poetry text-5xl font-semibold leading-tight text-mn-navy">
                Author Login
              </h2>

              <p className="mt-4 max-w-lg text-base leading-7 text-mn-text-muted">
                Apne account me login kijiye aur apni poetry ko manage kijiye.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="rounded-3xl border border-mn-border bg-white p-6 shadow-[0_20px_60px_rgba(7,26,61,0.08)] sm:p-8"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-mn-navy"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-mn-border bg-mn-ivory/50 px-4 py-3.5 text-mn-text outline-none transition placeholder:text-slate-400 focus:border-mn-blue focus:ring-4 focus:ring-mn-blue/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-mn-navy"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Your password"
                    className="w-full rounded-xl border border-mn-border bg-mn-ivory/50 px-4 py-3.5 text-mn-text outline-none transition placeholder:text-slate-400 focus:border-mn-blue focus:ring-4 focus:ring-mn-blue/10"
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-mn-navy px-5 py-4 font-semibold text-white shadow-lg shadow-mn-navy/15 transition-all hover:bg-mn-blue hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login to Author Space"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>

              <p className="mt-5 text-center text-sm leading-6 text-mn-text-muted">
                Don&apos;t have an author account?{" "}
                <Link
                  href="/author/signup"
                  className="font-semibold text-mn-blue transition hover:text-mn-gold-dark"
                >
                  Become an Author
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}