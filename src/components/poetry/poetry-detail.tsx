import Link from "next/link";

import { PoetryAuthorCard } from "@/components/poetry/poetry-author-card";
import { PoetryHeader } from "@/components/poetry/poetry-header";
import type { PublicPoetryType } from "@/lib/poetry";

type PoetryDetailProps = {
    poem: {
        id: string;
        title: string;
        slug: string;
        content: string;
        type: PublicPoetryType;
        publishedAt: Date | null;
        updatedAt: Date;
        author: {
            name: string;
            username: string;
            penName: string | null,
            bio: string | null;
            avatarUrl: string | null;
        };
        category: {
            name: string;
            slug: string;
        } | null;
    };
};

function getPoetryHref(
    type: PublicPoetryType,
    slug: string,
) {
    switch (type) {
        case "NAZM":
            return `/nazmein/${slug}`;

        case "GHAZAL":
            return `/ghazals/${slug}`;

        case "SHAYARI":
            return `/shayari/${slug}`;
    }
}

export function PoetryDetail({
    poem,
}: PoetryDetailProps) {
    const collection =
        poem.type === "NAZM"
            ? {
                label: "Nazm",
                href: "/nazmein",
            }
            : poem.type === "GHAZAL"
                ? {
                    label: "Ghazal",
                    href: "/ghazals",
                }
                : {
                    label: "Shayari",
                    href: "/shayari",
                };

    const stanzas = poem.content
        .trim()
        .split(/\n\s*\n/)
        .filter(Boolean);

    const poemUrl = getPoetryHref(
        poem.type,
        poem.slug,
    );

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: poem.title,
        datePublished:
            poem.publishedAt?.toISOString(),
        dateModified: poem.updatedAt.toISOString(),
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": poemUrl,
        },
        author: {
            "@type": "Person",
            name: poem.author.name,
            url: `/authors/${poem.author.username}`,
        },
        publisher: {
            "@type": "Organization",
            name: "Meri Nazmein",
        },
    };

    return (
        <main className="min-h-[calc(100vh-88px)] bg-mn-ivory">
            {/* Reusable Poetry Header */}
            <PoetryHeader
                type={collection.label}
                title={poem.title}
                penName={poem.author.penName}
                authorName={poem.author.name}
                authorUsername={poem.author.username}
                publishedAt={poem.publishedAt}
                categoryName={
                    poem.category?.name
                }
            />

            {/* Poetry Reading Area */}
            <section className="border-b border-mn-border bg-white">
                <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
                    <article className="relative mx-auto max-w-2xl">
                        {/* Decorative Quote */}
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-1 -top-5 font-poetry text-7xl leading-none text-mn-gold/20 sm:-left-8 sm:-top-7 sm:text-8xl"
                        >
                            “
                        </span>

                        {/* Poetry */}
                        <div className="relative pl-5 sm:pl-8">
                            <div className="space-y-8 sm:space-y-9">
                                {stanzas.map(
                                    (
                                        stanza,
                                        index,
                                    ) => (
                                        <p
                                            key={`${poem.id}-stanza-${index}`}
                                            className="whitespace-pre-line text-left font-poetry text-[1.2rem] leading-[1.9] text-mn-text sm:text-[1.4rem] sm:leading-[1.95] lg:text-[1.55rem]"
                                        >
                                            {stanza}
                                        </p>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Poetry Ending */}
                        <div className="mt-10 flex items-center gap-3 sm:mt-11">
                            <div className="h-px w-12 bg-mn-gold" />

                            <span className="shrink-0 font-poetry text-base text-mn-navy/75 sm:text-lg">
                                {poem.title}
                            </span>

                            <div className="h-px flex-1 bg-mn-border" />
                        </div>
                    </article>
                </div>
            </section>

            {/* Reusable Author Card */}
            <PoetryAuthorCard
                name={poem.author.name}
                penName={poem.author.penName}
                username={poem.author.username}
                bio={poem.author.bio}
                authorHref={`/authors/${poem.author.username}`}
            />

            {/* Back Link */}
            <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
                <Link
                    href={collection.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-mn-blue transition-colors hover:text-mn-gold-dark"
                >
                    ← Back to {collection.label}
                </Link>
            </section>

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        jsonLd,
                    ),
                }}
            />
        </main>
    );
}