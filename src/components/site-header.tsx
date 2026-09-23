import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { SiteNav } from "@/components/layout/site-nav";

export async function SiteHeader() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAuthenticated = Boolean(user);

    return (
        <header className="sticky top-0 z-50 border-b border-mn-border/80 bg-mn-ivory/95 backdrop-blur-md">
            <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-5 sm:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    aria-label="Meri Nazmein Home"
                    className="flex h-full w-[150px] items-center sm:w-[180px]"
                >
                    <Image
                        src="/meri-nazmein-logo.png"
                        alt="Meri Nazmein"
                        width={190}
                        height={80}
                        priority
                        className="h-auto max-h-[72px] w-full object-contain"
                    />
                </Link>

                {/* Desktop Navigation */}
                <SiteNav />

                {/* Auth Actions */}
                <div className="hidden items-center gap-3 sm:flex">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/author/dashboard"
                                className="rounded-full px-4 py-2 text-sm font-semibold text-mn-navy transition-colors hover:bg-mn-cream"
                            >
                                Author Dashboard
                            </Link>

                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/author/login"
                                className="rounded-full px-4 py-2 text-sm font-medium text-mn-navy transition-colors hover:bg-mn-cream"
                            >
                                Login
                            </Link>

                            <Link
                                href="/author/signup"
                                className="rounded-full bg-mn-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-mn-blue hover:shadow-md"
                            >
                                Become an Author
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    aria-label="Open navigation menu"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-mn-border text-mn-navy transition-colors hover:bg-mn-cream lg:hidden"
                >
                    <span className="flex flex-col gap-1.5">
                        <span className="block h-0.5 w-5 bg-current" />
                        <span className="block h-0.5 w-5 bg-current" />
                        <span className="block h-0.5 w-5 bg-current" />
                    </span>
                </button>
            </div>
        </header>
    );
}