"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type FeaturedPoemType =
    | "NAZM"
    | "GHAZAL"
    | "SHAYARI";

type FeaturedPoem = {
    id: string;
    title: string;
    slug: string;
    content: string;
    type: FeaturedPoemType;
    publishedAt: string;
    author: {
        name: string;
        penName: string | null;
        username: string;
    };
};

type HeroFeaturedContentProps = {
    poems: FeaturedPoem[];
};

function getTypeLabel(
    type: FeaturedPoemType,
) {
    switch (type) {
        case "NAZM":
            return "Featured Nazm";

        case "GHAZAL":
            return "Featured Ghazal";

        case "SHAYARI":
            return "Featured Shayari";
    }
}

function getPoetryHref(
    poem: FeaturedPoem,
) {
    switch (poem.type) {
        case "NAZM":
            return `/nazmein/${poem.slug}`;

        case "GHAZAL":
            return `/ghazals/${poem.slug}`;

        case "SHAYARI":
            return `/shayari/${poem.slug}`;
    }
}

function getExcerpt(content: string) {
    const normalized = content
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    const lines = normalized
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const shortText = lines
        .slice(0, 4)
        .join("\n");

    if (shortText.length <= 180) {
        return shortText;
    }

    return `${shortText.slice(0, 180).trimEnd()}...`;
}

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    ).format(date);
}

export function HeroFeaturedContent({
    poems,
}: HeroFeaturedContentProps) {
    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [isPaused, setIsPaused] =
        useState(false);

    const [shareMessage, setShareMessage] =
        useState("");

    const currentPoem =
        poems[currentIndex];

    /*
     * Client-side rotation only.
     *
     * Important:
     * This does NOT call the database or API.
     * The poems were already fetched by the
     * server component and passed as props.
     */
    useEffect(() => {
        if (
            poems.length <= 1 ||
            isPaused
        ) {
            return;
        }

        const timer =
            window.setInterval(() => {
                setCurrentIndex(
                    (previous) =>
                        (previous + 1) %
                        poems.length,
                );
            }, 10000);

        return () =>
            window.clearInterval(timer);
    }, [
        poems.length,
        isPaused,
    ]);

    useEffect(() => {
        if (!shareMessage) {
            return;
        }

        const timer =
            window.setTimeout(() => {
                setShareMessage("");
            }, 2200);

        return () =>
            window.clearTimeout(timer);
    }, [shareMessage]);

    if (!currentPoem) {
        return (
            <div className="relative flex min-h-[360px] items-center sm:min-h-[400px]">
                <div className="w-full border-l border-mn-gold/50 pl-7 sm:pl-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-mn-gold-light">
                        Meri Nazmein
                    </p>

                    <p className="mt-4 max-w-sm font-poetry text-2xl leading-10 text-white sm:text-3xl">
                        Nayi poetry jald yahan
                        feature hogi.
                    </p>
                </div>
            </div>
        );
    }

    const displayAuthor =
        currentPoem.author.penName?.trim() ||
        currentPoem.author.name;

    const poetryHref =
        getPoetryHref(currentPoem);

    async function handleShare() {
        const url =
            `${window.location.origin}${poetryHref}`;

        try {
            if (
                typeof navigator.share ===
                "function"
            ) {
                await navigator.share({
                    title:
                        `${currentPoem.title} — ${displayAuthor}`,
                    text:
                        `Read "${currentPoem.title}" on Meri Nazmein.`,
                    url,
                });

                return;
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(
                    url,
                );

                setShareMessage(
                    "Link copied",
                );
            }
        } catch {
            // Native share cancelled.
        }
    }

    function previousPoem() {
        setCurrentIndex(
            (previous) =>
                (previous -
                    1 +
                    poems.length) %
                poems.length,
        );
    }

    function nextPoem() {
        setCurrentIndex(
            (previous) =>
                (previous + 1) %
                poems.length,
        );
    }

    return (
        <div
            className="relative flex min-h-[360px] items-center sm:min-h-[400px]"
            onMouseEnter={() =>
                setIsPaused(true)
            }
            onMouseLeave={() =>
                setIsPaused(false)
            }
            onFocusCapture={() =>
                setIsPaused(true)
            }
            onBlurCapture={() =>
                setIsPaused(false)
            }
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-mn-blue/15 blur-3xl"
            />

            <div className="relative w-full max-w-xl border-l border-mn-gold/55 pl-7 sm:pl-10">
                {/* =====================================================
            FEATURE TYPE + DATE
        ===================================================== */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-mn-gold-light">
                        {getTypeLabel(
                            currentPoem.type,
                        )}
                    </p>

                    <span
                        aria-hidden="true"
                        className="h-px w-8 bg-mn-gold/50"
                    />

                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                        {formatDate(
                            currentPoem.publishedAt,
                        )}
                    </p>
                </div>

                {/* =====================================================
            EXCERPT
        ===================================================== */}
                <p
                    key={currentPoem.id}
                    className="mt-8 max-w-lg whitespace-pre-line font-poetry text-lg leading-9 text-slate-200 sm:text-xl sm:leading-10"
                >
                    {getExcerpt(
                        currentPoem.content,
                    )}
                </p>

                {/* =====================================================
            WRITTEN BY
        ===================================================== */}
                <div className="mt-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mn-gold-light">
                        Written by
                    </p>

                    <Link
                        href={`/authors/${currentPoem.author.username}`}
                        className="mt-1 inline-block font-poetry text-xl text-white transition hover:text-mn-gold-light"
                    >
                        {displayAuthor}
                    </Link>
                </div>

                {/* =====================================================
            CONTROLS
        ===================================================== */}
                <div className="mt-9 flex items-center justify-between gap-5">
                    <div className="flex items-center gap-2">
                        {poems.map(
                            (poem, index) => (
                                <button
                                    key={poem.id}
                                    type="button"
                                    onClick={() =>
                                        setCurrentIndex(
                                            index,
                                        )
                                    }
                                    aria-label={`Show featured poetry ${index + 1}`}
                                    aria-current={
                                        index ===
                                        currentIndex
                                    }
                                    className={`h-1.5 rounded-full transition-all ${index ===
                                        currentIndex
                                        ? "w-8 bg-mn-gold"
                                        : "w-1.5 bg-white/30 hover:bg-white/60"
                                        }`}
                                />
                            ),
                        )}
                    </div>

                    {poems.length > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={
                                    previousPoem
                                }
                                aria-label="Previous featured poetry"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-white transition hover:border-mn-gold hover:text-mn-gold-light"
                            >
                                ←
                            </button>

                            <button
                                type="button"
                                onClick={nextPoem}
                                aria-label="Next featured poetry"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-white transition hover:border-mn-gold hover:text-mn-gold-light"
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>

                {/* =====================================================
            ACTIONS
        ===================================================== */}
                <div className="mt-5 flex flex-wrap items-center gap-5">
                    <Link
                        href={poetryHref}
                        className="text-sm font-semibold text-mn-gold-light transition hover:text-white"
                    >
                        Read the full poetry
                        <span
                            className="ml-2"
                            aria-hidden="true"
                        >
                            →
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="text-sm font-medium text-slate-400 transition hover:text-white"
                    >
                        Share
                    </button>

                    {shareMessage && (
                        <span
                            role="status"
                            className="text-xs text-mn-gold-light"
                        >
                            {shareMessage}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}