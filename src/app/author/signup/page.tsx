"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthorSignupPage() {
    const supabase = createClient();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const normalizedUsername = username.trim().toLowerCase();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
            setError(
                "Username can contain only lowercase letters, numbers and underscores.",
            );
            return;
        }

        if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
            setError("Username must be between 3 and 30 characters.");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    name: name.trim(),
                    username: normalizedUsername,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        if (!data.user) {
            setError("Unable to create your account. Please try again.");
            setLoading(false);
            return;
        }

        const response = await fetch("/api/auth/create-author", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.trim(),
                username: normalizedUsername,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            await supabase.auth.signOut();

            setError(result.error ?? "Unable to create author profile.");
            setLoading(false);
            return;
        }

        setSuccess("Your author account has been created successfully.");

        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-mn-ivory">
            <div className="grid min-h-[calc(100vh-88px)] lg:grid-cols-[0.9fr_1.1fr]">
                {/* Brand Panel */}
                <section className="relative hidden overflow-hidden bg-mn-navy-deep lg:flex">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(18,103,214,0.28),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(212,166,42,0.16),transparent_30%)]" />

                    <div className="relative flex w-full flex-col justify-between px-12 py-14 xl:px-20">
                        <div>
                            <Image
                                src="/meri-nazmein-logo.png"
                                alt="Meri Nazmein"
                                width={420}
                                height={280}
                                priority
                                className="h-auto w-[280px] xl:w-[340px]"
                            />

                            <div className="mt-10 max-w-xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-mn-gold-light">
                                    Alfaaz Se Aage
                                </p>

                                <h1 className="mt-5 font-poetry text-5xl font-semibold leading-[1.05] text-white xl:text-6xl">
                                    Har lafz ek ehsaas hai.
                                </h1>

                                <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 xl:text-lg">
                                    Apni nazmein, ghazals aur shayari ko duniya tak pahunchaiye.
                                    Apne alfaaz ko ek aisi jagah dijiye jahan woh yaad rakhe
                                    jaayen.
                                </p>
                            </div>
                        </div>

                        <div className="max-w-md">
                            <div className="mb-5 h-px w-28 bg-mn-gold" />

                            <p className="font-poetry text-2xl italic leading-relaxed text-slate-200">
                                “Lafz chhote ho sakte hain,
                                <br />
                                magar ehsaas bahut gehre.”
                            </p>

                            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-mn-gold-light">
                                Shayari • Soch • Zindagi
                            </p>
                        </div>
                    </div>

                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-mn-blue/20 blur-3xl" />
                    <div className="pointer-events-none absolute -right-20 top-28 h-72 w-72 rounded-full bg-mn-gold/10 blur-3xl" />
                </section>

                {/* Signup Panel */}
                <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12 xl:px-20">
                    <div className="w-full max-w-xl">
                        {/* Mobile brand */}
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
                                Author Space
                            </p>

                            <h2 className="mt-3 font-poetry text-5xl font-semibold leading-tight text-mn-navy">
                                Create your account
                            </h2>

                            <p className="mt-4 max-w-lg text-base leading-7 text-mn-text-muted">
                                Apna author account banaiye aur apni nazmein, ghazals aur
                                shayari publish karna shuru kijiye.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSignup}
                            className="rounded-3xl border border-mn-border bg-white p-6 shadow-[0_20px_60px_rgba(7,26,61,0.08)] sm:p-8"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-mn-navy"
                                    >
                                        Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Your name"
                                        className="w-full rounded-xl border border-mn-border bg-mn-ivory/50 px-4 py-3.5 text-mn-text outline-none transition placeholder:text-slate-400 focus:border-mn-blue focus:ring-4 focus:ring-mn-blue/10"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="username"
                                        className="mb-2 block text-sm font-semibold text-mn-navy"
                                    >
                                        Username
                                    </label>

                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="your-username"
                                        className="w-full rounded-xl border border-mn-border bg-mn-ivory/50 px-4 py-3.5 text-mn-text outline-none transition placeholder:text-slate-400 focus:border-mn-blue focus:ring-4 focus:ring-mn-blue/10"
                                    />
                                </div>

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
                                        minLength={8}
                                        autoComplete="new-password"
                                        placeholder="Minimum 8 characters"
                                        className="w-full rounded-xl border border-mn-border bg-mn-ivory/50 px-4 py-3.5 text-mn-text outline-none transition placeholder:text-slate-400 focus:border-mn-blue focus:ring-4 focus:ring-mn-blue/10"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-2 block text-sm font-semibold text-mn-navy"
                                    >
                                        Confirm Password
                                    </label>

                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        required
                                        minLength={8}
                                        autoComplete="new-password"
                                        placeholder="Repeat your password"
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

                            {success && (
                                <div
                                    role="status"
                                    className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
                                >
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-mn-navy px-5 py-4 font-semibold text-white shadow-lg shadow-mn-navy/15 transition-all hover:bg-mn-blue hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating account..." : "Create Author Account"}
                                {!loading && <span aria-hidden="true">→</span>}
                            </button>

                            <p className="mt-5 text-center text-sm leading-6 text-mn-text-muted">
                                Already have an author account?{" "}
                                <Link
                                    href="/author/login"
                                    className="font-semibold text-mn-blue transition hover:text-mn-gold-dark"
                                >
                                    Login
                                </Link>
                            </p>
                        </form>

                        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                            By creating an account, you agree to our Terms & Conditions and
                            Privacy Policy.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}